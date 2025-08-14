#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testAccessibility() {
  console.log('♿ Testing Navigation Accessibility...\n');
  
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
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n♿ Testing keyboard navigation...');
    
    // Test Tab navigation
    console.log('⌨️ Testing Tab key navigation...');
    
    // Focus on the first navigation button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip skip links
    await page.keyboard.press('Tab'); // Should focus on logo/home
    
    let focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return {
        tagName: focused?.tagName,
        textContent: focused?.textContent?.trim(),
        ariaLabel: focused?.getAttribute('aria-label'),
        role: focused?.getAttribute('role')
      };
    });
    
    console.log('First focused element:', focusedElement);
    
    // Test Enter key on navigation
    console.log('⌨️ Testing Enter key on navigation...');
    
    const initialScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const finalScroll = await page.evaluate(() => window.scrollY);
    
    if (finalScroll !== initialScroll || initialScroll === 0) {
      console.log('✅ Enter key navigation works');
    } else {
      console.log('❌ Enter key navigation failed');
    }
    
    // Test Space key navigation
    console.log('⌨️ Testing Space key navigation...');
    
    // Tab to next navigation button
    await page.keyboard.press('Tab');
    
    focusedElement = await page.evaluate(() => {
      const focused = document.activeElement;
      return {
        textContent: focused?.textContent?.trim(),
        ariaLabel: focused?.getAttribute('aria-label')
      };
    });
    
    console.log('Next focused element:', focusedElement);
    
    const beforeSpaceScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Space');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const afterSpaceScroll = await page.evaluate(() => window.scrollY);
    
    if (afterSpaceScroll !== beforeSpaceScroll) {
      console.log('✅ Space key navigation works');
    } else {
      console.log('❌ Space key navigation failed');
    }
    
    // Test ARIA attributes
    console.log('\n🏷️ Testing ARIA attributes...');
    
    const ariaAttributes = await page.evaluate(() => {
      const nav = document.querySelector('nav[role="navigation"]');
      const buttons = nav?.querySelectorAll('button') || [];
      
      return {
        navAriaLabel: nav?.getAttribute('aria-label'),
        navRole: nav?.getAttribute('role'),
        buttonCount: buttons.length,
        buttonsWithAriaLabel: Array.from(buttons).filter(btn => btn.getAttribute('aria-label')).length,
        buttonsWithAriaCurrent: Array.from(buttons).filter(btn => btn.getAttribute('aria-current')).length,
        activeButton: Array.from(buttons).find(btn => btn.getAttribute('aria-current') === 'page')?.textContent?.trim()
      };
    });
    
    console.log('ARIA attributes:', ariaAttributes);
    
    if (ariaAttributes.navAriaLabel && ariaAttributes.navRole === 'navigation') {
      console.log('✅ Navigation has proper ARIA labels');
    } else {
      console.log('❌ Navigation missing ARIA labels');
    }
    
    if (ariaAttributes.buttonsWithAriaLabel === ariaAttributes.buttonCount) {
      console.log('✅ All buttons have aria-label');
    } else {
      console.log(`⚠️ ${ariaAttributes.buttonCount - ariaAttributes.buttonsWithAriaLabel} buttons missing aria-label`);
    }
    
    if (ariaAttributes.buttonsWithAriaCurrent > 0) {
      console.log(`✅ Active section indicated with aria-current: ${ariaAttributes.activeButton}`);
    } else {
      console.log('❌ No aria-current attribute found');
    }
    
    // Test mobile accessibility
    console.log('\n📱 Testing mobile accessibility...');
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test mobile menu button accessibility
    const mobileMenuAccessibility = await page.evaluate(() => {
      const button = document.getElementById('mobile-menu-button');
      return {
        exists: !!button,
        ariaExpanded: button?.getAttribute('aria-expanded'),
        ariaLabel: button?.getAttribute('aria-label'),
        ariaControls: button?.getAttribute('aria-controls'),
        minHeight: button ? window.getComputedStyle(button).minHeight : null,
        minWidth: button ? window.getComputedStyle(button).minWidth : null
      };
    });
    
    console.log('Mobile menu button accessibility:', mobileMenuAccessibility);
    
    if (mobileMenuAccessibility.ariaExpanded !== null && mobileMenuAccessibility.ariaLabel) {
      console.log('✅ Mobile menu button has proper ARIA attributes');
    } else {
      console.log('❌ Mobile menu button missing ARIA attributes');
    }
    
    // Check touch target size (should be at least 44px)
    const minSize = parseInt(mobileMenuAccessibility.minHeight) || 0;
    if (minSize >= 44) {
      console.log('✅ Mobile menu button meets touch target size requirements');
    } else {
      console.log(`⚠️ Mobile menu button too small: ${minSize}px (should be ≥44px)`);
    }
    
    console.log('\n🎯 Accessibility test complete!');
    
  } catch (error) {
    console.error('❌ Error during accessibility test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testAccessibility().catch(console.error);