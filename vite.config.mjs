import path from 'path'

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    testTimeout: 25000,
    hookTimeout: 25000,
    environmentMatchGlobs: [
      ['./src/test/**', './src/vitest-environments/prisma.ts'],
    ],
    coverage: {
      enabled: true,
      reporter: ['html'],
      outDir: 'coverage',
      reportOnFailure: true,
    },
  },
})
