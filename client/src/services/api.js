const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const withAuth = (token) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

export const subscriptionService = {
  // Get all subscriptions
  async getAll(accessToken) {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      headers: {
        ...withAuth(accessToken),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  },

  // Get subscription by ID
  async getById(id, accessToken) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      headers: {
        ...withAuth(accessToken),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch subscription');
    return response.json();
  },

  // Create new subscription
  async create(subscription, accessToken) {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...withAuth(accessToken),
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Failed to create subscription');
    return response.json();
  },

  // Update subscription
  async update(id, subscription, accessToken) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...withAuth(accessToken),
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Failed to update subscription');
    return response.json();
  },

  // Delete subscription
  async delete(id, accessToken) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'DELETE',
      headers: {
        ...withAuth(accessToken),
      },
    });
    if (!response.ok) throw new Error('Failed to delete subscription');
    return response.json();
  },

  // Get dashboard statistics
  async getStats(accessToken) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/stats`, {
      headers: {
        ...withAuth(accessToken),
      },
    });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },
};
