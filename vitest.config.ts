import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    __DB_MODE__: 'false',
  },
  test: {
    include: ['app/**/*.test.ts'],
  },
})
