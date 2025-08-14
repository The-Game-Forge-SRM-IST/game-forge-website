#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testScrollDetection() {
  console.log('📜 Testing Scroll Detection...\n');
  
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
      if (text.includes('Section changed') || text.includes('activeSection is now')) {
        console.log(`[${type.toUpperCase()}] ${text}`);
      }
    });
    
    // Navigate to the site
    console.log('🌐 Loading website...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n📜 Testing scroll detection by manually scrolling...');
    
    // Test scrolling to different positions
    const testPositions = [
      { position: 0, expectedSection: 'home' },
      { position: 1200, expectedSection: 'team' },
      { position: 3000, expectedSection: 'projects' },
      { position: 5000, expectedSection: 'achievements' },
      { position: 10000, expectedSection: 'events' },
      { position: 15000, expectedSection: 'apply' }
    ];
    
    for (const test of testPositions) {
      console.log(`\n🔄 Scrolling to position ${test.position} (expecting ${test.expectedSection})...`);
      
      // Scroll to position
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }, test.position);
      
      // Wait for scroll and detection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get current active section
      const activeSection = await page.evaluate(() => {
        // Look for the active navigation button
        const activeButton = document.querySelector('nav button[aria-current="page"]');
        return activeButton ? activeButton.textContent.toLowerCase() : 'unknown';
      });
      
      const currentScroll = await page.evaluate(() => window.scrollY);
      
      console.log(`📍 Current scroll: ${currentScroll}, Active section: ${activeSection}`);
      
      if (activeSection.includes(test.expectedSection) || test.expectedSection.includes(activeSection)) {
        console.log(`✅ Scroll detection working correctly`);
      } else {
        console.log(`⚠️ Expected ${test.expectedSection}, got ${activeSection}`);
      }
    }
    
    console.log('\n🎯 Scroll detection test complete!');
    
  } catch (error) {
    console.error('❌ Error during scroll detection test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testScrollDetection().catch(console.error);