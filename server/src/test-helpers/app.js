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

/**
 * Helper function to inject a request and parse the JSON response
 * Reduces boilerplate code in tests by combining inject + JSON.parse
 *
 * @param {Fastify} app - Fastify app instance
 * @param {object} options - Request options for app.inject()
 * @returns {Promise<{statusCode: number, payload: any, headers: object}>}
 */
export async function injectAndParse(app, options) {
  const response = await app.inject(options);
  return {
    statusCode: response.statusCode,
    payload: response.payload ? JSON.parse(response.payload) : null,
    headers: response.headers
  };
}
