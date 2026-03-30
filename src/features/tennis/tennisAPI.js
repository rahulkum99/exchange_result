import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../app/baseApi';

export const tennisApi = createApi({
  reducerPath: 'tennisApi',
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
          url: `/tennis/unsettled/summary${query ? `?${query}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getUnsettledEvent: builder.query({
      query: (eventId) => ({
        url: `/tennis/unsettled/${eventId}`,
        method: 'GET',
      }),
    }),
    setEventOpen: builder.mutation({
      query: ({ eventId, openEvent }) => ({
        url: '/tennis/unsettled/events/set-open',
        method: 'POST',
        body: { eventId, openEvent },
      }),
    }),
    settleMatchOdds: builder.mutation({
      query: ({
        eventId,
        marketId,
        winnerSelectionId,
        publish,
      }) => ({
        url: '/tennis/settle/match-odds',
        method: 'POST',
        body: {
          eventId,
          marketId,
          winnerSelectionId,
          ...(publish ? { publish: true } : {}),
        },
      }),
    }),
  }),
});

export const {
  useGetUnsettledSummaryQuery: useGetTennisUnsettledSummaryQuery,
  useGetUnsettledEventQuery: useGetTennisUnsettledEventQuery,
  useSetEventOpenMutation: useSetTennisEventOpenMutation,
  useSettleMatchOddsMutation: useSetTennisSettleMatchOddsMutation,
} = tennisApi;

