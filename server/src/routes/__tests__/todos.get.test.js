import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../test-helpers/app.js';
import { setupTestData, cleanupTestData, sampleTodos, setTestTodos } from '../../test-helpers/testData.js';

describe('GET /api/todos', () => {
  let app;

  beforeEach(async () => {
    setupTestData();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    cleanupTestData();
  });

  it('should return all todos when no filters are applied', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(3);
    expect(todos).toEqual(sampleTodos);
  });

  it('should filter todos by status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?status=todo'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(1);
    expect(todos[0].status).toBe('todo');
    expect(todos[0].id).toBe('550e8400-e29b-41d4-a716-446655440001');
  });

  it('should filter todos by priority', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?priority=high'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(1);
    expect(todos[0].priority).toBe('high');
    expect(todos[0].id).toBe('550e8400-e29b-41d4-a716-446655440001');
  });

  it('should filter todos by search term in title', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?search=Todo 2'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toContain('Todo 2');
  });

  it('should filter todos by search term in description', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?search=Second test'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(1);
    expect(todos[0].description).toContain('Second test');
  });

  it('should perform case-insensitive search', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?search=TEST TODO'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos.length).toBeGreaterThan(0);
  });

  it('should combine multiple filters (status and priority)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?status=in-progress&priority=medium'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(1);
    expect(todos[0].status).toBe('in-progress');
    expect(todos[0].priority).toBe('medium');
  });

  it('should return empty array when no todos match filters', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?status=todo&priority=low'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(0);
  });

  it('should return 400 for invalid status value', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?status=invalid-status'
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should return 400 for invalid priority value', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?priority=invalid-priority'
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should handle empty search term', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos?search='
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(3);
  });

  it('should return empty array when data file is empty', async () => {
    setTestTodos([]);

    const response = await app.inject({
      method: 'GET',
      url: '/api/todos'
    });

    expect(response.statusCode).toBe(200);
    const todos = JSON.parse(response.payload);
    expect(todos).toHaveLength(0);
    expect(Array.isArray(todos)).toBe(true);
  });
});
