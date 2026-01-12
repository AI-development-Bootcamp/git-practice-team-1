import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TODOS_PATH = path.join(__dirname, '../data/todos.json');
const BACKUP_PATH = path.join(__dirname, '../data/todos.backup.json');

/**
 * Sample test todos for use in tests
 * Using fixed UUIDs for predictable testing
 */
export const sampleTodos = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Test Todo 1",
    description: "First test todo",
    status: "todo",
    priority: "high",
    theme: "work",
    createdAt: "2024-01-01T10:00:00.000Z",
    updatedAt: "2024-01-01T10:00:00.000Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Test Todo 2",
    description: "Second test todo",
    status: "in-progress",
    priority: "medium",
    theme: "personal",
    createdAt: "2024-01-02T10:00:00.000Z",
    updatedAt: "2024-01-02T10:00:00.000Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Test Todo 3",
    status: "done",
    priority: "low",
    theme: "study",
    createdAt: "2024-01-03T10:00:00.000Z",
    updatedAt: "2024-01-03T10:00:00.000Z"
  }
];

/**
 * Backs up the current todos.json file
 */
export function backupTodos() {
  if (fs.existsSync(TODOS_PATH)) {
    fs.copyFileSync(TODOS_PATH, BACKUP_PATH);
  }
}

/**
 * Restores the backed up todos.json file
 */
export function restoreTodos() {
  try {
    if (fs.existsSync(BACKUP_PATH)) {
      fs.copyFileSync(BACKUP_PATH, TODOS_PATH);
      fs.unlinkSync(BACKUP_PATH);
    }
  } catch (error) {
    console.error('Warning: Failed to restore todos during cleanup:', error);
    // In CI environment, fail loudly to catch issues early
    if (process.env.CI) {
      throw error;
    }
  }
}

/**
 * Sets the todos.json to specific test data
 */
export function setTestTodos(todos = sampleTodos) {
  if (!Array.isArray(todos)) {
    throw new Error('setTestTodos expects an array of todos');
  }
  try {
    fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, 2));
  } catch (error) {
    throw new Error(`Failed to write test data: ${error.message}`);
  }
}

/**
 * Reads the current todos from todos.json
 */
export function readTodos() {
  try {
    const data = fs.readFileSync(TODOS_PATH, 'utf-8');
    const todos = JSON.parse(data);

    if (!Array.isArray(todos)) {
      throw new Error('Todos data is not an array');
    }

    return todos;
  } catch (error) {
    throw new Error(`Failed to read todos: ${error.message}`);
  }
}

/**
 * Setup function to run before each test
 */
export function setupTestData() {
  backupTodos();
  setTestTodos();
}

/**
 * Cleanup function to run after each test
 */
export function cleanupTestData() {
  restoreTodos();
}
