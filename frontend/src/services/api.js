const BASE = '/api';

async function request(endpoint, options = {}, retries = 3) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    // Auto-fix session errors
    if (res.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please sign in again.');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;

  } catch (err) {
    // Auto-retry on network failures
    if (retries > 0 && err.message.includes('fetch')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return request(endpoint, options, retries - 1);
    }
    throw err;
  }
}

export const api = {
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body }),
    login: (body) => request('/auth/login', { method: 'POST', body }),
    googleLogin: (tokenId) => request('/auth/google-login', { method: 'POST', body: { tokenId } }),
    profile: () => request('/auth/profile')
  },
  pizzas: {
    getAll: (params = '') => request(`/pizzas${params ? '?' + params : ''}`),
    getById: (id) => request(`/pizzas/${id}`),
    create: (body) => request('/pizzas', { method: 'POST', body }),
    update: (id, body) => request(`/pizzas/${id}`, { method: 'PUT', body }),
    delete: (id) => request(`/pizzas/${id}`, { method: 'DELETE' }),
    addReview: (id, body) => request(`/pizzas/${id}/reviews`, { method: 'POST', body })
  },
  cart: {
    get: () => request('/cart'),
    add: (body) => request('/cart/add', { method: 'POST', body }),
    update: (body) => request('/cart/update', { method: 'PUT', body }),
    remove: (itemId) => request(`/cart/remove/${itemId}`, { method: 'DELETE' }),
    clear: () => request('/cart/clear', { method: 'DELETE' }),
    applyCoupon: (code) => request('/cart/coupon', { method: 'POST', body: { code } })
  },
  orders: {
    create: (body) => request('/orders', { method: 'POST', body }),
    getUserOrders: () => request('/orders/user'),
    getAdminOrders: (params = '') => request(`/orders/admin${params ? '?' + params : ''}`),
    updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: { status } }),
    getStats: () => request('/orders/admin/stats')
  }
};
