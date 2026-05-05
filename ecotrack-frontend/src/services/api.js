import axios from 'axios';

// ─── Axios Base Instance ───────────────────────────────────────────────────────
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach JWT when available ───────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecotrack_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 + emit global error events ─────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecotrack_token');
      localStorage.removeItem('ecotrack_user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    // Emit a custom DOM event so ToastProvider can display API errors globally.
    // Components can suppress this by catching the error themselves first.
    const status  = error.response?.status;
    const data    = error.response?.data;
    const message = typeof data === 'object' && data !== null
      ? (data.error || Object.values(data).join(', '))
      : (typeof data === 'string' ? data : null);

    // Only auto-toast 5xx server errors; 4xx are handled by individual components
    if (status >= 500) {
      window.dispatchEvent(new CustomEvent('eco:apierror', {
        detail: { message: message || 'Server error. Please try again.' },
      }));
    }

    return Promise.reject(error);
  }
);

// ─── Auth (Phase 1) ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
};

// ─── Waste (Phase 2) ──────────────────────────────────────────────────────────
export const wasteAPI = {
  submit:         (data) => API.post('/waste/submit', data),
  getSubmissions: ()     => API.get('/waste/my-submissions'),
};

// ─── Wallet (Phase 2) ─────────────────────────────────────────────────────────
export const walletAPI = {
  getWallet: () => API.get('/wallet'),
};

// ─── Transactions (Phase 2) ───────────────────────────────────────────────────
export const transactionAPI = {
  getTransactions: () => API.get('/transactions'),
};

// ─── User Dashboard (Phase 2) ─────────────────────────────────────────────────
export const dashboardAPI = {
  getDashboard: () => API.get('/dashboard'),
};

// ─── Pickup (Phase 3) ─────────────────────────────────────────────────────────
export const pickupAPI = {
  createPickup:       (data)       => API.post('/pickup/request', data),
  getUserPickups:     ()           => API.get('/pickup/user'),
  getAllPickups:       (page, size) => API.get(`/admin/pickups?page=${page}&size=${size}`),
  updatePickupStatus: (id, status) => API.put(`/admin/pickup/${id}/status`, { status }),
};

// ─── Company (Phase 4) ────────────────────────────────────────────────────────
export const companyAPI = {
  getProfile:     ()     => API.get('/company/profile'),
  updateProfile:  (data) => API.put('/company/profile', data),
  schedulePickup: (data) => API.post('/company/pickup', data),
  getPickups:     ()     => API.get('/company/pickups'),
};

// ─── Admin Dashboard (Phase 4) ────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
};

// ─── Recyclers (Phase 4) ──────────────────────────────────────────────────────
export const recyclerAPI = {
  create: (data) => API.post('/admin/recyclers', data),
  getAll: ()     => API.get('/admin/recyclers'),
};

// ─── Waste Batches (Phase 4) ──────────────────────────────────────────────────
export const batchAPI = {
  create:         (data)             => API.post('/admin/batches', data),
  getAll:         ()                 => API.get('/admin/batches'),
  assignRecycler: (id, recyclerId)   => API.put(`/admin/batches/${id}/assign`, { recyclerId }),
  markProcessed:  (id)               => API.put(`/admin/batches/${id}/process`),
};

// ─── Public Content — no auth required (Phase 5) ─────────────────────────────
export const publicAPI = {
  // Blogs
  getBlogs:       (page = 0, size = 9, category = '') =>
    API.get(`/public/blogs?page=${page}&size=${size}${category ? `&category=${category}` : ''}`),
  getBlogBySlug:  (slug) => API.get(`/public/blog/${slug}`),
  // Campaigns
  getCampaigns:   ()     => API.get('/public/campaigns'),
  // Events (public list — JWT optional, used for "joined" state if logged in)
  getEvents:      ()     => API.get('/public/events'),
};

// ─── Event Participation — auth required (Phase 5) ────────────────────────────
export const eventAPI = {
  joinEvent:    (eventId) => API.post(`/event/join/${eventId}`),
  getUserEvents: ()       => API.get('/user/events'),
};

// ─── Admin Content Management (Phase 5) ──────────────────────────────────────
export const blogAdminAPI = {
  create: (data) => API.post('/admin/blog', data),
  update: (id, data) => API.put(`/admin/blog/${id}`, data),
  delete: (id)   => API.delete(`/admin/blog/${id}`),
};

export const campaignAdminAPI = {
  create: (data) => API.post('/admin/campaign', data),
  delete: (id)   => API.delete(`/admin/campaign/${id}`),
};

export const eventAdminAPI = {
  create: (data) => API.post('/admin/event', data),
  delete: (id)   => API.delete(`/admin/event/${id}`),
};

export default API;
