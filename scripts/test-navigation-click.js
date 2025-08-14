#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testNavigationClick() {
  console.log('🔍 Testing Navigation Click Functionality...\n');
  
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
    
    // Check sections exist
    console.log('\n📋 Checking if sections exist...');
    const sections = ['home', 'team', 'projects', 'achievements', 'gallery', 'events', 'announcements', 'alumni', 'apply', 'contact'];
    
    for (const sectionId of sections) {
      const sectionExists = await page.evaluate((id) => {
        const element = document.getElementById(id);
        return {
          exists: !!element,
          offsetTop: element?.offsetTop || 'N/A',
          offsetHeight: element?.offsetHeight || 'N/A'
        };
      }, sectionId);
      
      console.log(`Section '${sectionId}': exists=${sectionExists.exists}, top=${sectionExists.offsetTop}, height=${sectionExists.offsetHeight}`);
    }
    
    // Test navigation clicks
    console.log('\n🖱️ Testing navigation clicks...');
    
    // Get navigation buttons
    const navButtons = await page.$$('nav[role="navigation"] button');
    console.log(`Found ${navButtons.length} navigation buttons`);
    
    // Test clicking the "Team" button (index 1)
    if (navButtons.length > 1) {
      const teamButton = navButtons[1];
      const buttonText = await page.evaluate(el => el.textContent, teamButton);
      
      console.log(`\n🔘 Testing button: "${buttonText}"`);
      
      // Get initial scroll position
      const initialScroll = await page.evaluate(() => window.scrollY);
      console.log(`📍 Initial scroll: ${initialScroll}`);
      
      // Click the button
      console.log('🖱️ Clicking button...');
      await teamButton.click();
      
      // Wait for scroll animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get final scroll position
      const finalScroll = await page.evaluate(() => window.scrollY);
      console.log(`📍 Final scroll: ${finalScroll}`);
      
      if (finalScroll !== initialScroll) {
        console.log(`✅ Navigation worked! Scrolled from ${initialScroll} to ${finalScroll}`);
      } else {
        console.log(`❌ Navigation failed! No scroll change detected`);
        
        // Debug: Check if team section exists
        const teamSection = await page.evaluate(() => {
          const element = document.getElementById('team');
          return {
            exists: !!element,
            offsetTop: element?.offsetTop,
            scrollBehavior: window.getComputedStyle(document.documentElement).scrollBehavior
          };
        });
        
        console.log('Team section debug:', teamSection);
      }
    }
    
    // Test another button - Projects (index 2)
    if (navButtons.length > 2) {
      const projectsButton = navButtons[2];
      const buttonText = await page.evaluate(el => el.textContent, projectsButton);
      
      console.log(`\n🔘 Testing button: "${buttonText}"`);
      
      const initialScroll = await page.evaluate(() => window.scrollY);
      console.log(`📍 Initial scroll: ${initialScroll}`);
      
      await projectsButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalScroll = await page.evaluate(() => window.scrollY);
      console.log(`📍 Final scroll: ${finalScroll}`);
      
      if (finalScroll !== initialScroll) {
        console.log(`✅ Navigation worked! Scrolled from ${initialScroll} to ${finalScroll}`);
      } else {
        console.log(`❌ Navigation failed! No scroll change detected`);
      }
    }
    
    console.log('\n🎯 Navigation click test complete!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testNavigationClick().catch(console.error);