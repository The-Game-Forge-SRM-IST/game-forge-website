const puppeteer = require('puppeteer');

async function testClickOnlyNavigation() {
  console.log('🎯 Testing Click-Only Navigation...\n');

  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('🖱️') || msg.text().includes('🎯')) {
      console.log(`[PAGE] ${msg.text()}`);
    }
  });

  try {
    console.log('📋 Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test key sections
    const testSections = [
      { name: 'team', expected: 'team' },
      { name: 'projects', expected: 'projects' },
      { name: 'gallery', expected: 'gallery' },
      { name: 'contact', expected: 'contact us' }
    ];
    
    for (const test of testSections) {
      console.log(`\n🧪 Testing ${test.name.toUpperCase()}...`);
      
      // Click navigation
      const clicked = await page.evaluate((sectionName) => {
        const buttons = Array.from(document.querySelectorAll('nav button'));
        const button = buttons.find(btn => 
          btn.textContent.toLowerCase().includes(sectionName.toLowerCase())
        );
        if (button) {
          button.click();
          return true;
        }
        return false;
      }, test.name);
      
      if (clicked) {
        console.log(`✅ Clicked ${test.name} button`);
        
        // Wait for scroll
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check state
        const result = await page.evaluate((expectedText) => {
          const activeButton = document.querySelector('nav button[class*="text-green-400"]');
          const activeText = activeButton?.textContent?.toLowerCase() || 'none';
          const scrollY = window.scrollY;
          
          return {
            activeText,
            scrollY,
            isCorrect: activeText.includes(expectedText.toLowerCase()),
            hasScrolled: scrollY > 200
          };
        }, test.expected);
        
        console.log(`📊 Active: "${result.activeText}"`);
        console.log(`📊 Scroll: ${result.scrollY}px`);
        console.log(`📊 Status: ${result.isCorrect && result.hasScrolled ? '✅ SUCCESS' : '❌ FAILED'}`);
        
      } else {
        console.log(`❌ Button not found for ${test.name}`);
      }
    }

    console.log('\n🎉 Click-only navigation test completed!');
    console.log('🌐 Browser left open for manual verification...');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testClickOnlyNavigation().catch(console.error);