const API_BASE = 'http://localhost:3001/api';

async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
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
    getAll: (params) => fetchApi(`/todos${buildQuery(params)}`),

    getStatuses: () => fetchApi('/tasks/status'),

    getById: (id) => fetchApi(`/todos/${id}`),

    create: (title) => fetchApi('/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

    update: (id, updates) => fetchApi(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

    delete: (id) => fetchApi(`/todos/${id}`, {
      method: 'DELETE',
    }),
  },
};
