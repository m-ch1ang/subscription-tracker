import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import Auth from './components/Auth';
import { subscriptionService } from './services/api';
import { supabaseClient } from './services/supabase';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnceRef = useRef(false);
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
      }

      const currentSession = data?.session || null;
      setSession(currentSession);
      setAuthReady(true);

      if (currentSession) {
        await fetchData(currentSession.access_token);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          await fetchData(newSession.access_token);
        } else {
          setSubscriptions([]);
          setStats({});
          setIsFormOpen(false);
          hasLoadedOnceRef.current = false;
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchData = async (accessToken = session?.access_token) => {
    if (!accessToken) {
      setLoading(false);
      hasLoadedOnceRef.current = true;
      return;
    }

    const shouldShowLoading = !hasLoadedOnceRef.current;
    if (shouldShowLoading) {
      setLoading(true);
    }

    try {
      const [subscriptionsData, statsData] = await Promise.all([
        subscriptionService.getAll(accessToken),
        subscriptionService.getStats(accessToken),
      ]);
      setSubscriptions(subscriptionsData);
      setStats(statsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      hasLoadedOnceRef.current = true;
      if (shouldShowLoading) {
        setLoading(false);
      }
    }
  };

  const handleAddSubscription = async (subscriptionData) => {
    try {
      await subscriptionService.create(subscriptionData, session?.access_token);
      await fetchData(); // Refresh data
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to add subscription. Please try again.');
      console.error('Error adding subscription:', err);
    }
  };

  const handleEditSubscription = async (subscriptionData) => {
    try {
      await subscriptionService.update(
        editingSubscription.id,
        subscriptionData,
        session?.access_token
      );
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
        await subscriptionService.delete(id, session?.access_token);
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

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    setSession(null);
    setSubscriptions([]);
    setStats({});
    setIsFormOpen(false);
    hasLoadedOnceRef.current = false;
    setLoading(false);
  };

  if (!authReady || loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>💳 Subscription Tracker</h1>
        </header>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        <main className="app-main auth-main">
          <Auth />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💳 Subscription Tracker</h1>
        <div className="auth-info">
          <span className="auth-user">{session.user?.email}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
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
