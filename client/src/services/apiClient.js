/**
 * Centralized API Client for SAHAYAK with robust dual-origin resolution
 */

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('5173')) {
      return '/api';
    }
  }
  return '/api';
};

const API_BASE = getApiBase();

async function safeFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}: Failed request`);
    }
    return await res.json();
  } catch (primaryErr) {
    // IPv4 fallback check for Windows Vite dev server
    if (typeof window !== 'undefined' && window.location.port === '5173') {
      try {
        const fallbackRes = await fetch(`http://127.0.0.1:5000/api${endpoint}`, options);
        if (!fallbackRes.ok) {
          const err = await fallbackRes.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${fallbackRes.status}: Failed request`);
        }
        return await fallbackRes.json();
      } catch (fallbackErr) {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
}

export const apiClient = {
  // Orchestrate citizen turn
  async orchestrate({ message, conversationState, language }) {
    return await safeFetch('/ai/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationState, language })
    });
  },

  // Confirm pending grievance
  async confirmGrievance(pendingGrievance) {
    return await safeFetch('/ai/confirm-grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingGrievance })
    });
  },

  // Confirm scheme application
  async confirmApplication(pendingApplication) {
    return await safeFetch('/ai/confirm-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingApplication })
    });
  },

  // Track grievance ticket
  async trackTicket(ticketId) {
    return await safeFetch(`/grievances/track/${encodeURIComponent(ticketId)}`);
  },

  // Track scheme application
  async trackApplication(appId) {
    return await safeFetch(`/applications/track/${encodeURIComponent(appId)}`);
  },

  // Officer Login
  async officerLogin(credentials) {
    return await safeFetch('/officer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  // Officer Fetch Grievances
  async getOfficerGrievances(token) {
    return await safeFetch('/officer/grievances', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // Officer Update Status
  async updateGrievanceStatus(ticketId, payload, token) {
    return await safeFetch(`/officer/grievances/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }
};
