// API service for interacting with the backend
const API_BASE_URL = 'http://localhost:3000/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  cartId?: string;
}

// Generic API fetch helper
async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Products API
export const productsAPI = {
  getAll: (): Promise<Product[]> => apiFetch('/products'),

  getById: (id: string): Promise<Product> => apiFetch(`/products/${id}`),

  getByCategory: (category: string): Promise<Product[]> => apiFetch(`/products/category/${category}`),

  search: (query: string): Promise<Product[]> => apiFetch(`/products/search/${encodeURIComponent(query)}`),
};

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    }).then(res => res.json()),

  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()),
};

// Cart API
export const cartAPI = {
  getCart: (): Promise<CartItem[]> => apiFetch('/cart'),

  addToCart: (productId: string, quantity: number = 1): Promise<CartItem[]> =>
    apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  updateQuantity: (cartId: string, quantity: number): Promise<CartItem[]> =>
    apiFetch(`/cart/${cartId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (cartId: string): Promise<CartItem[]> =>
    apiFetch(`/cart/${cartId}`, {
      method: 'DELETE',
    }),

  clearCart: (): Promise<CartItem[]> =>
    apiFetch('/cart', {
      method: 'DELETE',
    }),

  checkout: (): Promise<{ message: string; orderSummary: any[]; total: number }> =>
    apiFetch('/cart/checkout', {
      method: 'POST',
    }),
};

// Health check
export const healthAPI = {
  check: () => apiFetch('/health'),
};