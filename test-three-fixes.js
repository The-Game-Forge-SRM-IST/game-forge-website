#!/usr/bin/env node

/**
 * Test script to verify Three.js fixes
 * This script checks for common issues and validates the fixes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Three.js fixes...\n');

// Test 1: Check shader attribute naming
console.log('1. Checking shader attribute naming...');
const particleSystemPath = path.join(__dirname, 'src/components/three/ExtremeOptimizedParticleSystem.tsx');
const particleSystemContent = fs.readFileSync(particleSystemPath, 'utf8');

if (particleSystemContent.includes('attribute vec3 color;')) {
  console.log('❌ Found conflicting "color" attribute in shader');
} else if (particleSystemContent.includes('attribute vec3 particleColor;')) {
  console.log('✅ Shader uses non-conflicting "particleColor" attribute');
} else {
  console.log('⚠️  Could not verify shader attribute naming');
}

// Test 2: Check z-index configuration
console.log('\n2. Checking z-index configuration...');
const appLayoutPath = path.join(__dirname, 'src/components/layout/AppLayout.tsx');
const appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');

if (appLayoutContent.includes('ExtremeOptimizedThreeBackground')) {
  console.log('✅ Using optimized Three.js background component');
} else {
  console.log('❌ Still using old ThreeBackground component');
}

if (appLayoutContent.includes('main-content')) {
  console.log('✅ Main content has proper CSS class for layering');
} else {
  console.log('❌ Main content missing layering CSS class');
}

// Test 3: Check CSS layering rules
console.log('\n3. Checking CSS layering rules...');
const globalCssPath = path.join(__dirname, 'src/app/globals.css');
const globalCssContent = fs.readFileSync(globalCssPath, 'utf8');

if (globalCssContent.includes('.three-background')) {
  console.log('✅ Three.js background CSS rules defined');
} else {
  console.log('❌ Missing Three.js background CSS rules');
}

if (globalCssContent.includes('.main-content')) {
  console.log('✅ Main content CSS rules defined');
} else {
  console.log('❌ Missing main content CSS rules');
}

// Test 4: Check component imports
console.log('\n4. Checking component imports...');
if (appLayoutContent.includes("import ExtremeOptimizedThreeBackground from '../three/ExtremeOptimizedThreeBackground'")) {
  console.log('✅ Correct Three.js component import');
} else {
  console.log('❌ Incorrect or missing Three.js component import');
}

// Test 5: Check shader material configuration
console.log('\n5. Checking shader material configuration...');
if (particleSystemContent.includes('vertexColors: false')) {
  console.log('✅ Shader material configured for custom attributes');
} else if (particleSystemContent.includes('vertexColors: true')) {
  console.log('❌ Shader material still using built-in vertex colors');
} else {
  console.log('⚠️  Could not verify shader material configuration');
}

console.log('\n🎯 Test Summary:');
console.log('The fixes address:');
console.log('• Shader compilation error (color attribute conflict)');
console.log('• Z-index layering issues (Three.js behind content)');
console.log('• Component import issues (using optimized version)');
console.log('• CSS positioning and layering');

console.log('\n🚀 To test the fixes:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Check browser console for shader errors');
console.log('4. Verify Three.js particles are visible behind content');
console.log('5. Test scrolling to ensure particles move correctly');