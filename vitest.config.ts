/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: ['./node_modules', './dist'],
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
    setupFiles: ['./src/test/setup'],
  },
})
