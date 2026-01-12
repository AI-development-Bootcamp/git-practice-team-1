import { todoService } from '../services/todoService.js';
import { VALID_STATUSES } from '../constants/statuses.js';
import { CreateTodoSchema, UpdateTodoSchema, FilterTodosSchema } from '../../../shared/types/todo.dto.js';
import { validateData } from '../../../shared/types/validation.js';

export default async function todosRoutes(fastify, options) {

  // GET /api/tasks/status - Get all valid statuses
  fastify.get('/status', async (request, reply) => {
    return VALID_STATUSES;
  });

  // GET /api/tasks - Get all tasks with optional filters
  fastify.get('/', async (request, reply) => {
    // If no query params, return all todos without validation
    if (!request.query || Object.keys(request.query).length === 0) {
      const todos = todoService.getAll({});
      return todos;
    }

    // Validate query params if provided
    const validation = validateData(FilterTodosSchema, request.query);

    if (!validation.success) {
      return reply.status(400).send({ error: validation.errors[0].message });
    }

    // Use validated data for filtering
    const todos = todoService.getAll(validation.data || {});
    return todos;
  });

  // GET /api/tasks/:id - Get single task
  fastify.get('/:id', async (request, reply) => {
    const todo = todoService.getById(request.params.id);
    if (!todo) {
      return reply.status(404).send({ error: 'Task not found' });
    }
    return todo;
  });

  // POST /api/tasks - Create new task
  fastify.post('/', async (request, reply) => {
    const validation = validateData(CreateTodoSchema, request.body);

    if (!validation.success) {
      return reply.status(400).send({ error: validation.errors[0].message });
    }

    const todo = todoService.create(validation.data);
    return reply.status(201).send(todo);
  });

  // PUT /api/tasks/:id - Update task
  fastify.put('/:id', async (request, reply) => {
    // Don't include id in validation - it comes from params
    // Create a schema without id requirement for update body
    const updateBodySchema = UpdateTodoSchema.omit({ id: true });
    const validation = validateData(updateBodySchema, request.body);

    if (!validation.success) {
      return reply.status(400).send({ error: validation.errors[0].message });
    }

    const todo = todoService.update(request.params.id, validation.data);
    if (!todo) {
      return reply.status(404).send({ error: 'Task not found' });
    }
    return todo;
  });

  // DELETE /api/tasks/:id - Delete task
  fastify.delete('/:id', async (request, reply) => {
    const deleted = todoService.delete(request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Task not found' });
    }
    return { success: true };
  });
}
