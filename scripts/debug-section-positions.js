#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function debugSectionPositions() {
  console.log('🔍 Debugging Section Positions...\n');
  
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
    
    // Get detailed section information
    console.log('\n📋 Detailed Section Analysis...');
    
    const sectionInfo = await page.evaluate(() => {
      const sections = ['home', 'team', 'projects', 'achievements', 'gallery', 'events', 'announcements', 'alumni', 'apply', 'contact'];
      const results = [];
      
      let cumulativeTop = 0;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          
          results.push({
            id: sectionId,
            exists: true,
            offsetTop: element.offsetTop,
            offsetHeight: element.offsetHeight,
            scrollTop: element.scrollTop,
            clientHeight: element.clientHeight,
            boundingRect: {
              top: rect.top,
              bottom: rect.bottom,
              height: rect.height
            },
            computedStyle: {
              position: computedStyle.position,
              display: computedStyle.display,
              marginTop: computedStyle.marginTop,
              marginBottom: computedStyle.marginBottom,
              paddingTop: computedStyle.paddingTop,
              paddingBottom: computedStyle.paddingBottom
            },
            cumulativeExpected: cumulativeTop
          });
          
          cumulativeTop += element.offsetHeight;
        } else {
          results.push({
            id: sectionId,
            exists: false
          });
        }
      }
      
      return {
        sections: results,
        documentHeight: document.documentElement.scrollHeight,
        windowHeight: window.innerHeight,
        bodyHeight: document.body.scrollHeight
      };
    });
    
    console.log('Document Info:');
    console.log(`  Document Height: ${sectionInfo.documentHeight}`);
    console.log(`  Window Height: ${sectionInfo.windowHeight}`);
    console.log(`  Body Height: ${sectionInfo.bodyHeight}`);
    
    console.log('\nSection Details:');
    sectionInfo.sections.forEach(section => {
      if (section.exists) {
        console.log(`\n📍 ${section.id.toUpperCase()}:`);
        console.log(`  Exists: ${section.exists}`);
        console.log(`  offsetTop: ${section.offsetTop}`);
        console.log(`  offsetHeight: ${section.offsetHeight}`);
        console.log(`  Expected cumulative top: ${section.cumulativeExpected}`);
        console.log(`  Bounding rect top: ${section.boundingRect.top}`);
        console.log(`  Bounding rect height: ${section.boundingRect.height}`);
        console.log(`  Position: ${section.computedStyle.position}`);
        console.log(`  Display: ${section.computedStyle.display}`);
        console.log(`  Margin top: ${section.computedStyle.marginTop}`);
        console.log(`  Padding top: ${section.computedStyle.paddingTop}`);
      } else {
        console.log(`\n❌ ${section.id.toUpperCase()}: NOT FOUND`);
      }
    });
    
    // Test manual scroll to see if it works
    console.log('\n🔄 Testing manual scroll...');
    
    const teamElement = await page.evaluate(() => {
      const element = document.getElementById('team');
      if (element) {
        const targetPosition = element.offsetTop - 80; // Account for header
        console.log(`Attempting to scroll to position: ${targetPosition}`);
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        return {
          found: true,
          offsetTop: element.offsetTop,
          targetPosition: targetPosition
        };
      }
      return { found: false };
    });
    
    console.log('Manual scroll test:', teamElement);
    
    // Wait and check if scroll worked
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalScrollPosition = await page.evaluate(() => window.scrollY);
    console.log(`Final scroll position: ${finalScrollPosition}`);
    
    console.log('\n🎯 Section position debug complete!');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run debug
debugSectionPositions().catch(console.error);