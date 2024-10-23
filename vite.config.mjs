import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 20000,
    hookTimeout: 20000,
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
