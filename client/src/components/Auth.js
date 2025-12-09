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
  const resetRedirectUrl =
    process.env.REACT_APP_SUPABASE_RESET_REDIRECT_URL || window.location.origin;

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (mode !== 'forgot' && !password) {
      setError('Password is required');
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
      } else if (mode === 'signup') {
        const { error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Check your email to confirm your account.');
      } else {
        const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(
          email,
          { redirectTo: resetRedirectUrl }
        );
        if (resetError) throw resetError;
        setMessage('Reset link sent. Check your email for instructions.');
        setMode('signin');
        setPassword('');
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
          onClick={() => switchMode('signin')}
        >
          Login
        </button>
        <button
          className={mode === 'signup' ? 'active' : ''}
          onClick={() => switchMode('signup')}
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

        {mode !== 'forgot' && (
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
            {mode === 'signin' && (
              <button
                type="button"
                className="auth-link"
                onClick={() => switchMode('forgot')}
              >
                Forgot password?
              </button>
            )}
          </label>
        )}

        {mode === 'forgot' && (
          <div className="auth-helper">
            Enter your account email and we'll send a reset link.
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        <button type="submit" className="btn btn-primary full-width" disabled={loading}>
          {loading
            ? 'Please wait...'
            : mode === 'signin'
            ? 'Login'
            : mode === 'signup'
            ? 'Create Account'
            : 'Send Reset Link'}
        </button>

        {mode === 'forgot' && (
          <button
            type="button"
            className="auth-link center"
            onClick={() => switchMode('signin')}
          >
            Back to login
          </button>
        )}
      </form>
    </div>
  );
};

export default Auth;
