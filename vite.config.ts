import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.tsx'),
                content: resolve(__dirname, 'src/content/index.ts')
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'assets/styles.css';
                    }
                    return 'assets/[name][extname]';
                }
            }
        }
    }
});