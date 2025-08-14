#!/usr/bin/env node

/**
 * Debug script for team member image loading issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Team Member Image Loading...\n');

// Read team data
const teamDataPath = path.join(__dirname, '../src/data/team.json');
const teamData = JSON.parse(fs.readFileSync(teamDataPath, 'utf8'));

console.log('📋 Team Members and Their Images:');
teamData.forEach((member, index) => {
  console.log(`${index + 1}. ${member.name}`);
  console.log(`   Role: ${member.role}`);
  console.log(`   Department: ${member.department}`);
  console.log(`   Image Path: ${member.image}`);
  
  // Check if image file exists in public directory
  const imagePath = path.join(__dirname, '../public', member.image);
  const exists = fs.existsSync(imagePath);
  console.log(`   File Exists: ${exists ? '✅' : '❌'}`);
  
  if (!exists) {
    console.log(`   ⚠️  Image file not found at: ${imagePath}`);
  }
  console.log('');
});

console.log('🔧 Troubleshooting Steps:');
console.log('1. Check if image files exist in the public/images/team/ directory');
console.log('2. Verify image file names match exactly (case-sensitive)');
console.log('3. Check browser console for image loading errors');
console.log('4. Try hard refresh (Ctrl+Shift+R) to clear cache');
console.log('5. Check if images work when accessed directly in browser');
console.log('');

console.log('💡 Common Issues:');
console.log('- Image file doesn\'t exist at the specified path');
console.log('- File name case mismatch (avdhoot.webp vs Avdhoot.webp)');
console.log('- Image format not supported (.webp might need fallback)');
console.log('- Next.js image optimization issues');
console.log('- Browser cache showing old version');
console.log('');

console.log('🚀 Quick Fixes:');
console.log('1. Add error handling with fallback images (already added)');
console.log('2. Use placeholder service for missing images');
console.log('3. Convert .webp to .jpg/.png if needed');
console.log('4. Check Next.js image configuration');
console.log('');

console.log('✨ Debug Complete!');