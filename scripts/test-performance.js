#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testPerformance() {
  console.log('⚡ Testing Navigation Performance...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Navigate to the site
    console.log('🌐 Loading website...');
    const navigationStart = Date.now();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const navigationEnd = Date.now();
    
    console.log(`📊 Page load time: ${navigationEnd - navigationStart}ms`);
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test navigation click performance
    console.log('\n⚡ Testing navigation click performance...');
    
    const navButtons = await page.$$('nav[role="navigation"] button');
    const performanceResults = [];
    
    for (let i = 1; i < Math.min(5, navButtons.length); i++) {
      const button = navButtons[i];
      const buttonText = await page.evaluate(el => el.textContent, button);
      
      console.log(`\n🔘 Testing performance for: ${buttonText}`);
      
      // Measure click to scroll start time
      const clickStart = Date.now();
      await button.click();
      
      // Wait for scroll to complete
      let scrollComplete = false;
      let scrollTimeout = 0;
      const maxTimeout = 3000; // 3 seconds max
      
      while (!scrollComplete && scrollTimeout < maxTimeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
        scrollTimeout += 100;
        
        // Check if scroll animation is complete by checking if scroll position is stable
        const scroll1 = await page.evaluate(() => window.scrollY);
        await new Promise(resolve => setTimeout(resolve, 100));
        const scroll2 = await page.evaluate(() => window.scrollY);
        
        if (Math.abs(scroll1 - scroll2) < 1) {
          scrollComplete = true;
        }
      }
      
      const clickEnd = Date.now();
      const totalTime = clickEnd - clickStart;
      
      performanceResults.push({
        section: buttonText,
        time: totalTime,
        timeout: scrollTimeout >= maxTimeout
      });
      
      console.log(`⏱️ Navigation time: ${totalTime}ms ${scrollTimeout >= maxTimeout ? '(TIMEOUT)' : ''}`);
    }
    
    // Calculate performance metrics
    const validResults = performanceResults.filter(r => !r.timeout);
    const avgTime = validResults.reduce((sum, r) => sum + r.time, 0) / validResults.length;
    const maxTime = Math.max(...validResults.map(r => r.time));
    const minTime = Math.min(...validResults.map(r => r.time));
    
    console.log('\n📊 Performance Summary:');
    console.log(`  Average navigation time: ${avgTime.toFixed(1)}ms`);
    console.log(`  Fastest navigation: ${minTime}ms`);
    console.log(`  Slowest navigation: ${maxTime}ms`);
    console.log(`  Timeouts: ${performanceResults.filter(r => r.timeout).length}`);
    
    // Performance benchmarks
    if (avgTime < 1000) {
      console.log('✅ Navigation performance is excellent (<1s)');
    } else if (avgTime < 2000) {
      console.log('✅ Navigation performance is good (<2s)');
    } else {
      console.log('⚠️ Navigation performance could be improved (>2s)');
    }
    
    // Test scroll performance during rapid clicks
    console.log('\n🚀 Testing rapid navigation clicks...');
    
    const rapidTestStart = Date.now();
    
    // Click multiple navigation buttons rapidly
    for (let i = 1; i < Math.min(4, navButtons.length); i++) {
      await navButtons[i].click();
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between clicks
    }
    
    // Wait for all animations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const rapidTestEnd = Date.now();
    console.log(`⚡ Rapid navigation test completed in: ${rapidTestEnd - rapidTestStart}ms`);
    
    // Test memory usage (basic check)
    const memoryUsage = await page.evaluate(() => {
      if (performance.memory) {
        return {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }
      return null;
    });
    
    if (memoryUsage) {
      console.log('\n💾 Memory Usage:');
      console.log(`  Used: ${memoryUsage.used}MB`);
      console.log(`  Total: ${memoryUsage.total}MB`);
      console.log(`  Limit: ${memoryUsage.limit}MB`);
      
      if (memoryUsage.used < 50) {
        console.log('✅ Memory usage is efficient');
      } else if (memoryUsage.used < 100) {
        console.log('✅ Memory usage is acceptable');
      } else {
        console.log('⚠️ Memory usage is high');
      }
    }
    
    console.log('\n🎯 Performance test complete!');
    
  } catch (error) {
    console.error('❌ Error during performance test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testPerformance().catch(console.error);