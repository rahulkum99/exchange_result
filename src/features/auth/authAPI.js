import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  setCredentials,
  logout,
  selectAccessToken,
  getStoredRefreshToken,
  storeRefreshToken,
  clearRefreshToken,
  storeAccessToken,
  clearAccessToken,
} from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState());
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      api.dispatch(logout());
      clearRefreshToken();
      clearAccessToken();
      return result;
    }

    const refreshResult = await baseQuery(
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

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      clearRefreshToken();
      clearAccessToken();
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { username, password },
      }),
    }),
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation } = authApi;

