import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      ['**/src/test/e2e/**', path.resolve(__dirname, './src/vitest-environments/prisma.ts')],
    ],
    coverage: {
      enabled: true,
      reporter: ['html'],
      outDir: 'coverage',
      reportOnFailure: true,
    },
  },
  ssr: {
    external: ['@prisma/client', '@prisma/adapter-pg', 'prisma'],
  },
})
