import { actions, getSnapshot } from './mockStore.js';

export function getMatchesBySport(sport) {
  const { matches } = getSnapshot();
  return matches.filter((m) => m.sport === sport);
}

export function getMarketsByMatch(matchId) {
  const { markets } = getSnapshot();
  return markets.filter((m) => m.matchId === matchId);
}

export function getMarketCounts(matchId) {
  const ms = getMarketsByMatch(matchId);
  const odds = ms.filter((m) => m.type === 'matchOdds').length;
  const fancy = ms.filter((m) => m.type === 'fancy').length;
  const toss = ms.filter((m) => m.type === 'toss').length;
  const backLay = ms.filter((m) => m.type === 'backLay').length;
  const all = odds + fancy + toss + backLay;
  return { all, odds, fancy, toss, backLay };
}

export function getPrimaryOdds(market) {
  if (!market?.runners?.length) return null;
  const bestBack = Math.min(...market.runners.map((r) => r.back ?? Infinity));
  const bestLay = Math.min(...market.runners.map((r) => r.lay ?? Infinity));
  return { bestBack, bestLay };
}

export const mockActions = actions();

