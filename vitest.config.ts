import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // `server-only` throws outside a React Server Components bundler;
      // stub it so the server-only content domain is unit-testable.
      'server-only': path.resolve(__dirname, './tests/stubs/server-only.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
  },
})
