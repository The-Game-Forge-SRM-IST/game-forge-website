#!/usr/bin/env node

/**
 * Test Navigation Highlighting
 * Verifies that navigation highlights update when scrolling between sections
 */

const puppeteer = require('puppeteer');

async function testNavigationHighlighting() {
  console.log('🧪 Testing Navigation Highlighting...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    console.log('📊 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    
    console.log('🔍 Testing scroll-based navigation highlighting...');
    
    // Test sections
    const sections = ['team', 'projects', 'achievements', 'gallery'];
    
    for (const sectionId of sections) {
      console.log(`📍 Scrolling to ${sectionId} section...`);
      
      // Scroll to section manually (not clicking nav)
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, sectionId);
      
      // Wait for scroll and intersection observer to update
      await page.waitForTimeout(2000);
      
      // Check if navigation is highlighted correctly
      const isHighlighted = await page.evaluate((id) => {
        const navButton = document.querySelector(`button[aria-label*="${id}"], button[aria-label*="${id.charAt(0).toUpperCase() + id.slice(1)}"]`);
        if (!navButton) return false;
        
        // Check for active classes
        return navButton.classList.contains('text-green-400') || 
               navButton.classList.contains('bg-green-400/10') ||
               navButton.getAttribute('aria-current') === 'page';
      }, sectionId);
      
      if (isHighlighted) {
        console.log(`✅ ${sectionId}: Navigation correctly highlighted`);
      } else {
        console.log(`❌ ${sectionId}: Navigation NOT highlighted`);
      }
      
      // Wait before next test
      await page.waitForTimeout(1000);
    }
    
    console.log('\n🧪 Testing click-based navigation...');
    
    // Test clicking navigation buttons
    for (const sectionId of sections) {
      console.log(`🖱️ Clicking ${sectionId} navigation button...`);
      
      // Click navigation button
      const clicked = await page.evaluate((id) => {
        const navButton = document.querySelector(`button[aria-label*="${id}"], button[aria-label*="${id.charAt(0).toUpperCase() + id.slice(1)}"]`);
        if (navButton) {
          navButton.click();
          return true;
        }
        return false;
      }, sectionId);
      
      if (clicked) {
        // Wait for navigation to complete
        await page.waitForTimeout(1000);
        
        // Check if we're at the right section
        const currentSection = await page.evaluate(() => {
          // Find which section is most visible
          const sections = ['home', 'team', 'projects', 'achievements', 'gallery', 'events'];
          let maxVisibility = 0;
          let currentSection = 'home';
          
          sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const visibility = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) / window.innerHeight;
              if (visibility > maxVisibility) {
                maxVisibility = visibility;
                currentSection = id;
              }
            }
          });
          
          return currentSection;
        });
        
        if (currentSection === sectionId) {
          console.log(`✅ ${sectionId}: Click navigation works correctly`);
        } else {
          console.log(`❌ ${sectionId}: Click navigation failed (at ${currentSection})`);
        }
      } else {
        console.log(`❌ ${sectionId}: Navigation button not found`);
      }
      
      await page.waitForTimeout(500);
    }
    
    console.log('\n🎉 Navigation highlighting test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testNavigationHighlighting().catch(console.error);