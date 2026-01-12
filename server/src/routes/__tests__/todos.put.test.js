import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../test-helpers/app.js';
import { setupTestData, cleanupTestData, readTodos } from '../../test-helpers/testData.js';

describe('PUT /api/todos/:id', () => {
  let app;

  beforeEach(async () => {
    setupTestData();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    cleanupTestData();
  });

  it('should update a todo title', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        title: 'Updated Title'
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.title).toBe('Updated Title');
    expect(todo.id).toBe('550e8400-e29b-41d4-a716-446655440001');
    expect(todo.description).toBe('First test todo'); // Should keep original
  });

  it('should update a todo status', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        status: 'done'
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.status).toBe('done');
    expect(todo.title).toBe('Test Todo 1'); // Should keep original
  });

  it('should update multiple fields at once', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002',
      payload: {
        title: 'Completely Updated',
        description: 'New description',
        status: 'done',
        priority: 'high',
        theme: 'work'
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.title).toBe('Completely Updated');
    expect(todo.description).toBe('New description');
    expect(todo.status).toBe('done');
    expect(todo.priority).toBe('high');
    expect(todo.theme).toBe('work');
  });

  it('should update the updatedAt timestamp', async () => {
    const beforeUpdate = new Date().toISOString();

    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        title: 'Updated for timestamp test'
      }
    });

    const afterUpdate = new Date().toISOString();
    const todo = JSON.parse(response.payload);

    expect(todo.updatedAt).toBeDefined();
    expect(new Date(todo.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(beforeUpdate).getTime());
    expect(new Date(todo.updatedAt).getTime()).toBeLessThanOrEqual(new Date(afterUpdate).getTime());
    expect(todo.createdAt).not.toBe(todo.updatedAt); // Should be different
  });

  it('should not change the createdAt timestamp', async () => {
    const originalCreatedAt = '2024-01-01T10:00:00.000Z';

    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        title: 'Updated'
      }
    });

    const todo = JSON.parse(response.payload);
    expect(todo.createdAt).toBe(originalCreatedAt);
  });

  it('should persist updates to the data file', async () => {
    await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        title: 'Persisted Update',
        status: 'done'
      }
    });

    const todos = readTodos();
    const updatedTodo = todos.find(t => t.id === '550e8400-e29b-41d4-a716-446655440001');

    expect(updatedTodo.title).toBe('Persisted Update');
    expect(updatedTodo.status).toBe('done');
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655449999',
      payload: {
        title: 'Does not exist'
      }
    });

    expect(response.statusCode).toBe(404);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
    expect(error.error).toBe('Todo not found');
  });

  it('should return 400 for invalid status', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        status: 'invalid-status'
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should return 400 for invalid priority', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        priority: 'invalid-priority'
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should return 400 for empty title', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        title: ''
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should allow updating with empty payload (no changes)', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {}
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.title).toBe('Test Todo 1'); // Original unchanged
  });

  it('should update only the priority field', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        priority: 'low'
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.priority).toBe('low');
    expect(todo.title).toBe('Test Todo 1'); // Other fields unchanged
    expect(todo.status).toBe('todo');
  });

  it('should update description to empty string', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        description: ''
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.description).toBe('');
  });

  it('should add description to todo that had none', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440003',
      payload: {
        description: 'Newly added description'
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.description).toBe('Newly added description');
  });

  it('should update dueDate field', async () => {
    const dueDate = '2024-12-31T23:59:59.000Z';

    const response = await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: {
        dueDate
      }
    });

    expect(response.statusCode).toBe(200);
    const todo = JSON.parse(response.payload);
    expect(todo.dueDate).toBe(dueDate);
  });

  it('should handle updates to different todos independently', async () => {
    await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
      payload: { title: 'Updated 1' }
    });

    await app.inject({
      method: 'PUT',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002',
      payload: { title: 'Updated 2' }
    });

    const todos = readTodos();
    expect(todos[0].title).toBe('Updated 1');
    expect(todos[1].title).toBe('Updated 2');
    expect(todos[2].title).toBe('Test Todo 3'); // Unchanged
  });
});
