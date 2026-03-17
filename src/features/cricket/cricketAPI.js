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
    settleBookmakerFancy: builder.mutation({
      query: ({ marketType, eventId, marketId, winnerSelectionId }) => ({
        url: '/cricket/settle/bookmaker-fancy',
        method: 'POST',
        body: {
          marketType,
          eventId,
          marketId,
          winnerSelectionId,
        },
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
    settleTosMarket: builder.mutation({
      query: ({ marketType, eventId, marketId, winnerSelectionId }) => ({
        url: '/cricket/settle/tos-market',
        method: 'POST',
        body: {
          marketType,
          eventId,
          marketId,
          winnerSelectionId,
        },
      }),
    }),
    settleFancy: builder.mutation({
      query: ({ eventId, marketId, selectionId, finalValue }) => ({
        url: '/cricket/settle/fancy',
        method: 'POST',
        body: {
          eventId,
          marketId,
          selectionId,
          finalValue,
        },
      }),
    }),
    cancelMarket: builder.mutation({
      query: ({ marketType, eventId, marketId, selectionId, reason }) => ({
        url: '/cancel/market',
        method: 'POST',
        body: {
          marketType,
          eventId,
          marketId,
          selectionId,
          reason,
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
  useSettleTosMarketMutation,
  useSettleBookmakerFancyMutation,
  useSettleFancyMutation,
  useCancelMarketMutation,
} = cricketApi;

