import { todoService } from '../services/todoService.js';

export default async function todosRoutes(fastify, options) {

  // GET /api/tasks/search - Query tasks with filters
  // Supports: id, title, status, createdAfter, createdBefore, updatedAfter, updatedBefore
  fastify.get('/search', async (request, reply) => {
    const result = todoService.query(request.query);
    return result;
  });

  // GET /api/tasks - Get all todos
  fastify.get('/', async (request, reply) => {
    return todoService.getAll();
  });

  // GET /api/tasks/:id - Get single todo
  fastify.get('/:id', async (request, reply) => {
    const todo = todoService.getById(request.params.id);
    if (!todo) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return todo;
  });

  // POST /api/tasks - Create new todo
  fastify.post('/', async (request, reply) => {
    const { title } = request.body;
    if (!title || !title.trim()) {
      return reply.status(400).send({ error: 'Title is required' });
    }
    const todo = todoService.create({ title: title.trim() });
    return reply.status(201).send(todo);
  });

  // PUT /api/tasks/:id - Update todo
  fastify.put('/:id', async (request, reply) => {
    const todo = todoService.update(request.params.id, request.body);
    if (!todo) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return todo;
  });

  // DELETE /api/tasks/:id - Delete todo
  fastify.delete('/:id', async (request, reply) => {
    const deleted = todoService.delete(request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return { success: true };
  });
}
