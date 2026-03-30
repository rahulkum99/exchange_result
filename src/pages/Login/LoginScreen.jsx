import React, { useState } from 'react';
import './LoginScreen.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../features/auth/authAPI';
import {
  setCredentials,
  storeRefreshToken,
  storeAccessToken,
} from '../../features/auth/authSlice';

function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async () => {
    setError('');

    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();

      if (result?.tokens?.accessToken) {
        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.tokens.accessToken,
          }),
        );

        storeRefreshToken(result.tokens.refreshToken);
        storeAccessToken(result.tokens.accessToken);
      }

      navigate('/dashboard');
    } catch (err) {
      // RTK Query error shape: err.data?.message or generic message
      const message =
        err?.data?.message ||
        err?.error ||
        'Login failed. Please check your credentials.';
      setError(message);
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
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;

