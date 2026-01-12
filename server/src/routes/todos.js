import { todoService } from '../services/todoService.js';
import { CreateTodoSchema, UpdateTodoSchema, FilterTodosSchema } from '../../../shared/types/todo.dto.js';
import { validateData } from '../../../shared/types/validation.js';

export default async function todosRoutes(fastify, options) {

  // GET /api/todos - Get all todos with optional filters
  fastify.get('/', async (request, reply) => {
    const validation = validateData(FilterTodosSchema, request.query);

    if (!validation.success) {
      return reply.status(400).send({ error: validation.errors[0].message });
    }

    const todos = todoService.getAll(validation.data);
    return todos;
  });

  // GET /api/todos/:id - Get single todo
  fastify.get('/:id', async (request, reply) => {
    const todo = todoService.getById(request.params.id);
    if (!todo) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return todo;
  });

  // POST /api/todos - Create new todo
  fastify.post('/', async (request, reply) => {
    const validation = validateData(CreateTodoSchema, request.body);

    if (!validation.success) {
      return reply.status(400).send({ error: validation.errors[0].message });
    }

    const todo = todoService.create(validation.data);
    return reply.status(201).send(todo);
  });

  // PUT /api/todos/:id - Update todo
  fastify.put('/:id', async (request, reply) => {
    const validation = validateData(UpdateTodoSchema, {
      id: request.params.id,  // Keep as string
      ...request.body
    });

    if (!validation.success) {
      return reply.status(400).send({ error: validation.errors[0].message });
    }

    const todo = todoService.update(request.params.id, request.body);
    if (!todo) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return todo;
  });

  // DELETE /api/todos/:id - Delete todo
  fastify.delete('/:id', async (request, reply) => {
    const deleted = todoService.delete(request.params.id);
    if (!deleted) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    return { success: true };
  });
}
