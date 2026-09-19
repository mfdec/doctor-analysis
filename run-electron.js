#!/usr/bin/env node

/**
 * MedScript Analytics - Electron Runner
 * 
 * Run this script to launch the app in Electron.
 * 
 * Usage:
 *   node run-electron.js [--dev]
 * 
 * --dev: Opens dev tools and connects to Vite dev server
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.argv.includes('--dev');

console.log('🏥 MedScript Analytics');
console.log('======================\n');

if (isDev) {
  console.log('🔧 Starting in development mode...\n');
  
  // Start Vite dev server
  console.log('📦 Starting Vite dev server...');
  const vite = spawn('npx', ['vite', '--port', '5173'], {
    stdio: 'pipe',
    shell: true,
  });
  
  vite.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[Vite] ${output.trim()}`);
    
    // When Vite is ready, start Electron
    if (output.includes('Local:') || output.includes('localhost')) {
      setTimeout(() => {
        startElectron(true);
      }, 1000);
    }
  });
  
  vite.stderr.on('data', (data) => {
    console.error(`[Vite Error] ${data.toString().trim()}`);
  });
  
  vite.on('close', (code) => {
    console.log(`Vite process exited with code ${code}`);
    process.exit(code);
  });
  
} else {
  console.log('📦 Starting in production mode...');
  
  // Check if dist exists
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('📦 Building React app first...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Build failed');
      process.exit(1);
    }
  }
  
  startElectron(false);
}

function startElectron(devMode) {
  console.log('\n🖥️  Launching Electron...');
  
  process.env.NODE_ENV = devMode ? 'development' : 'production';
  
  const electron = spawn('npx', ['electron', 'electron/main.js'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: devMode ? 'development' : 'production',
    },
  });
  
  electron.on('close', (code) => {
    console.log(`\nElectron exited with code ${code}`);
    process.exit(code);
  });
  
  electron.on('error', (err) => {
    console.error('Failed to start Electron:', err.message);
    process.exit(1);
  });
}
