# API Test Suite Documentation

This document describes the comprehensive test suite for the Todo API server.

## Overview

The test suite uses **Vitest** as the testing framework and covers all API endpoints with 62 tests across 5 test files. All tests use Fastify's built-in injection method for fast, in-process testing without needing to start an actual HTTP server.

## Test Structure

```
server/
├── src/
│   ├── routes/
│   │   └── __tests__/
│   │       ├── todos.get.test.js       # GET /api/todos (11 tests)
│   │       ├── todos.getById.test.js   # GET /api/todos/:id (8 tests)
│   │       ├── todos.post.test.js      # POST /api/todos (14 tests)
│   │       ├── todos.put.test.js       # PUT /api/todos/:id (16 tests)
│   │       └── todos.delete.test.js    # DELETE /api/todos/:id (13 tests)
│   └── test-helpers/
│       ├── app.js                      # Test app factory
│       └── testData.js                 # Test data utilities
├── vitest.config.js                    # Vitest configuration
└── TESTING.md                          # This file
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

## Test Coverage

### GET /api/todos (11 tests)
Tests for retrieving all todos with optional filtering:
- ✓ Returns all todos without filters
- ✓ Filters by status (todo, in-progress, done)
- ✓ Filters by priority (low, medium, high)
- ✓ Searches in title (case-insensitive)
- ✓ Searches in description (case-insensitive)
- ✓ Combines multiple filters
- ✓ Returns empty array when no matches
- ✓ Validates status enum
- ✓ Validates priority enum
- ✓ Handles empty search term

### GET /api/todos/:id (8 tests)
Tests for retrieving a single todo by ID:
- ✓ Returns todo by valid ID
- ✓ Returns correct data for different IDs
- ✓ Returns 404 for non-existent ID
- ✓ Returns 404 for ID 0
- ✓ Returns 404 for negative ID
- ✓ Handles string ID conversion
- ✓ Returns all todo fields

### POST /api/todos (14 tests)
Tests for creating new todos:
- ✓ Creates todo with all fields
- ✓ Creates todo with only required field (title)
- ✓ Auto-increments ID correctly
- ✓ Persists to data file
- ✓ Sets createdAt and updatedAt timestamps
- ✓ Validates required title field
- ✓ Rejects empty title
- ✓ Validates status enum
- ✓ Validates priority enum
- ✓ Accepts all valid status values
- ✓ Accepts all valid priority values
- ✓ Handles max title length (200 chars)
- ✓ Rejects titles exceeding max length
- ✓ Handles long descriptions (1000 chars)

### PUT /api/todos/:id (16 tests)
Tests for updating existing todos:
- ✓ Updates title field
- ✓ Updates status field
- ✓ Updates multiple fields at once
- ✓ Updates updatedAt timestamp
- ✓ Preserves createdAt timestamp
- ✓ Persists updates to data file
- ✓ Returns 404 for non-existent todo
- ✓ Validates status enum
- ✓ Validates priority enum
- ✓ Rejects empty title
- ✓ Allows empty payload (no changes)
- ✓ Updates only priority field
- ✓ Sets description to empty string
- ✓ Adds description to todo without one
- ✓ Updates dueDate field
- ✓ Handles independent updates to different todos

### DELETE /api/todos/:id (13 tests)
Tests for deleting todos:
- ✓ Deletes todo and returns success
- ✓ Removes todo from data file
- ✓ Preserves other todos
- ✓ Returns 404 for non-existent todo
- ✓ Returns 404 when deleting same todo twice
- ✓ Deletes all todos independently
- ✓ Returns 404 for ID 0
- ✓ Returns 404 for negative ID
- ✓ Other operations work after deletion
- ✓ Deleted todo cannot be retrieved
- ✓ Deleted todo doesn't appear in list
- ✓ Handles deletion in middle of list
- ✓ Allows creating new todo after deletion

## Test Utilities

### Test App Factory ([app.js](src/test-helpers/app.js))
Creates a Fastify instance configured for testing:
- Disables logging for cleaner test output
- Registers all routes with `/api/todos` prefix
- Uses Fastify's `inject()` method for fast testing

### Test Data Utilities ([testData.js](src/test-helpers/testData.js))
Provides utilities for managing test data:
- **sampleTodos**: Default test data (3 todos)
- **backupTodos()**: Backs up current todos.json
- **restoreTodos()**: Restores backed up todos.json
- **setTestTodos()**: Sets todos.json to specific test data
- **readTodos()**: Reads current todos from file
- **setupTestData()**: Runs before each test
- **cleanupTestData()**: Runs after each test

Each test file uses `beforeEach()` and `afterEach()` hooks to ensure test isolation by backing up and restoring the data file.

## Test Configuration

### Vitest Config ([vitest.config.js](vitest.config.js))
- **fileParallelism: false** - Tests run sequentially to avoid data file conflicts
- **environment: 'node'** - Node.js environment
- **globals: true** - Global test APIs (describe, it, expect)
- **coverage** - V8 coverage provider with text, JSON, and HTML reports

## Test Data Isolation

All tests use a backup/restore mechanism to ensure isolation:
1. Before each test: Backup current `todos.json` and load sample test data
2. Run the test
3. After each test: Restore the original `todos.json`

This ensures tests don't interfere with each other or with development data.

## Sample Test Data

The default test data includes 3 todos:
```javascript
[
  {
    id: 1,
    title: "Test Todo 1",
    description: "First test todo",
    status: "todo",
    priority: "high",
    theme: "work",
    createdAt: "2024-01-01T10:00:00.000Z",
    updatedAt: "2024-01-01T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Test Todo 2",
    description: "Second test todo",
    status: "in-progress",
    priority: "medium",
    theme: "personal",
    createdAt: "2024-01-02T10:00:00.000Z",
    updatedAt: "2024-01-02T10:00:00.000Z"
  },
  {
    id: 3,
    title: "Test Todo 3",
    status: "done",
    priority: "low",
    theme: "study",
    createdAt: "2024-01-03T10:00:00.000Z",
    updatedAt: "2024-01-03T10:00:00.000Z"
  }
]
```

## Best Practices

1. **Test Isolation**: Each test is independent and doesn't rely on other tests
2. **Data Cleanup**: Test data is backed up and restored automatically
3. **Descriptive Names**: Test names clearly describe what they test
4. **Comprehensive Coverage**: Tests cover happy paths, edge cases, and error conditions
5. **Fast Execution**: Uses Fastify's inject() for in-process testing (no HTTP overhead)

## Adding New Tests

To add new tests:

1. Create a new test file in `src/routes/__tests__/`
2. Import test utilities:
   ```javascript
   import { createTestApp } from '../../test-helpers/app.js';
   import { setupTestData, cleanupTestData } from '../../test-helpers/testData.js';
   ```
3. Set up beforeEach/afterEach hooks:
   ```javascript
   beforeEach(async () => {
     setupTestData();
     app = await createTestApp();
   });

   afterEach(async () => {
     await app.close();
     cleanupTestData();
   });
   ```
4. Write your tests using `app.inject()`
5. Run `npm test` to verify

## Common Testing Patterns

### Testing a GET endpoint
```javascript
const response = await app.inject({
  method: 'GET',
  url: '/api/todos/1'
});

expect(response.statusCode).toBe(200);
const todo = JSON.parse(response.payload);
expect(todo.id).toBe(1);
```

### Testing a POST endpoint
```javascript
const response = await app.inject({
  method: 'POST',
  url: '/api/todos',
  payload: {
    title: 'New Todo'
  }
});

expect(response.statusCode).toBe(201);
```

### Testing validation errors
```javascript
const response = await app.inject({
  method: 'POST',
  url: '/api/todos',
  payload: {
    status: 'invalid-status'
  }
});

expect(response.statusCode).toBe(400);
const error = JSON.parse(response.payload);
expect(error).toHaveProperty('error');
```

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:
- Fast execution (~1.3 seconds for all 62 tests)
- No external dependencies
- Deterministic results
- Exit code 0 on success, 1 on failure

## Future Improvements

Potential enhancements to the test suite:
- Add test coverage reporting with `vitest --coverage`
- Add integration tests with a real HTTP server
- Add performance/load tests
- Add tests for concurrent operations
- Add snapshot testing for complex responses
