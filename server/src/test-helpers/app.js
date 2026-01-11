import Fastify from 'fastify';
import cors from '@fastify/cors';
import todosRoutes from '../routes/todos.js';

/**
 * Creates a Fastify app instance for testing without starting the server
 */
export async function createTestApp() {
  const fastify = Fastify({ logger: false }); // Disable logging in tests

  await fastify.register(cors, {
    origin: 'http://localhost:5173'
  });

  await fastify.register(todosRoutes, { prefix: '/api/todos' });

  return fastify;
}
