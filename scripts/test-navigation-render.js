#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testNavigationRender() {
  console.log('🔍 Testing Navigation Component Rendering...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false,
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    // Navigate to the site
    console.log('🌐 Loading website...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if navigation exists in DOM
    console.log('\n🔍 Checking navigation in DOM...');
    
    const navExists = await page.evaluate(() => {
      const nav = document.querySelector('nav[role="navigation"]');
      return {
        exists: !!nav,
        className: nav?.className || 'N/A',
        innerHTML: nav?.innerHTML?.substring(0, 200) || 'N/A'
      };
    });
    
    console.log('Navigation exists:', navExists.exists);
    console.log('Navigation className:', navExists.className);
    console.log('Navigation innerHTML preview:', navExists.innerHTML);
    
    // Check for AppLayout
    const appLayoutExists = await page.evaluate(() => {
      return !!document.querySelector('.min-h-screen.text-white');
    });
    console.log('AppLayout container exists:', appLayoutExists);
    
    // Check for any React errors
    const reactErrors = await page.evaluate(() => {
      return window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__?.errors || [];
    });
    
    if (reactErrors.length > 0) {
      console.log('❌ React errors found:');
      reactErrors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No React errors detected');
    }
    
    // Check if components are hydrated
    const hydrationStatus = await page.evaluate(() => {
      const nav = document.querySelector('nav[role="navigation"]');
      const buttons = nav?.querySelectorAll('button') || [];
      return {
        navButtons: buttons.length,
        hasEventListeners: buttons.length > 0 && buttons[0].onclick !== null
      };
    });
    
    console.log('Navigation buttons found:', hydrationStatus.navButtons);
    console.log('Has event listeners:', hydrationStatus.hasEventListeners);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'navigation-debug.png', fullPage: true });
    console.log('📸 Screenshot saved as navigation-debug.png');
    
    console.log('\n🎯 Navigation render test complete!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testNavigationRender().catch(console.error);