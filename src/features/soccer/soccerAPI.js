import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/baseApi';

export const soccerApi = createApi({
  reducerPath: 'soccerApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUnsettledSummary: builder.query({
      query: () => ({
        url: '/soccer/unsettled/summary',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUnsettledSummaryQuery: useGetSoccerUnsettledSummaryQuery } = soccerApi;

