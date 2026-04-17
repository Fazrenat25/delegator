#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  ['bg-slate-50 flex', 'bg-slate-900/50 flex'],
  ['bg-slate-50/', 'bg-slate-800/'],
  ['bg-slate-50"', 'bg-slate-900/50"'],
  ['bg-slate-50\'', 'bg-slate-900/50\''],
  ['bg-white flex', 'bg-slate-800/50 flex'],
  ['bg-white rounded', 'bg-slate-800/50 backdrop-blur-sm rounded'],
  ['bg-white border', 'bg-slate-800/50 backdrop-blur-sm border'],
  ['bg-white p-6', 'bg-slate-800/50 backdrop-blur-sm p-6'],
  ['bg-white shadow', 'bg-slate-800/50 backdrop-blur-sm shadow'],
  
  // Text colors
  ['text-slate-900"', 'text-white"'],
  ['text-slate-900\'', 'text-white\''],
  ['text-slate-900 ', 'text-white '],
  ['text-slate-600"', 'text-slate-400"'],
  ['text-slate-600\'', 'text-slate-400\''],
  ['text-slate-600 ', 'text-slate-400 '],
  ['text-slate-500"', 'text-slate-500"'],
  
  // Borders
  ['border-slate-200', 'border-slate-700/50'],
  ['border-slate-100', 'border-slate-700/50'],
  ['border-slate-300', 'border-slate-600'],
  
  // Hover states
  ['hover:bg-slate-50', 'hover:bg-slate-700/50'],
  ['hover:bg-slate-100', 'hover:bg-slate-700/50'],
  ['hover:border-slate-300', 'hover:border-slate-600'],
  
  // Focus states  
  ['focus:ring-slate-200', 'focus:ring-amber-500/30'],
  ['focus:border-slate-500', 'focus:border-amber-500'],
  
  // Specific patterns
  ['bg-white/10', 'bg-slate-700/50'],
  ['text-slate-700', 'text-slate-300'],
  ['bg-slate-100', 'bg-slate-800/50'],
];

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      processFile(fullPath);
    }
  }
}

const dashboardDir = path.join(__dirname, '../src/app/dashboard');
console.log('Starting dark theme conversion for dashboard pages...');
processDirectory(dashboardDir);
console.log('\n✅ Dark theme conversion complete!');
