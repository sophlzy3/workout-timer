#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all JSX files
function findJsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findJsxFiles(fullPath));
    } else if (item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix imports in a file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix @/ imports to relative paths
  const importRegex = /from\s+['"]@\/([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const relativePath = path.relative(path.dirname(filePath), path.join('src', importPath));
    const newImport = `from './${relativePath}'`;
    content = content.replace(match[0], newImport);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in: ${filePath}`);
  }
}

// Main execution
console.log('Preparing static-export branch...');

const srcDir = path.join(__dirname, '..', 'src');
const jsxFiles = findJsxFiles(srcDir);

console.log(`Found ${jsxFiles.length} JSX files to process...`);

for (const file of jsxFiles) {
  fixImports(file);
}

console.log('Static export preparation complete!');
console.log('All @/ imports have been converted to relative imports.'); 