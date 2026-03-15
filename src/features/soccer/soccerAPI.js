import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/baseApi';

export const soccerApi = createApi({
  reducerPath: 'soccerApi',
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
          url: `/soccer/unsettled/summary${query ? `?${query}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getUnsettledEvent: builder.query({
      query: (eventId) => ({
        url: `/soccer/unsettled/${eventId}`,
        method: 'GET',
      }),
    }),
    setEventOpen: builder.mutation({
      query: ({ eventId, openEvent }) => ({
        url: '/soccer/unsettled/events/set-open',
        method: 'POST',
        body: { eventId, openEvent },
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
        url: '/soccer/settle/match-odds',
        method: 'POST',
        body: {
          marketType: marketType ?? 'match_odds',
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
  useGetUnsettledSummaryQuery: useGetSoccerUnsettledSummaryQuery,
  useGetUnsettledEventQuery: useGetSoccerUnsettledEventQuery,
  useSetEventOpenMutation: useSetSoccerEventOpenMutation,
  useSettleMatchOddsMutation: useSetSoccerSettleMatchOddsMutation,
} = soccerApi;

