/**
 * CPCL Sovereign AI Procurement Platform - API Client Layer
 * Production-ready fetch wrapper with JWT Bearer authentication,
 * automatic header resolution, error normalization, and multipart uploads.
 */

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('cpcl_auth_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('cpcl_auth_token', token);
  } else {
    localStorage.removeItem('cpcl_auth_token');
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('cpcl_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('cpcl_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cpcl_auth_user');
  }
}

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not multipart FormData, ensure Content-Type is JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // Handle 401 Unauthorized (session expired)
  if (response.status === 401 && !endpoint.includes('/auth/')) {
    setAuthToken(null);
    setStoredUser(null);
    window.dispatchEvent(new Event('cpcl-auth-expired'));
  }

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.error) || (data && data.message) || `HTTP error ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    loginOfficer: (credentials) => request('/auth/officer/login', { method: 'POST', body: JSON.stringify(credentials) }),
    registerOfficer: (data) => request('/auth/officer/register', { method: 'POST', body: JSON.stringify(data) }),
    loginBidder: (credentials) => request('/auth/bidder/login', { method: 'POST', body: JSON.stringify(credentials) }),
    registerBidder: (data) => request('/auth/bidder/register', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => request('/auth/me')
  },

  // Tenders
  tenders: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/tenders${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/tenders/${id}`),
    create: (data) => request('/tenders', { method: 'POST', body: JSON.stringify(data) }),
    publish: (id) => request(`/tenders/${id}/publish`, { method: 'POST' })
  },

  // Bidders
  bidders: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/bidders${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/bidders/${id}`),
    compare: (companyIds) => request('/bidders/compare', { method: 'POST', body: JSON.stringify({ companyIds }) })
  },

  // Applications
  applications: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/applications${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/applications/${id}`),
    apply: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) })
  },

  // Documents
  documents: {
    upload: (formData) => request('/documents/upload', { method: 'POST', body: formData }),
    getById: (id) => request(`/documents/${id}`)
  },

  // Verification
  verification: {
    getQueue: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/verification/queue${query ? `?${query}` : ''}`);
    },
    getCase: (id) => request(`/verification/cases/${id}`),
    approve: (id, remarks) => request(`/verification/cases/${id}/approve`, { method: 'POST', body: JSON.stringify({ remarks }) }),
    reject: (id, reason, remarks) => request(`/verification/cases/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason, remarks }) }),
    escalate: (id, remarks) => request(`/verification/cases/${id}/escalate`, { method: 'POST', body: JSON.stringify({ remarks }) }),
    updateField: (id, data) => request(`/verification/cases/${id}/update-field`, { method: 'PUT', body: JSON.stringify(data) })
  },

  // Clarifications
  clarifications: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/clarifications${query ? `?${query}` : ''}`);
    },
    create: (data) => request('/clarifications', { method: 'POST', body: JSON.stringify(data) }),
    respond: (id, data) => request(`/clarifications/${id}/respond`, { method: 'POST', body: JSON.stringify(data) }),
    resolve: (id) => request(`/clarifications/${id}/resolve`, { method: 'POST' })
  },

  // Compliance
  compliance: {
    getChecks: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/compliance${query ? `?${query}` : ''}`);
    },
    evaluate: (applicationId) => request(`/compliance/evaluate/${applicationId}`, { method: 'POST' })
  },

  // Risk
  risk: {
    getOverview: () => request('/risk/overview'),
    getCaseRisk: (id) => request(`/risk/cases/${id}`),
    recalculate: (applicationId) => request(`/risk/recalculate/${applicationId}`, { method: 'POST' })
  },

  // AI Insights
  insights: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/insights${query ? `?${query}` : ''}`);
    },
    dismiss: (id) => request(`/insights/${id}/dismiss`, { method: 'POST' })
  },

  // Reports
  reports: {
    getAll: () => request('/reports'),
    generate: (data) => request('/reports/generate', { method: 'POST', body: JSON.stringify(data) })
  },

  // Audit
  audit: {
    getLogs: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/audit${query ? `?${query}` : ''}`);
    },
    verifyIntegrity: () => request('/audit/verify-integrity')
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' })
  },

  // Admin
  admin: {
    getPendingOfficers: () => request('/admin/officers/pending'),
    approveOfficer: (id) => request(`/admin/officers/${id}/approve`, { method: 'POST' }),
    rejectOfficer: (id, reason) => request(`/admin/officers/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
    getUsers: () => request('/admin/users')
  },

  // Dashboard
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getRecentActivity: () => request('/dashboard/recent-activity'),
    getChartData: () => request('/dashboard/chart-data'),
    getRiskSignals: () => request('/dashboard/risk-signals'),
    getComplianceDistribution: () => request('/dashboard/compliance-distribution'),
    getAiStatus: () => request('/dashboard/ai-status')
  },

  // System
  system: {
    getHealth: () => request('/system/health'),
    getIntegrations: () => request('/system/integrations'),
    testIntegration: (id) => request(`/system/integrations/${id}/test`, { method: 'POST' })
  },

  // AI Bid Intelligence Engine
  ai: {
    analyzeFile: (formData) => request('/ai/analyze-file', { method: 'POST', body: formData }),
    analyzeBid: (data) => request('/ai/analyze-bid', { method: 'POST', body: JSON.stringify(data) }),
    getBid: (applicationId) => request(`/ai/bids/${applicationId}`),
    submitOfficerDecision: (applicationId, data) => request(`/ai/bids/${applicationId}/officer-decision`, { method: 'POST', body: JSON.stringify(data) })
  }
};

export default api;
