const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('mylocal_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'An unexpected error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Status
  getStatus: () => request('/status'),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return request(`/services${qs ? `?${qs}` : ''}`);
  },
  getServiceById: (id) => request(`/services/${id}`),
  getLocalities: () => request('/services/localities'),
  getServiceStats: () => request('/services/stats'),
  createService: (data) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories'),
  getCategoryById: (id) => request(`/categories/${id}`),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Surveys
  submitSurvey: (data) => request('/surveys', { method: 'POST', body: JSON.stringify(data) }),
  getSurveys: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/surveys${query ? `?${query}` : ''}`);
  },
  getSurveyStats: () => request('/surveys/stats'),
  deleteSurvey: (id) => request(`/surveys/${id}`, { method: 'DELETE' }),

  // Feedback
  getPublicFeedback: () => request('/feedback/public'),
  getAllFeedback: () => request('/feedback'),
  submitFeedback: (data) => request('/feedback', { method: 'POST', body: JSON.stringify(data) }),
  updateFeedbackStatus: (id, approved) => request(`/feedback/${id}`, { method: 'PUT', body: JSON.stringify({ approved }) }),
  deleteFeedback: (id) => request(`/feedback/${id}`, { method: 'DELETE' }),

  // Content
  getContent: () => request('/content'),
  updateContent: (data) => request('/content', { method: 'PUT', body: JSON.stringify(data) }),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) })
};
