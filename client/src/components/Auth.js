import React, { useState } from 'react';
import './Auth.css';
import { supabaseClient } from '../services/supabase';

const Auth = () => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signin') {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Check your email for confirmation (if required).');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-toggle">
        <button
          className={mode === 'signin' ? 'active' : ''}
          onClick={() => {
            setMode('signin');
            setError('');
            setMessage('');
          }}
        >
          Login
        </button>
        <button
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => {
            setMode('signup');
            setError('');
            setMessage('');
          }}
        >
          Sign Up
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </label>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        <button type="submit" className="btn btn-primary full-width" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Login' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
