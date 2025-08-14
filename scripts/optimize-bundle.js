#!/usr/bin/env node

/**
 * Bundle Optimization Script
 * Analyzes and provides recommendations for bundle optimization
 */

const fs = require('fs');
const path = require('path');

// Bundle size limits (in KB)
const BUNDLE_LIMITS = {
  'main': 250,      // Main bundle
  'vendor': 500,    // Vendor libraries
  'three': 300,     // Three.js related
  'framer': 150,    // Framer Motion
  'total': 1000,    // Total bundle size
};

// Performance recommendations
const RECOMMENDATIONS = {
  'large-bundle': [
    'Consider code splitting for large components',
    'Use dynamic imports for non-critical features',
    'Implement lazy loading for images and components',
    'Remove unused dependencies',
  ],
  'three-js': [
    'Use tree shaking for Three.js imports',
    'Consider using @react-three/drei selectively',
    'Implement LOD (Level of Detail) for 3D models',
    'Use compressed textures and geometries',
  ],
  'framer-motion': [
    'Import only needed components from framer-motion',
    'Use CSS animations for simple transitions',
    'Consider react-spring as a lighter alternative',
    'Implement motion components conditionally',
  ],
  'images': [
    'Convert images to WebP/AVIF format',
    'Implement responsive images with srcset',
    'Use blur placeholders for better UX',
    'Optimize image sizes for different viewports',
  ],
};

function analyzeBundle() {
  console.log('🔍 Analyzing bundle for optimization opportunities...\n');

  // Check if .next directory exists
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    console.log('❌ No .next directory found. Please run "npm run build" first.');
    return;
  }

  // Analyze package.json for heavy dependencies
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    analyzePackageDependencies(packageJson);
  }

  // Check for common optimization opportunities
  checkOptimizationOpportunities();

  console.log('\n📊 Bundle Analysis Complete!');
  console.log('\nTo get detailed bundle analysis, run:');
  console.log('npm run analyze');
}

function analyzePackageDependencies(packageJson) {
  console.log('📦 Analyzing Dependencies:\n');

  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const heavyDeps = [];

  // Known heavy dependencies
  const HEAVY_DEPS = {
    'three': 'Large 3D library - ensure tree shaking',
    'framer-motion': 'Animation library - import selectively',
    '@react-three/fiber': 'Three.js React wrapper',
    '@react-three/drei': 'Three.js helpers - use selectively',
    'lodash': 'Utility library - use lodash-es or individual imports',
    'moment': 'Date library - consider date-fns or dayjs',
    'axios': 'HTTP client - consider native fetch',
  };

  Object.keys(dependencies).forEach(dep => {
    if (HEAVY_DEPS[dep]) {
      heavyDeps.push({ name: dep, note: HEAVY_DEPS[dep] });
    }
  });

  if (heavyDeps.length > 0) {
    console.log('⚠️  Heavy Dependencies Found:');
    heavyDeps.forEach(dep => {
      console.log(`   • ${dep.name}: ${dep.note}`);
    });
    console.log('');
  } else {
    console.log('✅ No known heavy dependencies found.\n');
  }
}

function checkOptimizationOpportunities() {
  console.log('🎯 Optimization Opportunities:\n');

  const srcDir = path.join(process.cwd(), 'src');
  const opportunities = [];

  // Check for large components
  if (fs.existsSync(srcDir)) {
    const componentFiles = findLargeFiles(srcDir, '.tsx', 500); // Files > 500 lines
    if (componentFiles.length > 0) {
      opportunities.push({
        type: 'large-components',
        message: `Found ${componentFiles.length} large component(s)`,
        files: componentFiles,
        recommendations: [
          'Split large components into smaller ones',
          'Use React.lazy for code splitting',
          'Extract custom hooks for complex logic',
        ],
      });
    }
  }

  // Check for Three.js usage
  const threeUsage = findFilesWithPattern(srcDir, /import.*three|@react-three/);
  if (threeUsage.length > 0) {
    opportunities.push({
      type: 'three-js',
      message: `Three.js used in ${threeUsage.length} file(s)`,
      recommendations: RECOMMENDATIONS['three-js'],
    });
  }

  // Check for Framer Motion usage
  const framerUsage = findFilesWithPattern(srcDir, /import.*framer-motion/);
  if (framerUsage.length > 0) {
    opportunities.push({
      type: 'framer-motion',
      message: `Framer Motion used in ${framerUsage.length} file(s)`,
      recommendations: RECOMMENDATIONS['framer-motion'],
    });
  }

  // Check for image optimization opportunities
  const publicDir = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    const largeImages = findLargeImages(publicDir);
    if (largeImages.length > 0) {
      opportunities.push({
        type: 'images',
        message: `Found ${largeImages.length} large image(s)`,
        files: largeImages,
        recommendations: RECOMMENDATIONS['images'],
      });
    }
  }

  // Display opportunities
  if (opportunities.length === 0) {
    console.log('✅ No major optimization opportunities found!\n');
  } else {
    opportunities.forEach(opp => {
      console.log(`⚡ ${opp.message}`);
      if (opp.files && opp.files.length > 0) {
        console.log('   Files:');
        opp.files.slice(0, 5).forEach(file => {
          console.log(`     - ${file}`);
        });
        if (opp.files.length > 5) {
          console.log(`     ... and ${opp.files.length - 5} more`);
        }
      }
      console.log('   Recommendations:');
      opp.recommendations.forEach(rec => {
        console.log(`     • ${rec}`);
      });
      console.log('');
    });
  }
}

function findLargeFiles(dir, extension, minLines) {
  const largeFiles = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanDirectory(filePath);
      } else if (file.endsWith(extension)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lineCount = content.split('\n').length;
        
        if (lineCount > minLines) {
          largeFiles.push({
            path: path.relative(process.cwd(), filePath),
            lines: lineCount,
          });
        }
      }
    });
  }
  
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
  
  return largeFiles.map(f => `${f.path} (${f.lines} lines)`);
}

function findFilesWithPattern(dir, pattern) {
  const matchingFiles = [];
  
  function scanDirectory(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (pattern.test(content)) {
          matchingFiles.push(path.relative(process.cwd(), filePath));
        }
      }
    });
  }
  
  scanDirectory(dir);
  return matchingFiles;
}

function findLargeImages(dir) {
  const largeImages = [];
  const MAX_SIZE = 500 * 1024; // 500KB
  
  function scanDirectory(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanDirectory(filePath);
      } else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(file)) {
        if (stat.size > MAX_SIZE) {
          largeImages.push({
            path: path.relative(process.cwd(), filePath),
            size: Math.round(stat.size / 1024),
          });
        }
      }
    });
  }
  
  scanDirectory(dir);
  return largeImages.map(img => `${img.path} (${img.size}KB)`);
}

function showHelp() {
  console.log(`
Bundle Optimization Tool

Usage: node optimize-bundle.js [command]

Commands:
  analyze    Analyze bundle for optimization opportunities (default)
  help       Show this help message

Examples:
  node optimize-bundle.js
  node optimize-bundle.js analyze
`);
}

// Main execution
const command = process.argv[2] || 'analyze';

switch (command) {
  case 'analyze':
    analyzeBundle();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.log('❌ Unknown command. Use "help" to see available commands.');
    process.exit(1);
}