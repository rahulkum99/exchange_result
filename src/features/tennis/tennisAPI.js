import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/baseApi';

export const tennisApi = createApi({
  reducerPath: 'tennisApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUnsettledSummary: builder.query({
      query: () => ({
        url: '/tennis/unsettled/summary',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUnsettledSummaryQuery: useGetTennisUnsettledSummaryQuery } = tennisApi;

