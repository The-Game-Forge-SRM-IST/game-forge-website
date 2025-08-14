#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testAnimationPerformance() {
  console.log('🎬 Testing Navigation Animation Performance...\n');
  
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
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test rapid navigation clicks to see animation responsiveness
    console.log('\n⚡ Testing animation responsiveness with rapid clicks...');
    
    const navButtons = await page.$$('nav[role="navigation"] button');
    console.log(`Found ${navButtons.length} navigation buttons`);
    
    // Test rapid clicking between sections
    const testSequence = [1, 2, 3, 4, 1, 3, 2]; // Team, Projects, Achievements, Gallery, Team, Achievements, Projects
    
    for (let i = 0; i < testSequence.length; i++) {
      const buttonIndex = testSequence[i];
      if (buttonIndex < navButtons.length) {
        const button = navButtons[buttonIndex];
        const buttonText = await page.evaluate(el => el.textContent, button);
        
        console.log(`🔘 Click ${i + 1}: ${buttonText}`);
        
        const clickStart = Date.now();
        await button.click();
        
        // Wait a short time to see how quickly the indicator moves
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Check if the active indicator has moved
        const activeButton = await page.$('nav button[aria-current="page"]');
        const currentActive = activeButton ? await page.evaluate(el => el.textContent, activeButton) : 'none';
        
        const clickEnd = Date.now();
        const responseTime = clickEnd - clickStart;
        
        console.log(`  ⏱️ Response time: ${responseTime}ms, Active: ${currentActive}`);
        
        if (responseTime < 400) {
          console.log('  ✅ Animation is responsive');
        } else {
          console.log('  ⚠️ Animation is slow');
        }
      }
    }
    
    // Test scroll-based animation updates
    console.log('\n📜 Testing scroll-based animation updates...');
    
    // Scroll to different positions and measure how quickly the indicator updates
    const scrollTests = [
      { position: 0, expectedSection: 'home' },
      { position: 1500, expectedSection: 'team' },
      { position: 3500, expectedSection: 'projects' },
      { position: 6000, expectedSection: 'achievements' }
    ];
    
    for (const test of scrollTests) {
      console.log(`\n🔄 Scrolling to ${test.position}px (expecting ${test.expectedSection})...`);
      
      const scrollStart = Date.now();
      
      // Scroll to position
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }, test.position);
      
      // Wait for scroll to complete and check how quickly indicator updates
      let indicatorUpdated = false;
      let checkCount = 0;
      const maxChecks = 20; // 2 seconds max
      
      while (!indicatorUpdated && checkCount < maxChecks) {
        await new Promise(resolve => setTimeout(resolve, 100));
        checkCount++;
        
        const activeButton = await page.$('nav button[aria-current="page"]');
        const currentActive = activeButton ? await page.evaluate(el => el.textContent.toLowerCase(), activeButton) : '';
        
        if (currentActive.includes(test.expectedSection)) {
          indicatorUpdated = true;
          const scrollEnd = Date.now();
          const updateTime = scrollEnd - scrollStart;
          
          console.log(`  ✅ Indicator updated in ${updateTime}ms (${checkCount} checks)`);
          
          if (updateTime < 1000) {
            console.log('  ✅ Scroll animation is fast');
          } else {
            console.log('  ⚠️ Scroll animation is slow');
          }
        }
      }
      
      if (!indicatorUpdated) {
        console.log('  ❌ Indicator did not update within 2 seconds');
      }
    }
    
    // Test mobile animation performance
    console.log('\n📱 Testing mobile animation performance...');
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Open mobile menu
    const mobileMenuButton = await page.$('#mobile-menu-button');
    if (mobileMenuButton) {
      console.log('🔘 Opening mobile menu...');
      const menuStart = Date.now();
      
      await mobileMenuButton.click();
      
      // Wait for menu to open
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const menuEnd = Date.now();
      const menuTime = menuEnd - menuStart;
      
      console.log(`⏱️ Mobile menu opened in ${menuTime}ms`);
      
      // Test mobile navigation click
      const mobileNavButtons = await page.$$('#mobile-menu button');
      if (mobileNavButtons.length > 1) {
        console.log('🔘 Testing mobile navigation click...');
        
        const mobileClickStart = Date.now();
        await mobileNavButtons[1].click(); // Click Team
        
        // Wait for navigation and menu close
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mobileClickEnd = Date.now();
        const mobileClickTime = mobileClickEnd - mobileClickStart;
        
        console.log(`⏱️ Mobile navigation completed in ${mobileClickTime}ms`);
        
        if (mobileClickTime < 1000) {
          console.log('✅ Mobile animation is fast');
        } else {
          console.log('⚠️ Mobile animation is slow');
        }
      }
    }
    
    console.log('\n🎯 Animation performance test complete!');
    
  } catch (error) {
    console.error('❌ Error during animation test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testAnimationPerformance().catch(console.error);