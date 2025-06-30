import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build'
  const isStaticExport = process.env.BRANCH === 'static-export' || mode === 'static-export'
  
  return {
    base: isProduction ? '/workout-timer/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: isStaticExport ? {} : {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __IS_STATIC_EXPORT__: JSON.stringify(isStaticExport),
    }
  }
})
