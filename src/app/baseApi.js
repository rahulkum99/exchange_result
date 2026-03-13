import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  clearAccessToken,
  clearRefreshToken,
  getStoredRefreshToken,
  selectAccessToken,
  setCredentials,
  logout,
  storeAccessToken,
  storeRefreshToken,
} from '../features/auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState());
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      api.dispatch(logout());
      clearRefreshToken();
      clearAccessToken();
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data?.tokens?.accessToken) {
      api.dispatch(
        setCredentials({
          user: refreshResult.data.user,
          accessToken: refreshResult.data.tokens.accessToken,
        }),
      );

      storeRefreshToken(refreshResult.data.tokens.refreshToken);
      storeAccessToken(refreshResult.data.tokens.accessToken);

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      clearRefreshToken();
      clearAccessToken();
    }
  }

  return result;
};

