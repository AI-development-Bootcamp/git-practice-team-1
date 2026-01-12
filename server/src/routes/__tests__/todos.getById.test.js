import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../test-helpers/app.js';
import { setupTestData, cleanupTestData, sampleTodos } from '../../test-helpers/testData.js';

describe('GET /api/todos/:id', () => {
  let app;

  beforeEach(async () => {
    setupTestData();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    cleanupTestData();
  });

  it('should return a todo by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo).toEqual(sampleTodos[0]);
    expect(todo.id).toBe('550e8400-e29b-41d4-a716-446655440001');
    expect(todo.title).toBe('Test Todo 1');
  });

  it('should return the correct todo for id 2', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002'
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo).toEqual(sampleTodos[1]);
    expect(todo.id).toBe('550e8400-e29b-41d4-a716-446655440002');
    expect(todo.status).toBe('in-progress');
  });

  it('should return the correct todo for id 3', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440003'
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo).toEqual(sampleTodos[2]);
    expect(todo.id).toBe('550e8400-e29b-41d4-a716-446655440003');
    expect(todo.status).toBe('done');
  });

  it('should return 404 for non-existent todo id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655449999'
    });

    expect(response.statusCode).toBe(404);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
    expect(error.error).toBe('Todo not found');
  });

  it('should return 404 for invalid UUID', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos/invalid-uuid'
    });

    expect(response.statusCode).toBe(404);
    const error = JSON.parse(response.payload);
    expect(error.error).toBe('Todo not found');
  });

  it('should return all fields of the todo', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('title');
    expect(todo).toHaveProperty('description');
    expect(todo).toHaveProperty('status');
    expect(todo).toHaveProperty('priority');
    expect(todo).toHaveProperty('theme');
    expect(todo).toHaveProperty('createdAt');
    expect(todo).toHaveProperty('updatedAt');
  });
});
