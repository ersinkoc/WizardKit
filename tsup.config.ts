import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/adapters/react/index.ts',
    vue: 'src/adapters/vue/index.ts',
    svelte: 'src/adapters/svelte/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'vue', 'svelte', 'svelte/store'],
  treeshake: true,
  esbuildOptions(options) {
    options.conditions = ['module', 'import', 'default']
  },
  onSuccess: 'echo "Build completed successfully!"'
})
