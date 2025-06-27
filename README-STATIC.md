# Workout Timer Pro - Static Export 🏋️

This branch contains the static export of Workout Timer Pro, ready for deployment to any static hosting service.

## 🚀 Quick Deploy

### GitHub Pages
This branch is configured to automatically deploy to GitHub Pages when pushed.

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Vercel
1. Import your repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

### Manual Deployment
```bash
# Build the project
npm run build

# The static files are in the `dist` folder
# Upload the contents of `dist` to your hosting service
```

## 📁 Static Files

The build process creates these files in the `dist` directory:
- `index.html` - Main HTML file
- `assets/` - CSS and JavaScript bundles
- `favicon.ico` - App icon

## 🔧 Configuration

### Base Path
If deploying to a subdirectory, update the base path in `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-subdirectory/',
  // ... other config
})
```

### Environment Variables
The app uses local storage for data persistence, so no environment variables are needed for the static build.

## 🌐 Live Demo

Once deployed, your app will be available at:
- GitHub Pages: `https://yourusername.github.io/your-repo-name/`
- Netlify: `https://your-app-name.netlify.app`
- Vercel: `https://your-app-name.vercel.app`

## 📝 Notes

- This is a client-side only application
- All data is stored in browser local storage
- No server-side functionality required
- Works offline after initial load

---

**Ready for deployment! 🚀** 