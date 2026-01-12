import { z } from 'zod';

/**
 * Todo Status Enum
 * Represents the three possible states of a todo item
 */
export const TodoStatusEnum = z.enum(['todo', 'in-progress', 'done']);

/**
 * Todo Priority Enum
 * Represents the priority level of a todo item
 */
export const TodoPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

/**
 * Todo Theme/Category Enum
 * Represents different themes or categories for organizing todos
 */
export const TodoThemeEnum = z.enum([
  'work',
  'personal',
  'shopping',
  'health',
  'study',
  'other'
]);

/**
 * Base Todo Schema
 * Core fields that every todo must have
 */
export const BaseTodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: TodoStatusEnum.default('todo'),
  priority: TodoPriorityEnum.default('medium'),
  theme: TodoThemeEnum.default('other'),
  dueDate: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Create Todo DTO Schema
 * Used when creating a new todo (without id, timestamps)
 */
export const CreateTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: TodoStatusEnum.optional().default('todo'),
  priority: TodoPriorityEnum.optional().default('medium'),
  theme: TodoThemeEnum.optional().default('other'),
  dueDate: z.string().datetime().nullable().optional(),
});

/**
 * Update Todo DTO Schema
 * Used when updating an existing todo (all fields optional except id)
 */
export const UpdateTodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: TodoStatusEnum.optional(),
  priority: TodoPriorityEnum.optional(),
  theme: TodoThemeEnum.optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

/**
 * Toggle Todo Status DTO Schema
 * Used when toggling todo status between todo/in-progress/done
 */
export const ToggleTodoStatusSchema = z.object({
  id: z.string().uuid(),
  status: TodoStatusEnum,
});

/**
 * Delete Todo DTO Schema
 * Used when deleting a todo
 */
export const DeleteTodoSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Filter Todos DTO Schema
 * Used for filtering and searching todos
 */
export const FilterTodosSchema = z.object({
  status: TodoStatusEnum.optional(),
  priority: TodoPriorityEnum.optional(),
  theme: TodoThemeEnum.optional(),
  search: z.string().optional(),
  dueDateFrom: z.string().datetime().optional(),
  dueDateTo: z.string().datetime().optional(),
});

/**
 * Sort Todos DTO Schema
 * Used for sorting todos
 */
export const SortTodosSchema = z.object({
  field: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']),
  order: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Todo List Response Schema
 * Used for API responses that return a list of todos
 */
export const TodoListResponseSchema = z.object({
  todos: z.array(BaseTodoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

/**
 * Board Column Schema
 * Represents a Kanban board column with todos
 */
export const BoardColumnSchema = z.object({
  status: TodoStatusEnum,
  title: z.string(),
  todos: z.array(BaseTodoSchema),
  count: z.number().int().nonnegative(),
});

/**
 * Kanban Board Schema
 * Represents the complete Kanban board with all columns
 */
export const KanbanBoardSchema = z.object({
  columns: z.array(BoardColumnSchema),
  totalTodos: z.number().int().nonnegative(),
});

/**
 * Drag and Drop DTO Schema
 * Used when moving todos between columns (statuses) via drag and drop
 */
export const DragDropTodoSchema = z.object({
  todoId: z.string().uuid(),
  fromStatus: TodoStatusEnum,
  toStatus: TodoStatusEnum,
  newIndex: z.number().int().nonnegative(),
});

// Export TypeScript types inferred from schemas
export const TodoType = BaseTodoSchema;
export const CreateTodoType = CreateTodoSchema;
export const UpdateTodoType = UpdateTodoSchema;
