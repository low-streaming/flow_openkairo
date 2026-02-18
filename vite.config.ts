import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/solar-flow-card.ts',
            formats: ['es'],
        },
        rollupOptions: {
            external: [],
            output: {
                entryFileNames: 'flow-openkairo-card.js',
            },
        },
        // Output to root for simpler HACS usage (optional, but easier for direct file access)
        outDir: '.',
        emptyOutDir: false, // Don't delete other files in root
        minify: true,
    },
});
