import { VALID_STATUSES } from '../constants/statuses.js';

export default async function statusRoutes(fastify, options) {
  
  // GET /api/status - Get all valid statuses
  fastify.get('/', async (request, reply) => {
    return VALID_STATUSES;
  });
}
