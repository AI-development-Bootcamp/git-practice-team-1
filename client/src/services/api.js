const API_BASE = 'http://localhost:3001/api';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const serverMessage =
      (body && typeof body === 'object' && typeof body.error === 'string' && body.error) ||
      response.statusText ||
      'Request failed';

    const err = new Error(`${response.status} ${serverMessage} (${method} ${url})`);
    err.status = response.status;
    err.url = url;
    err.method = method;
    err.body = body;
    throw err;
  }

  return response.json();
}

function unwrapData(result) {
  // Some endpoints return plain arrays; some return { success, data }.
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object' && Array.isArray(result.data)) return result.data;
  return [];
}

function buildQuery(params) {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null || v === '') return;
        searchParams.append(key, String(v));
      });
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const api = {
  todos: {
    getAll: async (params) => {
      const result = await fetchApi(`/tasks/search${buildQuery(params)}`);
      return unwrapData(result);
    },

    getStatuses: async () => {
      const result = await fetchApi('/tasks/status');
      // Expected: array, but tolerate { success, data } too.
      return Array.isArray(result) ? result : (result && Array.isArray(result.data) ? result.data : []);
    },

    getById: (id) => fetchApi(`/tasks/${id}`),

    create: (title) => fetchApi('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

    update: (id, updates) => fetchApi(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

    delete: (id) => fetchApi(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  },
};
