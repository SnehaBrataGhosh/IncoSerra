const base = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  getUser: () => request('/api/user'),
  setPlan: (plan) => request('/api/user/plan', { method: 'PATCH', body: JSON.stringify({ plan }) }),
  deposit: (amount) => request('/api/deposit', { method: 'POST', body: JSON.stringify({ amount }) }),
  process: (body) => request('/api/process', { method: 'POST', body: JSON.stringify(body) }),
  getClaim: (id) => request(`/api/claim/${id}`),
};
