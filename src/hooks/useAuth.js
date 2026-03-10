export function useAuth() {
  return {
    // Simple auth check based on a token in localStorage.
    // Replace this with real auth state (Redux, context, etc.) when ready.
    isAuthenticated:
      typeof window !== 'undefined' &&
      Boolean(localStorage.getItem('access_token')),
  };
}
