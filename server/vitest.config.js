import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 10000, // 10 seconds for I/O operations
    hookTimeout: 10000, // 10 seconds for setup/teardown hooks
    fileParallelism: false, // Run test files sequentially to avoid data file conflicts
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-helpers/',
        'src/**/__tests__/',
        'vitest.config.js'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
