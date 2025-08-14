#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testInstantHighlight() {
  console.log('⚡ Testing Instant Navigation Highlight...\n');
  
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
    
    console.log('\n⚡ Testing instant highlight response...');
    
    const navButtons = await page.$$('nav[role="navigation"] button');
    console.log(`Found ${navButtons.length} navigation buttons`);
    
    // Test rapid clicking to see if highlight appears instantly
    const testButtons = [1, 2, 3, 4, 5]; // Team, Projects, Achievements, Gallery, Events
    
    for (const buttonIndex of testButtons) {
      if (buttonIndex < navButtons.length) {
        const button = navButtons[buttonIndex];
        const buttonText = await page.evaluate(el => el.textContent, button);
        
        console.log(`\n🔘 Testing instant highlight for: ${buttonText}`);
        
        // Click the button
        await button.click();
        
        // Check immediately (no delay) if the highlight is on the correct button
        const immediateCheck = await page.evaluate((expectedText) => {
          const activeButton = document.querySelector('nav button[aria-current="page"]');
          const activeText = activeButton ? activeButton.textContent.trim() : 'none';
          
          // Check if the highlight indicator exists on the active button
          const hasHighlight = activeButton ? activeButton.querySelector('.bg-green-400') !== null : false;
          
          return {
            activeText: activeText,
            hasHighlight: hasHighlight,
            matches: activeText === expectedText
          };
        }, buttonText);
        
        console.log(`  Active button: ${immediateCheck.activeText}`);
        console.log(`  Has highlight: ${immediateCheck.hasHighlight}`);
        console.log(`  Matches clicked: ${immediateCheck.matches}`);
        
        if (immediateCheck.matches && immediateCheck.hasHighlight) {
          console.log('  ✅ Highlight appears INSTANTLY!');
        } else {
          console.log('  ❌ Highlight is delayed or missing');
        }
        
        // Small delay before next test
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Test very rapid clicking (stress test)
    console.log('\n🚀 Stress test: Very rapid clicking...');
    
    const rapidButtons = [1, 3, 2, 4, 1, 5, 2]; // Random sequence
    
    for (let i = 0; i < rapidButtons.length; i++) {
      const buttonIndex = rapidButtons[i];
      const button = navButtons[buttonIndex];
      const buttonText = await page.evaluate(el => el.textContent, button);
      
      console.log(`${i + 1}. Rapid click: ${buttonText}`);
      
      await button.click();
      
      // Check immediately
      const check = await page.evaluate((expectedText) => {
        const activeButton = document.querySelector('nav button[aria-current="page"]');
        const activeText = activeButton ? activeButton.textContent.trim() : 'none';
        return activeText === expectedText;
      }, buttonText);
      
      if (check) {
        console.log('   ✅ Instant response');
      } else {
        console.log('   ❌ Delayed response');
      }
      
      // Very short delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎯 Instant highlight test complete!');
    console.log('\n📋 Summary:');
    console.log('- Highlight should appear IMMEDIATELY when clicking');
    console.log('- No sliding or moving animation between buttons');
    console.log('- Instant visual feedback for better UX');
    
  } catch (error) {
    console.error('❌ Error during instant highlight test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testInstantHighlight().catch(console.error);