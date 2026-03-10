import React, { useState } from 'react';
import './LoginScreen.css';
import { useNavigate } from 'react-router-dom';

// NOTE:
// The original snippet used Redux (`useDispatch`, `setCredentials`)
// and RTK Query (`useLoginMutation`). Those are not yet set up
// in this project, so this version only handles UI and basic
// navigation. You can wire real auth logic later.

function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async () => {
    setError('');

    // Placeholder login behavior:
    // Replace this with your real API + Redux logic when ready.
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      // Fake delay to mimic API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store a fake token so private routes see the user as "logged in"
      localStorage.setItem('access_token', 'demo-token');

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">King</div>

        <div className="login-input-group">
          <input
            type="text"
            className="login-input"
            placeholder="Demo2026"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="input-icon" aria-hidden="true">
            👤
          </span>
        </div>

        <div className="login-input-group">
          <input
            type={passwordVisible ? 'text' : 'password'}
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="input-icon btn-eye"
            onClick={togglePassword}
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? '🙈' : '👁️'}
          </button>
        </div>

        {error && (
          <div
            style={{
              color: 'white',
              marginBottom: '8px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        <button
          className="login-btn primary"
          onClick={handleLogin}
          disabled={false}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;

