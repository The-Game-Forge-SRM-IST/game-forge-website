#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class IntegrationTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      responsive: [],
      functionality: [],
      accessibility: [],
      performance: [],
    };
  }

  async init() {
    console.log('🚀 Initializing integration tests...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Enable error logging
    this.page.on('pageerror', (error) => {
      console.log('❌ Page Error:', error.message);
    });
  }

  async testResponsiveDesign() {
    console.log('\n📱 Testing responsive design...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      try {
        await this.page.setViewport(viewport);
        await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        
        // Wait for Three.js to load
        await this.page.waitForLoadState('networkidle');
        
        // Check if navigation is visible and functional
        const navVisible = await this.page.evaluate(() => {
          const nav = document.querySelector('nav');
          return nav && window.getComputedStyle(nav).display !== 'none';
        });

        // Check if content is properly laid out
        const contentLayout = await this.page.evaluate(() => {
          const sections = document.querySelectorAll('section');
          return sections.length > 0 && Array.from(sections).every(section => {
            const rect = section.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
        });

        // Check for horizontal scroll
        const hasHorizontalScroll = await this.page.evaluate(() => {
          return document.body.scrollWidth > window.innerWidth;
        });

        const result = {
          viewport: viewport.name,
          navVisible,
          contentLayout,
          noHorizontalScroll: !hasHorizontalScroll,
          passed: navVisible && contentLayout && !hasHorizontalScroll,
        };

        this.results.responsive.push(result);
        console.log(`  ${viewport.name}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
        
      } catch (error) {
        console.log(`  ${viewport.name}: ❌ ERROR - ${error.message}`);
        this.results.responsive.push({
          viewport: viewport.name,
          passed: false,
          error: error.message,
        });
      }
    }
  }

  async testFunctionality() {
    console.log('\n⚙️ Testing core functionality...');
    
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    const tests = [
      {
        name: 'Navigation Links',
        test: async () => {
          const navLinks = await this.page.$$('nav a[href^="#"]');
          return navLinks.length >= 8; // Should have at least 8 navigation links
        }
      },
      {
        name: 'Three.js Canvas',
        test: async () => {
          await this.page.waitForLoadState('networkidle'); // Wait for Three.js to initialize
          const canvas = await this.page.$('canvas');
          return canvas !== null;
        }
      },
      {
        name: 'Smooth Scrolling',
        test: async () => {
          const teamLink = await this.page.$('a[href="#team"]');
          if (teamLink) {
            await teamLink.click();
            await this.page.waitForLoadState('networkidle');
            const scrollPosition = await this.page.evaluate(() => window.pageYOffset);
            return scrollPosition > 0;
          }
          return false;
        }
      },
      {
        name: 'Form Validation',
        test: async () => {
          // Navigate to application section
          const applyLink = await this.page.$('a[href="#apply"]');
          if (applyLink) {
            await applyLink.click();
            await this.page.waitForTimeout(1000);
            
            // Try to submit empty form
            const submitButton = await this.page.$('button[type="submit"]');
            if (submitButton) {
              await submitButton.click();
              await this.page.waitForTimeout(500);
              
              // Check for validation errors
              const errors = await this.page.$$('.text-red-500, .error, [role="alert"]');
              return errors.length > 0;
            }
          }
          return false;
        }
      },
      {
        name: 'Image Loading',
        test: async () => {
          const images = await this.page.$$('img');
          if (images.length === 0) return true; // No images to test
          
          const loadedImages = await this.page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            return imgs.filter(img => img.complete && img.naturalHeight !== 0).length;
          });
          
          return loadedImages === images.length;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = await test.test();
        this.results.functionality.push({
          name: test.name,
          passed,
        });
        console.log(`  ${test.name}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      } catch (error) {
        console.log(`  ${test.name}: ❌ ERROR - ${error.message}`);
        this.results.functionality.push({
          name: test.name,
          passed: false,
          error: error.message,
        });
      }
    }
  }

  async testAccessibility() {
    console.log('\n♿ Testing accessibility...');
    
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    const tests = [
      {
        name: 'Skip Links',
        test: async () => {
          const skipLink = await this.page.$('a[href="#main-content"], .skip-link');
          return skipLink !== null;
        }
      },
      {
        name: 'Heading Structure',
        test: async () => {
          const h1Count = await this.page.$$eval('h1', els => els.length);
          const headings = await this.page.$$('h1, h2, h3, h4, h5, h6');
          return h1Count === 1 && headings.length > 0;
        }
      },
      {
        name: 'Alt Text for Images',
        test: async () => {
          const imagesWithoutAlt = await this.page.$$eval('img:not([alt])', els => els.length);
          return imagesWithoutAlt === 0;
        }
      },
      {
        name: 'Keyboard Navigation',
        test: async () => {
          // Test Tab navigation
          await this.page.keyboard.press('Tab');
          const focusedElement = await this.page.evaluate(() => document.activeElement.tagName);
          return ['A', 'BUTTON', 'INPUT'].includes(focusedElement);
        }
      },
      {
        name: 'ARIA Labels',
        test: async () => {
          const buttonsWithoutLabels = await this.page.$$eval(
            'button:not([aria-label]):not([aria-labelledby]):not(:has(> span:not(.sr-only)))',
            els => els.filter(el => !el.textContent.trim()).length
          );
          return buttonsWithoutLabels === 0;
        }
      }
    ];

    for (const test of tests) {
      try {
        const passed = await test.test();
        this.results.accessibility.push({
          name: test.name,
          passed,
        });
        console.log(`  ${test.name}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      } catch (error) {
        console.log(`  ${test.name}: ❌ ERROR - ${error.message}`);
        this.results.accessibility.push({
          name: test.name,
          passed: false,
          error: error.message,
        });
      }
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing performance metrics...');
    
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    const metrics = await this.page.metrics();
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });

    const tests = [
      {
        name: 'DOM Content Loaded < 2s',
        value: performanceMetrics.domContentLoaded,
        threshold: 2000,
        passed: performanceMetrics.domContentLoaded < 2000,
      },
      {
        name: 'First Contentful Paint < 1.5s',
        value: performanceMetrics.firstContentfulPaint,
        threshold: 1500,
        passed: performanceMetrics.firstContentfulPaint < 1500,
      },
      {
        name: 'JS Heap Size < 50MB',
        value: metrics.JSHeapUsedSize / 1024 / 1024,
        threshold: 50,
        passed: (metrics.JSHeapUsedSize / 1024 / 1024) < 50,
      },
      {
        name: 'DOM Nodes < 3000',
        value: metrics.Nodes,
        threshold: 3000,
        passed: metrics.Nodes < 3000,
      }
    ];

    for (const test of tests) {
      this.results.performance.push(test);
      console.log(`  ${test.name}: ${test.passed ? '✅ PASS' : '❌ FAIL'} (${Math.round(test.value)}${test.name.includes('MB') ? 'MB' : test.name.includes('Nodes') ? '' : 'ms'})`);
    }
  }

  async generateReport() {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      summary: {
        responsive: this.results.responsive.filter(r => r.passed).length + '/' + this.results.responsive.length,
        functionality: this.results.functionality.filter(r => r.passed).length + '/' + this.results.functionality.length,
        accessibility: this.results.accessibility.filter(r => r.passed).length + '/' + this.results.accessibility.length,
        performance: this.results.performance.filter(r => r.passed).length + '/' + this.results.performance.length,
      },
      details: this.results,
    };

    const reportPath = path.join(__dirname, '../integration-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Test Summary:');
    console.log('='.repeat(50));
    console.log(`Responsive Design: ${report.summary.responsive}`);
    console.log(`Functionality: ${report.summary.functionality}`);
    console.log(`Accessibility: ${report.summary.accessibility}`);
    console.log(`Performance: ${report.summary.performance}`);
    console.log(`\nDetailed report saved to: ${reportPath}`);

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      await this.testResponsiveDesign();
      await this.testFunctionality();
      await this.testAccessibility();
      await this.testPerformance();
      
      const report = await this.generateReport();
      
      // Check if all critical tests passed
      const criticalTests = [
        ...this.results.responsive,
        ...this.results.functionality.filter(t => ['Navigation Links', 'Three.js Canvas'].includes(t.name)),
        ...this.results.accessibility.filter(t => ['Skip Links', 'Heading Structure'].includes(t.name)),
      ];
      
      const allCriticalPassed = criticalTests.every(t => t.passed);
      
      if (allCriticalPassed) {
        console.log('\n🎉 All critical integration tests passed!');
        return true;
      } else {
        console.log('\n⚠️  Some critical tests failed. Check the detailed report.');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Integration test error:', error);
      return false;
    } finally {
      await this.cleanup();
    }
  }
}

// Check if server is running
const http = require('http');
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
};

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server not running on localhost:3000');
    console.log('Please run: npm run build && npm start');
    process.exit(1);
  }

  const tester = new IntegrationTester();
  const success = await tester.run();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = IntegrationTester;