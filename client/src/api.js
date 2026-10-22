// small fetch wrapper: adds the JWT token and turns errors into exceptions
const BASE = '/api';

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem('token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // expired session on an admin call: go back to login
    if (res.status === 401 && token && !path.startsWith('/auth')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.errors = data.errors;
    throw err;
  }
  return data;
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, json('POST', body)),
  postForm: (p, fd) => request(p, { method: 'POST', body: fd }),
  putForm: (p, fd) => request(p, { method: 'PUT', body: fd }),
  del: (p) => request(p, { method: 'DELETE' }),
};
