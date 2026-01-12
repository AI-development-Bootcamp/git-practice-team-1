import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../test-helpers/app.js';
import { setupTestData, cleanupTestData, readTodos } from '../../test-helpers/testData.js';

describe('POST /api/todos', () => {
  let app;

  beforeEach(async () => {
    setupTestData();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    cleanupTestData();
  });

  it('should create a new todo with all fields', async () => {
    const newTodo = {
      title: 'New Test Todo',
      description: 'This is a test description',
      status: 'todo',
      priority: 'high'
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: newTodo
    });

    expect(response.statusCode).toBe(201);
    const todo = JSON.parse(response.payload);

    expect(todo).toHaveProperty('id');
    expect(typeof todo.id).toBe('string'); // UUID is a string
    expect(todo.title).toBe(newTodo.title);
    expect(todo.description).toBe(newTodo.description);
    expect(todo.status).toBe(newTodo.status);
    expect(todo.priority).toBe(newTodo.priority);
    expect(todo).toHaveProperty('createdAt');
    expect(todo).toHaveProperty('updatedAt');
  });

  it('should create a todo with only required fields (title)', async () => {
    const newTodo = {
      title: 'Minimal Todo'
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: newTodo
    });

    expect(response.statusCode).toBe(201);
    const todo = JSON.parse(response.payload);

    expect(todo.title).toBe(newTodo.title);
    expect(todo.status).toBe('todo'); // Default value
    expect(todo.priority).toBe('medium'); // Default value
    expect(todo).toHaveProperty('id');
    expect(typeof todo.id).toBe('string');
    expect(todo).toHaveProperty('createdAt');
    expect(todo).toHaveProperty('updatedAt');
  });

  it('should generate unique UUIDs for each todo', async () => {
    const todo1 = { title: 'First new todo' };
    const todo2 = { title: 'Second new todo' };

    const response1 = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: todo1
    });

    const response2 = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: todo2
    });

    const createdTodo1 = JSON.parse(response1.payload);
    const createdTodo2 = JSON.parse(response2.payload);

    expect(typeof createdTodo1.id).toBe('string');
    expect(typeof createdTodo2.id).toBe('string');
    expect(createdTodo1.id).not.toBe(createdTodo2.id); // Different UUIDs
  });

  it('should persist the todo to the data file', async () => {
    const newTodo = {
      title: 'Persisted Todo',
      description: 'Should be saved to file'
    };

    await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: newTodo
    });

    const todos = readTodos();
    const savedTodo = todos.find(t => t.title === 'Persisted Todo');

    expect(savedTodo).toBeDefined();
    expect(savedTodo.description).toBe('Should be saved to file');
  });

  it('should set createdAt and updatedAt timestamps', async () => {
    const beforeCreate = new Date().toISOString();

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { title: 'Timestamp Test' }
    });

    const afterCreate = new Date().toISOString();
    const todo = JSON.parse(response.payload);

    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
    expect(new Date(todo.createdAt).getTime()).toBeGreaterThanOrEqual(new Date(beforeCreate).getTime());
    expect(new Date(todo.createdAt).getTime()).toBeLessThanOrEqual(new Date(afterCreate).getTime());
    expect(todo.createdAt).toBe(todo.updatedAt); // Should be equal on creation
  });

  it('should return 400 when title is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        description: 'No title provided'
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should return 400 when title is empty string', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: ''
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should return 400 for invalid status', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: 'Test Todo',
        status: 'invalid-status'
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should return 400 for invalid priority', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: 'Test Todo',
        priority: 'invalid-priority'
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });


  it('should accept all valid status values', async () => {
    const statuses = ['todo', 'in-progress', 'done'];

    for (const status of statuses) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/todos',
        payload: {
          title: `Todo with ${status}`,
          status
        }
      });

      expect(response.statusCode).toBe(201);
      const todo = JSON.parse(response.payload);
      expect(todo.status).toBe(status);
    }
  });

  it('should accept all valid priority values', async () => {
    const priorities = ['low', 'medium', 'high'];

    for (const priority of priorities) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/todos',
        payload: {
          title: `Todo with ${priority} priority`,
          priority
        }
      });

      expect(response.statusCode).toBe(201);
      const todo = JSON.parse(response.payload);
      expect(todo.priority).toBe(priority);
    }
  });


  it('should handle titles at max length (200 chars)', async () => {
    const longTitle = 'A'.repeat(200);

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: longTitle
      }
    });

    expect(response.statusCode).toBe(201);
    const todo = JSON.parse(response.payload);
    expect(todo.title).toBe(longTitle);
  });

  it('should return 400 for titles exceeding max length (200 chars)', async () => {
    const tooLongTitle = 'A'.repeat(201);

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: tooLongTitle
      }
    });

    expect(response.statusCode).toBe(400);
    const error = JSON.parse(response.payload);
    expect(error).toHaveProperty('error');
  });

  it('should handle long descriptions', async () => {
    const longDescription = 'B'.repeat(1000);

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: {
        title: 'Test',
        description: longDescription
      }
    });

    expect(response.statusCode).toBe(201);
    const todo = JSON.parse(response.payload);
    expect(todo.description).toBe(longDescription);
  });
});
