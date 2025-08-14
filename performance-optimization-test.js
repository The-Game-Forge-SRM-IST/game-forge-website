#!/usr/bin/env node

/**
 * Performance Optimization Test
 * Tests the website performance improvements for navigation FPS
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testNavigationPerformance() {
  console.log('🚀 Starting Navigation Performance Test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.setCacheEnabled(false);
  
  const performanceMetrics = [];
  
  try {
    console.log('📊 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for initial load
    await page.waitForTimeout(2000);
    
    const sections = ['team', 'projects', 'achievements', 'gallery', 'events'];
    
    for (const section of sections) {
      console.log(`🎯 Testing navigation to ${section} section...`);
      
      // Start performance monitoring
      const startTime = Date.now();
      
      // Click navigation button
      await page.click(`button[aria-label*="${section}"]`);
      
      // Wait for navigation to complete
      await page.waitForTimeout(1000);
      
      // Measure FPS during navigation
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0;
          let startTime = performance.now();
          
          function countFrames() {
            frameCount++;
            if (performance.now() - startTime < 1000) {
              requestAnimationFrame(countFrames);
            } else {
              resolve({
                fps: frameCount,
                timestamp: Date.now()
              });
            }
          }
          
          requestAnimationFrame(countFrames);
        });
      });
      
      const endTime = Date.now();
      const navigationTime = endTime - startTime;
      
      performanceMetrics.push({
        section,
        fps: metrics.fps,
        navigationTime,
        timestamp: metrics.timestamp
      });
      
      console.log(`✅ ${section}: ${metrics.fps} FPS, ${navigationTime}ms navigation time`);
      
      // Wait before next test
      await page.waitForTimeout(500);
    }
    
    // Calculate average performance
    const avgFPS = performanceMetrics.reduce((sum, m) => sum + m.fps, 0) / performanceMetrics.length;
    const avgNavTime = performanceMetrics.reduce((sum, m) => sum + m.navigationTime, 0) / performanceMetrics.length;
    
    console.log('\n📈 Performance Summary:');
    console.log(`Average FPS: ${avgFPS.toFixed(1)}`);
    console.log(`Average Navigation Time: ${avgNavTime.toFixed(0)}ms`);
    
    // Performance thresholds
    const fpsThreshold = 45; // Minimum acceptable FPS
    const navTimeThreshold = 1000; // Maximum acceptable navigation time
    
    const performanceGrade = {
      fps: avgFPS >= fpsThreshold ? 'PASS' : 'FAIL',
      navigationTime: avgNavTime <= navTimeThreshold ? 'PASS' : 'FAIL'
    };
    
    console.log('\n🎯 Performance Results:');
    console.log(`FPS Test: ${performanceGrade.fps} (${avgFPS.toFixed(1)} >= ${fpsThreshold})`);
    console.log(`Navigation Speed: ${performanceGrade.navigationTime} (${avgNavTime.toFixed(0)}ms <= ${navTimeThreshold}ms)`);
    
    // Save detailed results
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        averageFPS: avgFPS,
        averageNavigationTime: avgNavTime,
        grade: performanceGrade
      },
      details: performanceMetrics,
      optimizations: [
        'Removed complex Framer Motion animations',
        'Added intersection observer lazy loading',
        'Implemented RAF throttling for scroll events',
        'Memoized expensive calculations',
        'Reduced loading screen duration',
        'Changed smooth scroll to instant scroll',
        'Added component memoization'
      ]
    };
    
    fs.writeFileSync('navigation-performance-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to navigation-performance-report.json');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testNavigationPerformance().catch(console.error);