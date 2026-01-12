import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestApp } from '../../test-helpers/app.js';
import { setupTestData, cleanupTestData, setTestTodos } from '../../test-helpers/testData.js';

describe('Theme Field Tests', () => {
  let app;

  beforeEach(async () => {
    setupTestData();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
    cleanupTestData();
  });

  describe('POST /api/todos - Theme validation', () => {
    it('should accept all valid theme values', async () => {
      const themes = ['work', 'personal', 'shopping', 'health', 'study', 'other'];

      for (const theme of themes) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/todos',
          payload: {
            title: `Todo with ${theme} theme`,
            theme
          }
        });

        expect(response.statusCode).toBe(201);
        const todo = JSON.parse(response.payload);
        expect(todo.theme).toBe(theme);
      }
    });

    it('should return 400 for invalid theme value', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/todos',
        payload: {
          title: 'Todo with invalid theme',
          theme: 'invalid-theme'
        }
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.payload);
      expect(error).toHaveProperty('error');
    });

    it('should use default theme when none provided', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/todos',
        payload: {
          title: 'Todo without theme'
        }
      });

      expect(response.statusCode).toBe(201);
      const todo = JSON.parse(response.payload);
      expect(todo.theme).toBeDefined();
      expect(['work', 'personal', 'shopping', 'health', 'study', 'other']).toContain(todo.theme);
    });
  });

  describe('PUT /api/todos/:id - Theme updates', () => {
    it('should update theme field', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
        payload: {
          theme: 'shopping'
        }
      });

      expect(response.statusCode).toBe(200);
      const todo = JSON.parse(response.payload);
      expect(todo.theme).toBe('shopping');
      expect(todo.title).toBe('Test Todo 1'); // Other fields unchanged
    });

    it('should return 400 for invalid theme on update', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/api/todos/550e8400-e29b-41d4-a716-446655440001',
        payload: {
          theme: 'not-a-valid-theme'
        }
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.payload);
      expect(error).toHaveProperty('error');
    });
  });

  describe('GET /api/todos - Theme filtering', () => {
    beforeEach(() => {
      // Set up data with diverse themes using UUID IDs
      const themeTodos = [
        { id: '550e8400-e29b-41d4-a716-446655440011', title: 'Work Task', status: 'todo', priority: 'high', theme: 'work', createdAt: '2024-01-01T10:00:00.000Z', updatedAt: '2024-01-01T10:00:00.000Z' },
        { id: '550e8400-e29b-41d4-a716-446655440012', title: 'Shopping List', status: 'todo', priority: 'medium', theme: 'shopping', createdAt: '2024-01-02T10:00:00.000Z', updatedAt: '2024-01-02T10:00:00.000Z' },
        { id: '550e8400-e29b-41d4-a716-446655440013', title: 'Doctor Appointment', status: 'todo', priority: 'high', theme: 'health', createdAt: '2024-01-03T10:00:00.000Z', updatedAt: '2024-01-03T10:00:00.000Z' },
        { id: '550e8400-e29b-41d4-a716-446655440014', title: 'Study Session', status: 'in-progress', priority: 'medium', theme: 'study', createdAt: '2024-01-04T10:00:00.000Z', updatedAt: '2024-01-04T10:00:00.000Z' },
        { id: '550e8400-e29b-41d4-a716-446655440015', title: 'Personal Errand', status: 'done', priority: 'low', theme: 'personal', createdAt: '2024-01-05T10:00:00.000Z', updatedAt: '2024-01-05T10:00:00.000Z' }
      ];
      setTestTodos(themeTodos);
    });

    it('should filter todos by work theme', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/todos?theme=work'
      });

      expect(response.statusCode).toBe(200);
      const todos = JSON.parse(response.payload);
      expect(todos.length).toBeGreaterThan(0);
      todos.forEach(todo => {
        expect(todo.theme).toBe('work');
      });
    });

    it('should filter todos by shopping theme', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/todos?theme=shopping'
      });

      expect(response.statusCode).toBe(200);
      const todos = JSON.parse(response.payload);
      expect(todos).toHaveLength(1);
      expect(todos[0].theme).toBe('shopping');
      expect(todos[0].title).toBe('Shopping List');
    });

    it('should filter todos by health theme', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/todos?theme=health'
      });

      expect(response.statusCode).toBe(200);
      const todos = JSON.parse(response.payload);
      expect(todos).toHaveLength(1);
      expect(todos[0].theme).toBe('health');
    });

    it('should combine theme filter with status filter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/todos?theme=study&status=in-progress'
      });

      expect(response.statusCode).toBe(200);
      const todos = JSON.parse(response.payload);
      expect(todos).toHaveLength(1);
      expect(todos[0].theme).toBe('study');
      expect(todos[0].status).toBe('in-progress');
    });

    it('should return 400 for invalid theme filter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/todos?theme=invalid-theme'
      });

      expect(response.statusCode).toBe(400);
      const error = JSON.parse(response.payload);
      expect(error).toHaveProperty('error');
    });

    it('should return empty array when no todos match theme', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/todos?theme=other'
      });

      expect(response.statusCode).toBe(200);
      const todos = JSON.parse(response.payload);
      expect(todos).toHaveLength(0);
    });
  });
});
