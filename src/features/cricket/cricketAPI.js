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
    settleMatchOdds: builder.mutation({
      query: ({
        marketType,
        eventId,
        marketId,
        winnerSelectionId,
        winnerSelectionName,
        marketName,
      }) => ({
        url: '/cricket/settle/match-odds',
        method: 'POST',
        body: {
          marketType,
          eventId,
          marketId,
          winnerSelectionId,
          winnerSelectionName,
          marketName,
        },
      }),
    }),
  }),
});

export const {
  useGetUnsettledSummaryQuery: useGetCricketUnsettledSummaryQuery,
  useGetUnsettledEventQuery: useGetCricketUnsettledEventQuery,
  useSettleMatchOddsMutation,
} = cricketApi;

