#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testMobileNavigation() {
  console.log('📱 Testing Mobile Navigation...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    // Navigate to the site
    console.log('🌐 Loading website on mobile...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if mobile menu button exists
    console.log('\n🔍 Checking mobile menu button...');
    const mobileMenuButton = await page.$('#mobile-menu-button');
    
    if (mobileMenuButton) {
      console.log('✅ Mobile menu button found');
      
      // Click mobile menu button
      console.log('🖱️ Opening mobile menu...');
      await mobileMenuButton.click();
      
      // Wait for menu animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if mobile menu opened
      const mobileMenu = await page.$('#mobile-menu');
      if (mobileMenu) {
        console.log('✅ Mobile menu opened successfully');
        
        // Get mobile navigation buttons
        const mobileNavButtons = await page.$$('#mobile-menu button');
        console.log(`📊 Found ${mobileNavButtons.length} mobile navigation buttons`);
        
        // Test clicking a mobile navigation button
        if (mobileNavButtons.length > 1) {
          const teamButton = mobileNavButtons[1]; // Team button
          const buttonText = await page.evaluate(el => el.textContent, teamButton);
          
          console.log(`\n🔘 Testing mobile button: "${buttonText}"`);
          
          // Get initial scroll position
          const initialScroll = await page.evaluate(() => window.scrollY);
          console.log(`📍 Initial scroll: ${initialScroll}`);
          
          // Click the button
          await teamButton.click();
          
          // Wait for scroll animation and menu close
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Get final scroll position
          const finalScroll = await page.evaluate(() => window.scrollY);
          console.log(`📍 Final scroll: ${finalScroll}`);
          
          if (finalScroll !== initialScroll) {
            console.log(`✅ Mobile navigation worked! Scrolled from ${initialScroll} to ${finalScroll}`);
          } else {
            console.log(`❌ Mobile navigation failed! No scroll change detected`);
          }
          
          // Check if mobile menu closed
          const menuStillOpen = await page.evaluate(() => {
            const menu = document.getElementById('mobile-menu');
            return menu && menu.offsetHeight > 0;
          });
          
          if (!menuStillOpen) {
            console.log('✅ Mobile menu closed after navigation');
          } else {
            console.log('⚠️ Mobile menu is still open');
          }
        }
        
      } else {
        console.log('❌ Mobile menu did not open');
      }
      
    } else {
      console.log('❌ Mobile menu button not found');
    }
    
    // Test touch interactions
    console.log('\n👆 Testing touch interactions...');
    
    // Try to scroll manually on mobile
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const scrollPosition = await page.evaluate(() => window.scrollY);
    console.log(`📱 Manual scroll test - position: ${scrollPosition}`);
    
    if (scrollPosition > 400) {
      console.log('✅ Touch scrolling works correctly');
    } else {
      console.log('⚠️ Touch scrolling may have issues');
    }
    
    console.log('\n🎯 Mobile navigation test complete!');
    
  } catch (error) {
    console.error('❌ Error during mobile test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testMobileNavigation().catch(console.error);