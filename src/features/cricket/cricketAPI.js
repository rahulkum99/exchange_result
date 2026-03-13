import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/baseApi';

export const cricketApi = createApi({
  reducerPath: 'cricketApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUnsettledSummary: builder.query({
      query: () => ({
        url: '/cricket/unsettled/summary',
        method: 'GET',
      }),
    }),
    getUnsettledEvent: builder.query({
      query: (eventId) => ({
        url: `/cricket/unsettled/${eventId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetUnsettledSummaryQuery: useGetCricketUnsettledSummaryQuery,
  useGetUnsettledEventQuery: useGetCricketUnsettledEventQuery,
} = cricketApi;

