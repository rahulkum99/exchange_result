import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/baseApi';

export const cricketApi = createApi({
  reducerPath: 'cricketApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUnsettledSummary: builder.query({
      query: ({ page, limit, openEvent } = {}) => {
        const params = new URLSearchParams();
        if (page != null) params.set('page', String(page));
        if (limit != null) params.set('limit', String(limit));
        if (openEvent !== undefined && openEvent !== null)
          params.set('openEvent', openEvent === true ? 'true' : 'false');
        const query = params.toString();
        return {
          url: `/cricket/unsettled/summary${query ? `?${query}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getUnsettledEvent: builder.query({
      query: (eventId) => ({
        url: `/cricket/unsettled/${eventId}`,
        method: 'GET',
      }),
    }),
    setEventOpen: builder.mutation({
      query: ({ eventId, openEvent }) => ({
        url: '/cricket/unsettled/events/set-open',
        method: 'POST',
        body: { eventId, openEvent },
      }),
    }),
    getMissingFancy: builder.mutation({
      query: (eventId) => ({
        url: '/cricket/unsettled/events/get-missing-fancy',
        method: 'POST',
        body: { eventId },
      }),
    }),
    getUnsettledBets: builder.mutation({
      query: (eventId) => ({
        url: '/cricket/unsettled/events/unsettled-bets',
        method: 'POST',
        body: { eventId },
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
  useSetEventOpenMutation,
  useGetMissingFancyMutation,
  useGetUnsettledBetsMutation,
  useSettleMatchOddsMutation,
} = cricketApi;

