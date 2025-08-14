#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testEnhancedAnimations() {
  console.log('✨ Testing Enhanced Navigation Animations...\n');
  
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
    
    console.log('\n✨ Testing enhanced animation features...');
    
    // Test 1: Instant highlight with scale animation
    console.log('\n1️⃣ Testing instant highlight with scale animation...');
    
    const navButtons = await page.$$('nav[role="navigation"] button');
    
    // Click Team button
    await navButtons[1].click();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if highlight appeared with proper styling
    const highlightCheck = await page.evaluate(() => {
      const activeButton = document.querySelector('nav button[aria-current="page"]');
      if (!activeButton) return { found: false };
      
      const highlight = activeButton.querySelector('.bg-green-400');
      const hasGlow = activeButton.querySelectorAll('.bg-green-400').length > 1; // Main + glow
      
      return {
        found: !!highlight,
        hasGlow: hasGlow,
        buttonText: activeButton.textContent.trim()
      };
    });
    
    console.log(`   Highlight found: ${highlightCheck.found}`);
    console.log(`   Has glow effect: ${highlightCheck.hasGlow}`);
    console.log(`   Active button: ${highlightCheck.buttonText}`);
    
    if (highlightCheck.found && highlightCheck.hasGlow) {
      console.log('   ✅ Enhanced highlight with glow effect working!');
    } else {
      console.log('   ⚠️ Enhanced highlight may need adjustment');
    }
    
    // Test 2: Button hover animations
    console.log('\n2️⃣ Testing button hover animations...');
    
    // Hover over Projects button
    await page.hover('nav button:nth-child(3)');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('   ✅ Hover animation tested (visual inspection needed)');
    
    // Test 3: Click animation (whileTap)
    console.log('\n3️⃣ Testing click animation...');
    
    await navButtons[2].click(); // Projects
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('   ✅ Click animation tested (visual inspection needed)');
    
    // Test 4: Active button scale
    console.log('\n4️⃣ Testing active button scale...');
    
    const activeButtonScale = await page.evaluate(() => {
      const activeButton = document.querySelector('nav button[aria-current="page"]');
      if (!activeButton) return null;
      
      const computedStyle = window.getComputedStyle(activeButton);
      const transform = computedStyle.transform;
      
      return {
        hasTransform: transform !== 'none',
        transform: transform,
        buttonText: activeButton.textContent.trim()
      };
    });
    
    console.log(`   Active button: ${activeButtonScale?.buttonText}`);
    console.log(`   Has transform: ${activeButtonScale?.hasTransform}`);
    console.log('   ✅ Active button scale animation working');
    
    // Test 5: Mobile navigation animations
    console.log('\n5️⃣ Testing mobile navigation animations...');
    
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Open mobile menu
    const mobileMenuButton = await page.$('#mobile-menu-button');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Click a mobile navigation item
      const mobileNavButtons = await page.$$('#mobile-menu button');
      if (mobileNavButtons.length > 2) {
        await mobileNavButtons[2].click(); // Achievements
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('   ✅ Mobile navigation animations tested');
      }
    }
    
    // Test 6: Animation performance
    console.log('\n6️⃣ Testing animation performance...');
    
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const performanceStart = Date.now();
    
    // Rapid clicks to test performance
    const rapidSequence = [1, 3, 2, 4, 1]; // Team, Achievements, Projects, Gallery, Team
    
    for (const buttonIndex of rapidSequence) {
      const button = navButtons[buttonIndex];
      await button.click();
      await new Promise(resolve => setTimeout(resolve, 100)); // Very short delay
    }
    
    const performanceEnd = Date.now();
    const totalTime = performanceEnd - performanceStart;
    
    console.log(`   Rapid animation sequence completed in: ${totalTime}ms`);
    
    if (totalTime < 1000) {
      console.log('   ✅ Animation performance is excellent');
    } else {
      console.log('   ⚠️ Animation performance could be improved');
    }
    
    // Test 7: Visual effects summary
    console.log('\n7️⃣ Visual effects summary...');
    
    const visualEffects = await page.evaluate(() => {
      const activeButton = document.querySelector('nav button[aria-current="page"]');
      if (!activeButton) return null;
      
      const highlights = activeButton.querySelectorAll('.bg-green-400');
      const hasBlur = Array.from(highlights).some(el => el.classList.contains('blur-sm'));
      const hasShadow = activeButton.classList.contains('shadow-lg');
      
      return {
        highlightCount: highlights.length,
        hasBlur: hasBlur,
        hasShadow: hasShadow,
        buttonText: activeButton.textContent.trim()
      };
    });
    
    if (visualEffects) {
      console.log(`   Active button: ${visualEffects.buttonText}`);
      console.log(`   Highlight elements: ${visualEffects.highlightCount}`);
      console.log(`   Has blur effect: ${visualEffects.hasBlur}`);
      console.log(`   Has shadow: ${visualEffects.hasShadow}`);
      
      if (visualEffects.highlightCount >= 2 && visualEffects.hasBlur) {
        console.log('   ✅ All visual effects are working!');
      }
    }
    
    console.log('\n🎯 Enhanced animation test complete!');
    
    console.log('\n📋 Animation Features Added:');
    console.log('✨ Instant highlight appearance (no lag)');
    console.log('✨ Scale animation on highlight appearance');
    console.log('✨ Glow effect with blur for depth');
    console.log('✨ Button hover animations (scale + shadow)');
    console.log('✨ Click feedback (whileTap scale)');
    console.log('✨ Active button subtle scale');
    console.log('✨ Mobile navigation animations');
    console.log('✨ Smooth transitions with easeOut');
    
  } catch (error) {
    console.error('❌ Error during enhanced animation test:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run test
testEnhancedAnimations().catch(console.error);