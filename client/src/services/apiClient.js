/**
 * Centralized API Client for SAHAYAK
 */

const API_BASE = '/api';

export const apiClient = {
  // Orchestrate citizen turn
  async orchestrate({ message, conversationState, language }) {
    const res = await fetch(`${API_BASE}/ai/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationState, language })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to process assistant request');
    }
    return await res.json();
  },

  // Confirm pending grievance and get ticket ID
  async confirmGrievance(pendingGrievance) {
    const res = await fetch(`${API_BASE}/ai/confirm-grievance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pendingGrievance })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit grievance');
    }
    return await res.json();
  },

  // Track ticket by ID
  async trackTicket(ticketId) {
    const res = await fetch(`${API_BASE}/grievances/track/${encodeURIComponent(ticketId)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ticket not found');
    }
    return await res.json();
  },

  // Officer Login
  async officerLogin(credentials) {
    const res = await fetch(`${API_BASE}/officer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return await res.json();
  },

  // Officer Fetch Grievances
  async getOfficerGrievances(token) {
    const res = await fetch(`${API_BASE}/officer/grievances`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to load officer dashboard data');
    }
    return await res.json();
  },

  // Officer Update Status
  async updateGrievanceStatus(ticketId, payload, token) {
    const res = await fetch(`${API_BASE}/officer/grievances/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update ticket status');
    }
    return await res.json();
  }
};
