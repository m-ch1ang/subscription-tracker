const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const subscriptionService = {
  // Get all subscriptions
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/subscriptions`);
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  },

  // Get subscription by ID
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch subscription');
    return response.json();
  },

  // Create new subscription
  async create(subscription) {
    const response = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Failed to create subscription');
    return response.json();
  },

  // Update subscription
  async update(id, subscription) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    if (!response.ok) throw new Error('Failed to update subscription');
    return response.json();
  },

  // Delete subscription
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete subscription');
    return response.json();
  },

  // Get dashboard statistics
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/subscriptions/stats`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },
};
