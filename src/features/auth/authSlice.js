import { createSlice } from '@reduxjs/toolkit';

const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_KEY = 'access_token';

const initialState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload || {};
      state.user = user || null;
      state.accessToken = accessToken || null;
      state.status = 'authenticated';
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'idle';
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload || 'Authentication error';
      state.status = 'error';
    },
  },
});

export const { setCredentials, logout, setAuthError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth?.user;
export const selectAccessToken = (state) => state.auth?.accessToken;
export const selectIsAuthenticated = (state) => Boolean(state.auth?.accessToken);
export const selectAuthStatus = (state) => state.auth?.status;
export const selectAuthError = (state) => state.auth?.error;

export const getStoredRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getStoredAccessToken = () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const storeRefreshToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  } catch {
    // ignore storage errors
  }
};

export const storeAccessToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  } catch {
    // ignore storage errors
  }
};

export const clearRefreshToken = () => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

export const clearAccessToken = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
};

export default authSlice.reducer;
