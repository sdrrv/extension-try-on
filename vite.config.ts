import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure both popup and content scripts are bundled correctly
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'), // Main HTML file for popup
        content: resolve(__dirname, 'src/content.ts'), // Content script file
        background: resolve(__dirname, 'src/background.ts'), // Background script file
      },
      output: {
        // Output to dist folder
        dir: 'dist',
        format: 'esm',  // Use ES modules (compatible with Firefox extension)
        entryFileNames: '[name].js', // Ensures content.js and background.js are named correctly
      },
    },
  },
});

