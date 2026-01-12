import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../test-helpers/app.js';
import { setupTestData, cleanupTestData, readTodos } from '../../test-helpers/testData.js';

describe('DELETE /api/todos/:id', () => {
  let app;

  beforeEach(async () => {
    setupTestData();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    cleanupTestData();
  });

  it('should delete a todo and return success', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.payload);
    expect(result).toEqual({ success: true });
  });

  it('should remove the todo from the data file', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    const todos = readTodos();
    expect(todos).toHaveLength(2);
    expect(todos.find(t => t.id === '550e8400-e29b-41d4-a716-446655440001')).toBeUndefined();
  });

  it('should keep other todos when deleting one', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002'
    });

    const todos = readTodos();
    expect(todos).toHaveLength(2);
    expect(todos.find(t => t.id === '550e8400-e29b-41d4-a716-446655440001')).toBeDefined();
    expect(todos.find(t => t.id === '550e8400-e29b-41d4-a716-446655440002')).toBeUndefined();
    expect(todos.find(t => t.id === '550e8400-e29b-41d4-a716-446655440003')).toBeDefined();
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655449999'
    });

    expect(response.statusCode).toBe(404);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
    expect(error.error).toBe('Todo not found');
  });

  it('should return 404 when deleting the same todo twice', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    const response = await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    expect(response.statusCode).toBe(404);
    const error = JSON.parse(response.payload);
    expect(error.error).toBe('Todo not found');
  });

  it('should delete all todos independently', async () => {
    const response1 = await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    const response2 = await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002'
    });

    const response3 = await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440003'
    });

    expect(response1.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
    expect(response3.statusCode).toBe(200);

    const todos = readTodos();
    expect(todos).toHaveLength(0);
  });

  it('should return 404 for invalid UUID format', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/todos/invalid-uuid'
    });

    expect(response.statusCode).toBe(404);
    const error = JSON.parse(response.payload);
    expect(error.error).toBe('Todo not found');
  });

  it('should not affect other operations after deletion', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002'
    });

    const getResponse = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    expect(getResponse.statusCode).toBe(200);
    const todo = JSON.parse(getResponse.payload);
    expect(todo.id).toBe('550e8400-e29b-41d4-a716-446655440001');
  });

  it('should verify deleted todo cannot be retrieved', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    const getResponse = await app.inject({
      method: 'GET',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('should verify deleted todo does not appear in list', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440001'
    });

    const listResponse = await app.inject({
      method: 'GET',
      url: '/api/todos'
    });

    const todos = JSON.parse(listResponse.payload);
    expect(todos).toHaveLength(2);
    expect(todos.find(t => t.id === '550e8400-e29b-41d4-a716-446655440001')).toBeUndefined();
  });

  it('should handle deletion in the middle of the list', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440002'
    });

    const todos = readTodos();
    expect(todos).toHaveLength(2);
    expect(todos[0].id).toBe('550e8400-e29b-41d4-a716-446655440001');
    expect(todos[1].id).toBe('550e8400-e29b-41d4-a716-446655440003');
  });

  it('should allow creating new todo after deletion', async () => {
    await app.inject({
      method: 'DELETE',
      url: '/api/todos/550e8400-e29b-41d4-a716-446655440003'
    });

    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: 'New todo after deletion'
      }
    });

    expect(createResponse.statusCode).toBe(201);
    const newTodo = JSON.parse(createResponse.payload);
    expect(newTodo.id).toBeDefined(); // UUID will be randomly generated
    expect(typeof newTodo.id).toBe('string');
  });
});
