#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testMobilePerformance() {
    console.log('📱 Testing Mobile Navigation Performance...\n');

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            devtools: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Configure for Mobile (iPhone 12 Pro dimensions)
        await page.setViewport({
            width: 390,
            height: 844,
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 3
        });

        // Set Mobile User Agent
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1');

        // Navigate to the site
        console.log('🌐 Loading website (Mobile View)...');
        const navigationStart = Date.now();
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        const navigationEnd = Date.now();

        console.log(`📊 Page load time: ${navigationEnd - navigationStart}ms`);

        // Wait for page to fully load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Test navigation click performance
        console.log('\n⚡ Testing navigation click performance...');


        // Select buttons - Mobile Menu Logic
        const menuButton = await page.$('#mobile-menu-button');
        if (!menuButton) {
            console.error('❌ Could not find mobile menu button!');
            // Fallback to desktop selector if mobile logic fails
            var navButtons = await page.$$('nav button');
        } else {
            console.log('📱 Found mobile menu button. Will open menu for each test.');
        }

        const navItems = [
            { selector: 'button[aria-label="Navigate to Team section"]', label: "Team" },
            { selector: 'button[aria-label="Navigate to Projects section"]', label: "Projects" },
            { selector: 'button[aria-label="Navigate to Gallery section"]', label: "Gallery" }
        ];

        const performanceResults = [];

        for (const item of navItems) {
            if (menuButton) {
                // Open menu if closed
                const isExpanded = await page.evaluate(el => el.getAttribute('aria-expanded'), menuButton);
                if (isExpanded !== 'true') {
                    await menuButton.click();
                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
                }
            }

            const button = await page.$(item.selector);

            if (!button) {
                console.log(`⚠️ Could not find button for ${item.label}`);
                continue;
            }

            const buttonText = item.label;
            console.log(`\n🔘 Testing performance for: ${buttonText}`);

            const clickStart = Date.now();
            await button.click();

            // Wait for scroll/transition
            let scrollComplete = false;
            let scrollTimeout = 0;
            const maxTimeout = 3000;

            while (!scrollComplete && scrollTimeout < maxTimeout) {
                await new Promise(resolve => setTimeout(resolve, 100));
                scrollTimeout += 100;

                const scroll1 = await page.evaluate(() => window.scrollY);
                await new Promise(resolve => setTimeout(resolve, 100));
                const scroll2 = await page.evaluate(() => window.scrollY);

                if (Math.abs(scroll1 - scroll2) < 1) {
                    scrollComplete = true;
                }
            }

            const clickEnd = Date.now();
            const totalTime = clickEnd - clickStart;

            performanceResults.push({
                section: buttonText,
                time: totalTime,
                timeout: scrollTimeout >= maxTimeout
            });

            console.log(`⏱️ Navigation time: ${totalTime}ms ${scrollTimeout >= maxTimeout ? '(TIMEOUT)' : ''}`);

            // Allow time for menu to close and scroll to finish properly before next iteration
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (performanceResults.length > 0) {
            const avgTime = performanceResults.reduce((sum, r) => sum + r.time, 0) / performanceResults.length;
            console.log('\n📊 Mobile Performance Summary:');
            console.log(`  Average navigation time: ${avgTime.toFixed(1)}ms`);
        } else {
            console.log('\n⚠️ No navigation buttons tested (might be hidden behind hamburger menu)');
        }

        // Test memory usage
        const memoryUsage = await page.evaluate(() => {
            if (performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                };
            }
            return null;
        });

        if (memoryUsage) {
            console.log('\n💾 Mobile Memory Usage:');
            console.log(`  Used: ${memoryUsage.used}MB`);
        }

        console.log('\n🎯 Mobile Performance test complete!');

    } catch (error) {
        console.error('❌ Error during mobile performance test:', error);
    } finally {
        if (browser) await browser.close();
    }
}

testMobilePerformance().catch(console.error);
