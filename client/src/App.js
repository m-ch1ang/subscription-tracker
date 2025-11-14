import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import { subscriptionService } from './services/api';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionsData, statsData] = await Promise.all([
        subscriptionService.getAll(),
        subscriptionService.getStats(),
      ]);
      setSubscriptions(subscriptionsData);
      setStats(statsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscription = async (subscriptionData) => {
    try {
      await subscriptionService.create(subscriptionData);
      await fetchData(); // Refresh data
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to add subscription. Please try again.');
      console.error('Error adding subscription:', err);
    }
  };

  const handleEditSubscription = async (subscriptionData) => {
    try {
      await subscriptionService.update(editingSubscription.id, subscriptionData);
      await fetchData(); // Refresh data
      setEditingSubscription(null);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to update subscription. Please try again.');
      console.error('Error updating subscription:', err);
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await subscriptionService.delete(id);
        await fetchData(); // Refresh data
      } catch (err) {
        setError('Failed to delete subscription. Please try again.');
        console.error('Error deleting subscription:', err);
      }
    }
  };

  const openAddForm = () => {
    setEditingSubscription(null);
    setIsFormOpen(true);
  };

  const openEditForm = (subscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💳 Subscription Tracker</h1>
        <button className="btn btn-primary" onClick={openAddForm}>
          + Add Subscription
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <main className="app-main">
        <Dashboard stats={stats} subscriptions={subscriptions} />
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={openEditForm}
          onDelete={handleDeleteSubscription}
        />
      </main>

      {isFormOpen && (
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={editingSubscription ? handleEditSubscription : handleAddSubscription}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

export default App;
