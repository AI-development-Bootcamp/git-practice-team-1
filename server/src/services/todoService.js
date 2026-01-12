import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = join(__dirname, '../data/todos.json');

function readTodos() {
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    const todos = JSON.parse(data);

    // Migrate: ensure all todos have priority field
    return todos.map(todo => ({
      ...todo,
      priority: todo.priority || 'medium'
    }));
  } catch (error) {
    return [];
  }
}

function writeTodos(todos) {
  writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

export const todoService = {
  getAll(filters = {}) {
    const todos = readTodos();

    // Apply filters if provided
    let filtered = todos;

    if (filters.status) {
      filtered = filtered.filter(todo => todo.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    if (filters.theme) {
      filtered = filtered.filter(todo => todo.theme === filters.theme);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        (todo.description && todo.description.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  },

  getById(id) {
    const todos = readTodos();
    return todos.find(todo => String(todo.id) === String(id));
  },

  create(todoData) {
    const todos = readTodos();

    const newTodo = {
      id: crypto.randomUUID(),
      title: todoData.title,
      description: todoData.description,
      status: todoData.status || 'todo',
      priority: todoData.priority || 'medium',
      theme: todoData.theme || 'other',
      dueDate: todoData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    todos.push(newTodo);
    writeTodos(todos);
    return newTodo;
  },

  update(id, updates) {
    const todos = readTodos();
    // Handle both string and number IDs by converting both to strings
    const index = todos.findIndex(todo => String(todo.id) === String(id));
    if (index === -1) return null;

    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeTodos(todos);
    return todos[index];
  },

  delete(id) {
    const todos = readTodos();
    // Handle both string and number IDs by converting both to strings
    const index = todos.findIndex(todo => String(todo.id) === String(id));
    if (index === -1) return false;

    todos.splice(index, 1);
    writeTodos(todos);
    return true;
  }
};
