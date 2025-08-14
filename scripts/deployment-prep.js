#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentPreparation {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      fix: '🔧'
    }[type];
    console.log(`${prefix} ${message}`);
  }

  async checkBuildStatus() {
    this.log('Checking build status...', 'info');
    
    try {
      execSync('npm run build', { stdio: 'pipe', cwd: process.cwd() });
      this.log('Build completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('Build failed', 'error');
      this.issues.push('Build compilation errors');
      return false;
    }
  }

  async checkBundleSize() {
    this.log('Analyzing bundle size...', 'info');
    
    try {
      const buildDir = path.join(process.cwd(), '.next');
      if (!fs.existsSync(buildDir)) {
        this.issues.push('Build directory not found');
        return false;
      }

      // Check if bundle analyzer is available
      try {
        execSync('ANALYZE=true npm run build', { stdio: 'pipe', cwd: process.cwd() });
        this.log('Bundle analysis completed', 'success');
      } catch (error) {
        this.log('Bundle analysis failed, but build exists', 'warning');
      }

      return true;
    } catch (error) {
      this.log('Bundle size check failed', 'error');
      this.issues.push('Bundle size analysis failed');
      return false;
    }
  }

  async optimizeImages() {
    this.log('Checking image optimization...', 'info');
    
    const imageDirectories = [
      'public/images/team',
      'public/images/projects',
      'public/images/gallery',
      'public/images/achievements',
      'public/images/events',
      'public/images/alumni'
    ];

    let missingImages = [];
    
    for (const dir of imageDirectories) {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`, 'fix');
      }

      // Check for placeholder images and create them if missing
      const placeholderImages = this.getRequiredImages(dir);
      for (const imageName of placeholderImages) {
        const imagePath = path.join(fullPath, imageName);
        if (!fs.existsSync(imagePath)) {
          missingImages.push(`${dir}/${imageName}`);
        }
      }
    }

    if (missingImages.length > 0) {
      this.log(`Found ${missingImages.length} missing images`, 'warning');
      this.createPlaceholderImages(missingImages);
      this.fixes.push(`Created ${missingImages.length} placeholder images`);
    } else {
      this.log('All required images are present', 'success');
    }

    return true;
  }

  getRequiredImages(directory) {
    const images = {
      'public/images/team': [
        'alex-chen.jpg', 'priya-sharma.jpg', 'rahul-gupta.jpg', 'sarah-johnson.jpg',
        'arjun-patel.jpg', 'maya-singh.jpg', 'dev-kumar.jpg', 'ananya-reddy.jpg'
      ],
      'public/images/projects': [
        'pixel-quest-1.jpg', 'mystic-realms-1.jpg', 'space-colony-1.jpg',
        'cyber-runner-1.jpg', 'puzzle-dimension-1.jpg', 'battle-arena-vr-1.jpg'
      ],
      'public/images/gallery': [],
      'public/images/achievements': [],
      'public/images/events': [],
      'public/images/alumni': []
    };

    return images[directory] || [];
  }

  createPlaceholderImages(missingImages) {
    this.log('Creating placeholder images...', 'fix');
    
    // Copy existing placeholder images to missing locations
    const placeholderSource = path.join(process.cwd(), 'public/images/placeholder-600x700.jpg');
    
    if (fs.existsSync(placeholderSource)) {
      for (const imagePath of missingImages) {
        const fullPath = path.join(process.cwd(), imagePath);
        fs.copyFileSync(placeholderSource, fullPath);
        this.log(`Created placeholder: ${imagePath}`, 'fix');
      }
    } else {
      this.log('No placeholder source found, images will use fallback URLs', 'warning');
    }
  }

  async optimizePerformance() {
    this.log('Checking performance optimizations...', 'info');
    
    // Check Next.js config
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    if (fs.existsSync(nextConfigPath)) {
      const config = fs.readFileSync(nextConfigPath, 'utf8');
      
      const optimizations = [
        'optimizePackageImports',
        'compress: true',
        'splitChunks'
      ];

      let hasOptimizations = true;
      for (const opt of optimizations) {
        if (!config.includes(opt)) {
          hasOptimizations = false;
          break;
        }
      }

      if (hasOptimizations) {
        this.log('Performance optimizations are configured', 'success');
      } else {
        this.log('Some performance optimizations are missing', 'warning');
        this.issues.push('Missing performance optimizations in next.config.ts');
      }
    }

    return true;
  }

  async checkAccessibility() {
    this.log('Checking accessibility features...', 'info');
    
    const accessibilityFiles = [
      'src/components/ui/SkipLink.tsx',
      'src/utils/accessibility.ts',
      'src/hooks/useAccessibility.ts'
    ];

    let allPresent = true;
    for (const file of accessibilityFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        this.log(`Missing accessibility file: ${file}`, 'warning');
        allPresent = false;
      }
    }

    if (allPresent) {
      this.log('Accessibility features are implemented', 'success');
    } else {
      this.issues.push('Missing accessibility implementations');
    }

    return allPresent;
  }

  async checkSecurity() {
    this.log('Checking security configurations...', 'info');
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    if (fs.existsSync(nextConfigPath)) {
      const config = fs.readFileSync(nextConfigPath, 'utf8');
      
      const securityFeatures = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'poweredByHeader: false'
      ];

      let hasSecurityFeatures = true;
      for (const feature of securityFeatures) {
        if (!config.includes(feature)) {
          hasSecurityFeatures = false;
          break;
        }
      }

      if (hasSecurityFeatures) {
        this.log('Security headers are configured', 'success');
      } else {
        this.log('Some security features are missing', 'warning');
        this.issues.push('Missing security configurations');
      }
    }

    return true;
  }

  async runIntegrationTests() {
    this.log('Running integration tests...', 'info');
    
    try {
      // Use the fixed integration test script
      execSync('node scripts/integration-test-fixed.js', { 
        stdio: 'pipe', 
        cwd: process.cwd() 
      });
      this.log('Integration tests passed', 'success');
      return true;
    } catch (error) {
      this.log('Integration tests failed', 'warning');
      this.issues.push('Integration test failures');
      return false;
    }
  }

  async generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      status: this.issues.length === 0 ? 'READY' : 'NEEDS_ATTENTION',
      issues: this.issues,
      fixes: this.fixes,
      checklist: {
        build: this.issues.includes('Build compilation errors') ? 'FAIL' : 'PASS',
        bundleSize: this.issues.includes('Bundle size analysis failed') ? 'FAIL' : 'PASS',
        images: this.fixes.some(f => f.includes('placeholder images')) ? 'FIXED' : 'PASS',
        performance: this.issues.includes('Missing performance optimizations') ? 'NEEDS_ATTENTION' : 'PASS',
        accessibility: this.issues.includes('Missing accessibility implementations') ? 'FAIL' : 'PASS',
        security: this.issues.includes('Missing security configurations') ? 'NEEDS_ATTENTION' : 'PASS',
        tests: this.issues.includes('Integration test failures') ? 'FAIL' : 'PASS'
      }
    };

    const reportPath = path.join(process.cwd(), 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log('\n📊 Deployment Readiness Report:', 'info');
    console.log('='.repeat(50));
    console.log(`Status: ${report.status}`);
    console.log(`Issues Found: ${this.issues.length}`);
    console.log(`Fixes Applied: ${this.fixes.length}`);
    console.log('\nChecklist:');
    for (const [check, status] of Object.entries(report.checklist)) {
      const emoji = status === 'PASS' ? '✅' : status === 'FIXED' ? '🔧' : status === 'NEEDS_ATTENTION' ? '⚠️' : '❌';
      console.log(`  ${emoji} ${check}: ${status}`);
    }
    console.log(`\nDetailed report saved to: ${reportPath}`);

    return report;
  }

  async run() {
    console.log('🚀 Starting deployment preparation...\n');

    await this.checkBuildStatus();
    await this.checkBundleSize();
    await this.optimizeImages();
    await this.optimizePerformance();
    await this.checkAccessibility();
    await this.checkSecurity();
    await this.runIntegrationTests();

    const report = await this.generateDeploymentReport();

    if (report.status === 'READY') {
      this.log('\n🎉 Application is ready for deployment!', 'success');
      return true;
    } else {
      this.log('\n⚠️  Application needs attention before deployment', 'warning');
      this.log('Please review the issues and fixes above', 'info');
      return false;
    }
  }
}

async function main() {
  const prep = new DeploymentPreparation();
  const success = await prep.run();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = DeploymentPreparation;