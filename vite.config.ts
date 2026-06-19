import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsConfigPaths(),
        visualizer({
            filename: 'dist/sunburst.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'sunburst',
        }),
        visualizer({
            filename: 'dist/treemap.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap'
        }),
        visualizer({
            filename: 'dist/treemap-3d.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap-3d'
        }),
        visualizer({
            filename: 'dist/flamegraph.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            template: 'flamegraph'
        })
    ],
});
