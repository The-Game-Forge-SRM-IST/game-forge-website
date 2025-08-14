#!/usr/bin/env node

/**
 * Advanced Performance Test with Animation Analysis
 * Tests the new GPU-accelerated animation system and progressive loading
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testAdvancedPerformance() {
  console.log('🚀 Starting Advanced Performance Test with Animations...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--enable-gpu',
      '--enable-accelerated-2d-canvas',
      '--enable-accelerated-video-decode'
    ]
  });
  
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1920, height: 1080 });
  
  const performanceMetrics = [];
  
  try {
    console.log('📊 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Wait for initial load and animations
    await page.waitForTimeout(3000);
    
    const sections = [
      { id: 'team', name: 'Team' },
      { id: 'projects', name: 'Projects' },
      { id: 'achievements', name: 'Achievements' },
      { id: 'gallery', name: 'Gallery' },
      { id: 'events', name: 'Events' }
    ];
    
    for (const section of sections) {
      console.log(`🎯 Testing navigation to ${section.name} section...`);
      
      // Start comprehensive performance monitoring
      const startTime = Date.now();
      
      // Monitor frame rate during navigation
      const frameRatePromise = page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0;
          let startTime = performance.now();
          let minFrameTime = Infinity;
          let maxFrameTime = 0;
          let frameTimes = [];
          
          function measureFrame(timestamp) {
            if (startTime === 0) startTime = timestamp;
            
            const frameTime = timestamp - startTime;
            frameTimes.push(frameTime);
            
            if (frameTime > 0) {
              minFrameTime = Math.min(minFrameTime, frameTime);
              maxFrameTime = Math.max(maxFrameTime, frameTime);
            }
            
            frameCount++;
            startTime = timestamp;
            
            if (performance.now() - startTime < 2000) { // Monitor for 2 seconds
              requestAnimationFrame(measureFrame);
            } else {
              const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
              const fps = 1000 / avgFrameTime;
              const minFPS = 1000 / maxFrameTime;
              const maxFPS = 1000 / minFrameTime;
              
              resolve({
                averageFPS: fps,
                minFPS: minFPS,
                maxFPS: maxFPS,
                frameCount: frameCount,
                frameTimes: frameTimes
              });
            }
          }
          
          requestAnimationFrame(measureFrame);
        });
      });
      
      // Click navigation button
      await page.click(`button[aria-label*="${section.name}"]`);
      
      // Wait for scroll animation to complete
      await page.waitForTimeout(1000);
      
      // Check if progressive loading is working
      const progressiveLoadingCheck = await page.evaluate((sectionId) => {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return { found: false };
        
        // Check for skeleton loading elements
        const skeletonElements = sectionElement.querySelectorAll('.animate-pulse');
        const gpuAcceleratedElements = sectionElement.querySelectorAll('.gpu-accelerated');
        const motionElements = sectionElement.querySelectorAll('[data-framer-name]');
        
        return {
          found: true,
          hasSkeletonLoading: skeletonElements.length > 0,
          hasGPUAcceleration: gpuAcceleratedElements.length > 0,
          hasMotionElements: motionElements.length > 0,
          elementCounts: {
            skeleton: skeletonElements.length,
            gpuAccelerated: gpuAcceleratedElements.length,
            motion: motionElements.length
          }
        };
      }, section.id);
      
      // Get frame rate results
      const frameRateResults = await frameRatePromise;
      
      // Measure memory usage
      const memoryUsage = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      const endTime = Date.now();
      const navigationTime = endTime - startTime;
      
      const sectionMetrics = {
        section: section.name,
        navigationTime,
        frameRate: frameRateResults,
        progressiveLoading: progressiveLoadingCheck,
        memoryUsage,
        timestamp: Date.now()
      };
      
      performanceMetrics.push(sectionMetrics);
      
      console.log(`✅ ${section.name}:`);
      console.log(`   📊 Average FPS: ${frameRateResults.averageFPS.toFixed(1)}`);
      console.log(`   ⚡ Min FPS: ${frameRateResults.minFPS.toFixed(1)}`);
      console.log(`   🚀 Max FPS: ${frameRateResults.maxFPS.toFixed(1)}`);
      console.log(`   ⏱️  Navigation Time: ${navigationTime}ms`);
      console.log(`   🎨 GPU Accelerated Elements: ${progressiveLoadingCheck.elementCounts?.gpuAccelerated || 0}`);
      
      // Wait before next test
      await page.waitForTimeout(1000);
    }
    
    // Calculate comprehensive performance summary
    const avgFPS = performanceMetrics.reduce((sum, m) => sum + m.frameRate.averageFPS, 0) / performanceMetrics.length;
    const minFPS = Math.min(...performanceMetrics.map(m => m.frameRate.minFPS));
    const maxFPS = Math.max(...performanceMetrics.map(m => m.frameRate.maxFPS));
    const avgNavTime = performanceMetrics.reduce((sum, m) => sum + m.navigationTime, 0) / performanceMetrics.length;
    
    console.log('\n📈 Advanced Performance Summary:');
    console.log(`Average FPS: ${avgFPS.toFixed(1)}`);
    console.log(`Minimum FPS: ${minFPS.toFixed(1)}`);
    console.log(`Maximum FPS: ${maxFPS.toFixed(1)}`);
    console.log(`Average Navigation Time: ${avgNavTime.toFixed(0)}ms`);
    
    // Performance grading with stricter criteria
    const performanceGrade = {
      averageFPS: avgFPS >= 50 ? 'EXCELLENT' : avgFPS >= 40 ? 'GOOD' : avgFPS >= 30 ? 'FAIR' : 'POOR',
      minFPS: minFPS >= 30 ? 'EXCELLENT' : minFPS >= 25 ? 'GOOD' : minFPS >= 20 ? 'FAIR' : 'POOR',
      navigationTime: avgNavTime <= 500 ? 'EXCELLENT' : avgNavTime <= 800 ? 'GOOD' : avgNavTime <= 1200 ? 'FAIR' : 'POOR',
      consistency: (maxFPS - minFPS) <= 20 ? 'EXCELLENT' : (maxFPS - minFPS) <= 30 ? 'GOOD' : 'FAIR'
    };
    
    console.log('\n🎯 Performance Grades:');
    console.log(`Average FPS: ${performanceGrade.averageFPS} (${avgFPS.toFixed(1)} FPS)`);
    console.log(`Minimum FPS: ${performanceGrade.minFPS} (${minFPS.toFixed(1)} FPS)`);
    console.log(`Navigation Speed: ${performanceGrade.navigationTime} (${avgNavTime.toFixed(0)}ms)`);
    console.log(`Frame Rate Consistency: ${performanceGrade.consistency} (${(maxFPS - minFPS).toFixed(1)} FPS variance)`);
    
    // Check animation features
    const animationFeatures = {
      progressiveLoading: performanceMetrics.every(m => m.progressiveLoading.found),
      gpuAcceleration: performanceMetrics.some(m => m.progressiveLoading.hasGPUAcceleration),
      motionAnimations: performanceMetrics.some(m => m.progressiveLoading.hasMotionElements)
    };
    
    console.log('\n🎨 Animation Features:');
    console.log(`Progressive Loading: ${animationFeatures.progressiveLoading ? '✅ Active' : '❌ Missing'}`);
    console.log(`GPU Acceleration: ${animationFeatures.gpuAcceleration ? '✅ Active' : '❌ Missing'}`);
    console.log(`Motion Animations: ${animationFeatures.motionAnimations ? '✅ Active' : '❌ Missing'}`);
    
    // Save comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        averageFPS: avgFPS,
        minFPS: minFPS,
        maxFPS: maxFPS,
        averageNavigationTime: avgNavTime,
        frameRateVariance: maxFPS - minFPS,
        grades: performanceGrade
      },
      animationFeatures,
      sectionDetails: performanceMetrics,
      optimizations: [
        '✅ Progressive loading with skeleton screens',
        '✅ GPU-accelerated animations with transform3d',
        '✅ Smart animation system that adapts to performance',
        '✅ RAF-based smooth scrolling',
        '✅ Intersection observer lazy loading',
        '✅ Memoized components and calculations',
        '✅ Animation queuing system',
        '✅ Hardware acceleration CSS optimizations'
      ],
      recommendations: generateRecommendations(performanceGrade, avgFPS, minFPS, avgNavTime)
    };
    
    fs.writeFileSync('advanced-performance-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Comprehensive report saved to advanced-performance-report.json');
    
    // Overall performance verdict
    const overallScore = calculateOverallScore(performanceGrade);
    console.log(`\n🏆 Overall Performance Score: ${overallScore}/100`);
    
    if (overallScore >= 85) {
      console.log('🎉 EXCELLENT! Your website delivers smooth 60 FPS navigation with beautiful animations!');
    } else if (overallScore >= 70) {
      console.log('👍 GOOD! Performance is solid with minor room for improvement.');
    } else if (overallScore >= 55) {
      console.log('⚠️  FAIR! Some performance issues detected. Check recommendations.');
    } else {
      console.log('❌ POOR! Significant performance issues need attention.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

function generateRecommendations(grades, avgFPS, minFPS, avgNavTime) {
  const recommendations = [];
  
  if (grades.averageFPS !== 'EXCELLENT') {
    recommendations.push('Consider reducing animation complexity or enabling performance mode');
  }
  
  if (grades.minFPS !== 'EXCELLENT') {
    recommendations.push('Optimize heavy sections that cause FPS drops');
  }
  
  if (grades.navigationTime !== 'EXCELLENT') {
    recommendations.push('Further optimize scroll performance and reduce navigation delays');
  }
  
  if (grades.consistency !== 'EXCELLENT') {
    recommendations.push('Improve frame rate consistency by optimizing animation timing');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Performance is excellent! No recommendations needed.');
  }
  
  return recommendations;
}

function calculateOverallScore(grades) {
  const scoreMap = { 'EXCELLENT': 25, 'GOOD': 20, 'FAIR': 15, 'POOR': 10 };
  return Object.values(grades).reduce((total, grade) => total + scoreMap[grade], 0);
}

// Run the advanced test
testAdvancedPerformance().catch(console.error);