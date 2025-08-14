#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function diagnoseNavigation() {
  console.log('🔍 Diagnosing Navigation Issues...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'log' || type === 'warn' || type === 'error') {
        console.log(`[${type.toUpperCase()}] ${text}`);
      }
    });
    
    // Navigate to the site
    console.log('🌐 Loading website...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if sections exist
    console.log('\n📋 Checking section elements...');
    const sections = ['home', 'team', 'projects', 'achievements', 'gallery', 'events', 'announcements', 'alumni', 'apply', 'contact'];
    
    for (const sectionId of sections) {
      const element = await page.$(`#${sectionId}`);
      if (element) {
        const rect = await element.boundingBox();
        console.log(`✅ Section '${sectionId}' found at y: ${rect?.y || 'unknown'}`);
      } else {
        console.log(`❌ Section '${sectionId}' NOT FOUND`);
      }
    }
    
    // Check navigation component
    console.log('\n🧭 Checking navigation component...');
    const nav = await page.$('nav[role="navigation"]');
    if (nav) {
      console.log('✅ Navigation component found');
      
      // Check navigation buttons
      const navButtons = await page.$$('nav button');
      console.log(`📊 Found ${navButtons.length} navigation buttons`);
      
      // Test clicking navigation buttons
      console.log('\n🖱️ Testing navigation clicks...');
      
      for (let i = 0; i < Math.min(3, navButtons.length); i++) {
        const button = navButtons[i];
        const buttonText = await page.evaluate(el => el.textContent, button);
        
        console.log(`\n🔘 Testing button: "${buttonText}"`);
        
        // Get initial scroll position
        const initialScroll = await page.evaluate(() => window.scrollY);
        console.log(`📍 Initial scroll: ${initialScroll}`);
        
        // Click the button
        await button.click();
        
        // Wait for scroll animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get final scroll position
        const finalScroll = await page.evaluate(() => window.scrollY);
        console.log(`📍 Final scroll: ${finalScroll}`);
        
        if (finalScroll !== initialScroll) {
          console.log(`✅ Navigation worked! Scrolled from ${initialScroll} to ${finalScroll}`);
        } else {
          console.log(`❌ Navigation failed! No scroll change detected`);
        }
      }
      
    } else {
      console.log('❌ Navigation component NOT FOUND');
    }
    
    // Check for JavaScript errors
    console.log('\n🐛 Checking for JavaScript errors...');
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Test mobile navigation
    console.log('\n📱 Testing mobile navigation...');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mobileMenuButton = await page.$('#mobile-menu-button');
    if (mobileMenuButton) {
      console.log('✅ Mobile menu button found');
      
      // Click mobile menu
      await mobileMenuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mobileMenu = await page.$('#mobile-menu');
      if (mobileMenu) {
        console.log('✅ Mobile menu opens correctly');
        
        // Test mobile navigation click
        const mobileNavButton = await page.$('#mobile-menu button');
        if (mobileNavButton) {
          const initialScroll = await page.evaluate(() => window.scrollY);
          await mobileNavButton.click();
          await new Promise(resolve => setTimeout(resolve, 1500));
          const finalScroll = await page.evaluate(() => window.scrollY);
          
          if (finalScroll !== initialScroll) {
            console.log('✅ Mobile navigation works correctly');
          } else {
            console.log('❌ Mobile navigation failed');
          }
        }
      } else {
        console.log('❌ Mobile menu does not open');
      }
    } else {
      console.log('❌ Mobile menu button NOT FOUND');
    }
    
    console.log('\n🎯 Diagnosis complete!');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run diagnosis
diagnoseNavigation().catch(console.error);