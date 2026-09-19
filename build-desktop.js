#!/usr/bin/env node

/**
 * MedScript Analytics - Desktop Build Script
 * 
 * This script builds the React app and packages it as a desktop executable
 * using Electron and electron-builder.
 * 
 * Usage:
 *   node build-desktop.js [platform]
 * 
 * Platforms: windows, mac, linux (default: current platform)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const platform = process.argv[2] || process.platform;

console.log('🏥 MedScript Analytics - Desktop Build');
console.log('======================================\n');

// Step 1: Build the React app
console.log('📦 Step 1: Building React application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React build complete\n');
} catch (error) {
  console.error('❌ React build failed');
  process.exit(1);
}

// Step 2: Create build resources directory
console.log('📁 Step 2: Setting up build resources...');
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create a simple icon placeholder (you should replace with actual icon)
const iconPath = path.join(buildDir, 'icon.png');
if (!fs.existsSync(iconPath)) {
  console.log('⚠️  No icon found. Creating placeholder...');
  console.log('   You should add a proper icon at build/icon.png\n');
}

// Step 3: Create electron package.json for the build
console.log('📝 Step 3: Preparing Electron package...');
const electronPkg = {
  name: "medscript-analytics",
  version: "1.0.0",
  description: "Doctor Prescription Research Tool - Ontario, Canada",
  main: "electron/main.js",
  author: "MedScript Analytics",
  license: "MIT"
};

fs.writeFileSync(
  path.join(__dirname, 'electron-package.json'),
  JSON.stringify(electronPkg, null, 2)
);

// Step 4: Run electron-builder
console.log('🔨 Step 4: Building desktop application...');
console.log(`   Platform: ${platform}\n`);

try {
  // Use npx to run electron-builder with the config
  // Use 'node node_modules/.bin/electron-builder' for better Windows compatibility
  const electronBuilderPath = path.join(__dirname, 'node_modules', '.bin', 'electron-builder');
  const builderCmd = process.platform === 'win32' 
    ? `node "${electronBuilderPath}" --config electron-builder.json --${getPlatformFlag(platform)}`
    : `npx electron-builder --config electron-builder.json --${getPlatformFlag(platform)}`;
  
  execSync(builderCmd, { stdio: 'inherit', cwd: __dirname });
  console.log('\n✅ Desktop build complete!');
  console.log('📂 Output directory: ./release/\n');
} catch (error) {
  console.error('\n❌ Desktop build failed');
  console.error('Make sure you have run: npm install');
  console.error('\nTry running commands separately in PowerShell:');
  console.error('  npm install');
  console.error('  node build-desktop.js');
  process.exit(1);
}

function getPlatformFlag(platform) {
  if (platform === 'win32' || platform === 'windows') return 'win';
  if (platform === 'darwin' || platform === 'mac') return 'mac';
  if (platform === 'linux') return 'linux';
  return 'win'; // default
}
