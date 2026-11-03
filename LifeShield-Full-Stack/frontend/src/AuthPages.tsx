import React, { useState } from 'react';
import './auth-pages.css';

type User = { name: string; email: string };
const API = 'http://localhost:8080/api';

export function AuthPages({ onAuthenticated }: { onAuthenticated: (u: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const lastEmail = localStorage.getItem('lifeshield_active_email');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch(`${API}/auth/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'register' ? { name, email, password } : { email, password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Unable to continue. Check your details and try again.');
      }
      localStorage.setItem('lifeshield_active_email', data.email);
      onAuthenticated(data as User);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect to backend. Make sure Spring Boot is running.');
    } finally {
      setBusy(false);
    }
  }

  async function handleQuickDemoLogin() {
    setError('');
    setBusy(true);
    const demoEmail = 'test@example.com';
    const demoPassword = 'password123';
    try {
      let res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword })
      });
      if (!res.ok) {
        // Try registering if account does not exist
        res = await fetch(`${API}/auth/register`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Alex Johnson', email: demoEmail, password: demoPassword })
        });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Unable to log in with demo account.');
      localStorage.setItem('lifeshield_active_email', data.email);
      onAuthenticated(data as User);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend offline. You can click "Continue in Guest Mode" below.');
    } finally {
      setBusy(false);
    }
  }

  function handleGuestMode() {
    const guestUser: User = { name: 'Alex Johnson', email: 'guest@lifeshield.local' };
    localStorage.setItem('lifeshield_active_email', guestUser.email);
    onAuthenticated(guestUser);
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">✚</div>
        <p className="auth-eyebrow">LIFESHIELD HEALTH</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to access your personalized wellness dashboard & emergency ID.'
            : 'Register to keep your health metrics privately secured to your account.'}
        </p>

        {lastEmail && (
          <div className="auth-status-pill">
            <span>Last active account: <strong>{lastEmail}</strong></span>
          </div>
        )}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label>
              Full name
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="e.g. Alex Johnson"
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={mode === 'register' ? 8 : 1}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button id="btn-auth-submit" className="auth-submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>

        <div className="auth-divider">Or Quick Access</div>

        <button
          id="btn-quick-demo-login"
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={busy}
          className="auth-demo-btn"
        >
          ⚡ Quick Demo Sign-In (test@example.com)
        </button>

        <button
          id="btn-guest-mode"
          type="button"
          onClick={handleGuestMode}
          disabled={busy}
          className="auth-guest-btn"
        >
          Explore in Guest Mode (Offline preview)
        </button>

        <p className="auth-note">
          Once signed in, the <strong>Logout button</strong> is located in the top navigation bar, the <strong>Account &amp; Session section</strong> on the Overview dashboard, and inside your <strong>Profile</strong>.
        </p>
      </div>
    </div>
  );
}
