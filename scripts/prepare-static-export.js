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

// Function to fix imports in a file for static export
function fixImportsForStaticExport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix @/ imports to relative paths only for static export
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

// Function to ensure lib/utils.js exists
function ensureUtilsFileExists() {
  const utilsPath = path.join(__dirname, '..', 'src', 'lib', 'utils.js');
  const utilsDir = path.dirname(utilsPath);
  
  // Create lib directory if it doesn't exist
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  // Create utils.js if it doesn't exist
  if (!fs.existsSync(utilsPath)) {
    const utilsContent = `import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}`;
    fs.writeFileSync(utilsPath, utilsContent);
    console.log('Created lib/utils.js file');
  }
}

// Function to restore imports for main branch
function restoreImportsForMain(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Convert relative imports back to @/ imports for main branch
  const relativeImportRegex = /from\s+['"]\.\.\/\.\.\/lib\/utils\.js['"]/g;
  if (relativeImportRegex.test(content)) {
    content = content.replace(relativeImportRegex, `from '@/lib/utils'`);
    modified = true;
  }
  
  // Also handle other common relative imports that should be @/ imports
  const otherRelativeRegex = /from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g;
  let match;
  while ((match = otherRelativeRegex.exec(content)) !== null) {
    const importPath = match[1];
    const newImport = `from '@/${importPath}'`;
    content = content.replace(match[0], newImport);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Restored @/ imports in: ${filePath}`);
  }
}

// Main execution
const isStaticExport = process.argv.includes('--static-export');
const isMainBranch = process.argv.includes('--main-branch');

if (isStaticExport) {
  console.log('Preparing static-export branch...');
  
  // Ensure lib/utils.js exists before converting imports
  ensureUtilsFileExists();
  
  const srcDir = path.join(__dirname, '..', 'src');
  const jsxFiles = findJsxFiles(srcDir);
  
  console.log(`Found ${jsxFiles.length} JSX files to process...`);
  
  for (const file of jsxFiles) {
    fixImportsForStaticExport(file);
  }
  
  console.log('Static export preparation complete!');
  console.log('All @/ imports have been converted to relative imports.');
} else if (isMainBranch) {
  console.log('Restoring main branch imports...');
  
  // Ensure lib/utils.js exists before restoring imports
  ensureUtilsFileExists();
  
  const srcDir = path.join(__dirname, '..', 'src');
  const jsxFiles = findJsxFiles(srcDir);
  
  console.log(`Found ${jsxFiles.length} JSX files to process...`);
  
  for (const file of jsxFiles) {
    restoreImportsForMain(file);
  }
  
  console.log('Main branch restoration complete!');
  console.log('All relative imports have been converted back to @/ imports.');
} else {
  console.log('Usage:');
  console.log('  node scripts/prepare-static-export.js --static-export  # For static export branch');
  console.log('  node scripts/prepare-static-export.js --main-branch    # For main branch');
} 