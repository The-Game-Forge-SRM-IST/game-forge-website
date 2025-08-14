#!/usr/bin/env node

const lighthouse = require('lighthouse').default || require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const config = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36',
  },
};

const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};

async function runLighthouse(url, config, outputPath) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options, config);

  // Save the report
  const reportHtml = runnerResult.report;
  fs.writeFileSync(outputPath, reportHtml);

  await chrome.kill();

  return runnerResult.lhr;
}

async function testPerformance() {
  const url = 'http://localhost:3000';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  console.log('🚀 Starting Lighthouse performance tests...');
  console.log(`Testing URL: ${url}`);
  
  try {
    // Test desktop performance
    console.log('\n📊 Running desktop performance test...');
    const desktopResults = await runLighthouse(
      url,
      config,
      path.join(__dirname, `../lighthouse-desktop-${timestamp}.html`)
    );

    // Test mobile performance
    console.log('\n📱 Running mobile performance test...');
    const mobileResults = await runLighthouse(
      url,
      mobileConfig,
      path.join(__dirname, `../lighthouse-mobile-${timestamp}.html`)
    );

    // Analyze results
    console.log('\n📈 Performance Results:');
    console.log('='.repeat(50));
    
    console.log('\nDesktop Scores:');
    console.log(`Performance: ${Math.round(desktopResults.categories.performance.score * 100)}/100`);
    console.log(`Accessibility: ${Math.round(desktopResults.categories.accessibility.score * 100)}/100`);
    console.log(`Best Practices: ${Math.round(desktopResults.categories['best-practices'].score * 100)}/100`);
    console.log(`SEO: ${Math.round(desktopResults.categories.seo.score * 100)}/100`);

    console.log('\nMobile Scores:');
    console.log(`Performance: ${Math.round(mobileResults.categories.performance.score * 100)}/100`);
    console.log(`Accessibility: ${Math.round(mobileResults.categories.accessibility.score * 100)}/100`);
    console.log(`Best Practices: ${Math.round(mobileResults.categories['best-practices'].score * 100)}/100`);
    console.log(`SEO: ${Math.round(mobileResults.categories.seo.score * 100)}/100`);

    // Core Web Vitals
    console.log('\n🎯 Core Web Vitals (Desktop):');
    const desktopMetrics = desktopResults.audits;
    console.log(`First Contentful Paint: ${Math.round(desktopMetrics['first-contentful-paint'].numericValue)}ms`);
    console.log(`Largest Contentful Paint: ${Math.round(desktopMetrics['largest-contentful-paint'].numericValue)}ms`);
    console.log(`Cumulative Layout Shift: ${desktopMetrics['cumulative-layout-shift'].numericValue.toFixed(3)}`);
    console.log(`Total Blocking Time: ${Math.round(desktopMetrics['total-blocking-time'].numericValue)}ms`);

    console.log('\n🎯 Core Web Vitals (Mobile):');
    const mobileMetrics = mobileResults.audits;
    console.log(`First Contentful Paint: ${Math.round(mobileMetrics['first-contentful-paint'].numericValue)}ms`);
    console.log(`Largest Contentful Paint: ${Math.round(mobileMetrics['largest-contentful-paint'].numericValue)}ms`);
    console.log(`Cumulative Layout Shift: ${mobileMetrics['cumulative-layout-shift'].numericValue.toFixed(3)}`);
    console.log(`Total Blocking Time: ${Math.round(mobileMetrics['total-blocking-time'].numericValue)}ms`);

    // Check if scores meet requirements
    const desktopPerf = Math.round(desktopResults.categories.performance.score * 100);
    const mobilePerf = Math.round(mobileResults.categories.performance.score * 100);
    const accessibility = Math.round(desktopResults.categories.accessibility.score * 100);

    console.log('\n✅ Performance Requirements Check:');
    console.log(`Desktop Performance >= 90: ${desktopPerf >= 90 ? '✅ PASS' : '❌ FAIL'} (${desktopPerf})`);
    console.log(`Mobile Performance >= 70: ${mobilePerf >= 70 ? '✅ PASS' : '❌ FAIL'} (${mobilePerf})`);
    console.log(`Accessibility >= 95: ${accessibility >= 95 ? '✅ PASS' : '❌ FAIL'} (${accessibility})`);

    const allPassed = desktopPerf >= 90 && mobilePerf >= 70 && accessibility >= 95;
    
    if (allPassed) {
      console.log('\n🎉 All performance requirements met!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some performance requirements not met. Check the detailed reports.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error running Lighthouse tests:', error);
    process.exit(1);
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

  await testPerformance();
}

if (require.main === module) {
  main();
}

module.exports = { testPerformance, runLighthouse };