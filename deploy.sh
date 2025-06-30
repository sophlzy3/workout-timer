#!/bin/bash

# Deploy script for Workout Timer
# This script handles the differences between main and static-export branches

echo "🚀 Starting deployment process..."

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ You have uncommitted changes. Please commit them first."
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# If we're not on main, switch to it
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "📋 Switching to main branch..."
    git checkout main
fi

# Pull latest changes
echo "📥 Pulling latest changes from main..."
git pull origin main

# Commit current changes to main
echo "💾 Committing changes to main..."
git add .
git commit -m "Update workout timer with latest changes"
git push origin main

# Switch to static-export branch
echo "🔄 Switching to static-export branch..."
git checkout static-export

# Merge changes from main
echo "🔀 Merging changes from main..."
git merge main

# Prepare for static export (convert path aliases to relative paths)
echo "🔧 Preparing for static export..."
node scripts/prepare-static-export.js --static-export

# Test the build
echo "🧪 Testing build..."
npm run build

# Commit the static export changes
echo "💾 Committing static export changes..."
git add .
git commit -m "Prepare for static export deployment"

# Push to trigger deployment
echo "🚀 Pushing to static-export to trigger deployment..."
git push origin static-export

echo "✅ Deployment triggered!"
echo "📊 Check the deployment status at: https://github.com/yourusername/workout-timer/actions"
echo "🌐 Your site will be available at: https://yourusername.github.io/workout-timer/"

# Switch back to main
echo "🔄 Switching back to main branch..."
git checkout main

# Restore main branch imports
echo "🔧 Restoring main branch imports..."
node scripts/prepare-static-export.js --main-branch

# Test the build on main
echo "🧪 Testing build on main..."
npm run build

# Commit the restored imports
echo "💾 Committing restored imports..."
git add .
git commit -m "Restore @/ imports for main branch"
git push origin main

echo "🎉 Deployment process complete!"
echo "✅ Main branch imports have been restored and tested." 