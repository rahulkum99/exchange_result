import { getStoredAccessToken } from '../features/auth/authSlice';

export function useAuth() {
  return {
    isAuthenticated: Boolean(getStoredAccessToken()),
  };
}
