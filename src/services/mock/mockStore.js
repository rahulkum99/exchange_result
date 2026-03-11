import { mockMatches, mockMarkets, mockSettlements } from './mockData.js';

let state = {
  matches: mockMatches,
  markets: mockMarkets,
  settlements: mockSettlements,
  activity: [
    { id: 'a1', text: 'Market mk2 resumed', ts: Date.now() - 1000 * 60 * 6 },
    { id: 'a2', text: 'Settlement queued for m3', ts: Date.now() - 1000 * 60 * 18 },
  ],
};

const listeners = new Set();

function emit() {
  for (const l of listeners) l();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return state;
}

function setState(updater) {
  state = updater(state);
  emit();
}

export function actions() {
  return {
    toggleMarketStatus(marketId) {
      setState((s) => {
        const markets = s.markets.map((m) => {
          if (m.id !== marketId) return m;
          return {
            ...m,
            status: m.status === 'active' ? 'suspended' : 'active',
            updatedAt: Date.now(),
          };
        });
        return {
          ...s,
          markets,
          activity: [
            {
              id: `a${Date.now()}`,
              text: `Market ${marketId} toggled`,
              ts: Date.now(),
            },
            ...s.activity,
          ].slice(0, 25),
        };
      });
    },
    setSettlementResult(matchId, result) {
      setState((s) => {
        const settlements = s.settlements.map((st) =>
          st.matchId === matchId ? { ...st, result, status: 'ready' } : st
        );
        return { ...s, settlements };
      });
    },
    finalizeSettlement(matchId) {
      setState((s) => {
        const settlements = s.settlements.map((st) =>
          st.matchId === matchId
            ? { ...st, finalized: true, status: 'finalized' }
            : st
        );
        return {
          ...s,
          settlements,
          activity: [
            {
              id: `a${Date.now()}`,
              text: `Settlement finalized for ${matchId}`,
              ts: Date.now(),
            },
            ...s.activity,
          ].slice(0, 25),
        };
      });
    },
  };
}

