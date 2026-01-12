import { todoService } from '../services/todoService.js';
import { VALID_STATUSES } from '../constants/statuses.js';

export default async function todosRoutes(fastify, options) {

  // GET /api/tasks/status - Get all valid statuses
  fastify.get('/status', async (request, reply) => {
    return VALID_STATUSES;
  });

  // GET /api/tasks - Get all tasks
  fastify.get('/', async (request, reply) => {
    return todoService.getAll();
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
    const { title } = request.body;
    if (!title || !title.trim()) {
      return reply.status(400).send({ error: 'Title is required' });
    }
    const todo = todoService.create({ title: title.trim() });
    return reply.status(201).send(todo);
  });

  // PUT /api/tasks/:id - Update task
  fastify.put('/:id', async (request, reply) => {
    const todo = todoService.update(request.params.id, request.body);
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
