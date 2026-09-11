const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/**
 * Generic fetch wrapper with credentials & JSON parsing
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Check if token is stored in localStorage as fallback
  const token = localStorage.getItem('token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // include httpOnly cookies
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'An unexpected error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  signup: ({ fullName, email, password, age }) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, age })
  }),

  sendOtp: (email) => apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  verifyOtp: (email, otp) => apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  }),

  getMe: () => apiRequest('/auth/me'),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  // Expenses
  getDayExpenses: (date) => apiRequest(`/expenses/day?date=${encodeURIComponent(date)}`),

  saveDayExpenses: (date, slots) => apiRequest('/expenses/day', {
    method: 'POST',
    body: JSON.stringify({ date, slots })
  }),

  deleteDayExpenses: (date) => apiRequest(`/expenses/day?date=${encodeURIComponent(date)}`, {
    method: 'DELETE'
  }),

  // Analytics
  getMonthSummary: (year, month) => apiRequest(`/analytics/month?year=${year}&month=${month}`),

  getYearSummary: (year) => apiRequest(`/analytics/year?year=${year}`),

  // Search & Suggestions
  searchExpenses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/expenses/search?${query}`);
  },

  getFoodSuggestions: () => apiRequest('/expenses/suggestions'),

  // Budget
  getMonthlyBudget: (year, month) => apiRequest(`/expenses/budget?year=${year}&month=${month}`),

  setMonthlyBudget: (year, month, amount, setAsDefault = false) => apiRequest('/expenses/budget', {
    method: 'POST',
    body: JSON.stringify({ year, month, amount, setAsDefault })
  })
};
