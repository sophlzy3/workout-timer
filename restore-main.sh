#!/bin/bash

# Restore main branch imports script
# This script converts relative imports back to @/ imports for the main branch

echo "🔄 Restoring main branch imports..."

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "📋 Switching to main branch..."
    git checkout main
fi

# Restore @/ imports
echo "🔧 Restoring @/ imports..."
node scripts/prepare-static-export.js --main-branch

# Test the build
echo "🧪 Testing build..."
npm run build

# Commit the changes
echo "💾 Committing restored imports..."
git add .
git commit -m "Restore @/ imports for main branch"
git push origin main

echo "✅ Main branch imports restored!"
echo "🎉 You can now develop normally with @/ imports." 