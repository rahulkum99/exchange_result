import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './MatchOdds.css';
import StatusPill from '../../../components/StatusPill/StatusPill.jsx';
import Drawer from '../../../components/Drawer/Drawer.jsx';
import { SPORTS } from '../../../services/mock/mockData.js';
import { getMarketCounts, getMarketsByMatch, mockActions } from '../../../services/mock/mockApi.js';
import { useMockStore } from '../../../services/mock/useMockStore.js';

const MatchOdds = () => {
  const { matches, markets } = useMockStore((s) => ({ matches: s.matches, markets: s.markets }));
  const [searchParams, setSearchParams] = useSearchParams();
  const [sport, setSport] = useState('cricket');
  const [activeMatchId, setActiveMatchId] = useState(null);

  useEffect(() => {
    const s = searchParams.get('sport');
    if (s && SPORTS.includes(s) && s !== sport) setSport(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const s = searchParams.get('sport');
    if (s !== sport) setSearchParams({ sport }, { replace: true });
  }, [searchParams, setSearchParams, sport]);

  const list = useMemo(() => {
    const ms = matches.filter((m) => m.sport === sport);
    const withCounts = ms.map((m) => ({
      ...m,
      counts: getMarketCounts(m.id),
      oddsMarket: markets.find((mk) => mk.matchId === m.id && mk.type === 'matchOdds') || null,
    }));
    return withCounts;
  }, [matches, markets, sport]);

  const active = useMemo(() => {
    if (!activeMatchId) return null;
    return matches.find((m) => m.id === activeMatchId) || null;
  }, [activeMatchId, matches]);

  const activeMarkets = useMemo(() => {
    if (!activeMatchId) return [];
    return getMarketsByMatch(activeMatchId);
  }, [activeMatchId]);

  return (
    <div className="market">
      <div className="market__top">
        <div>
          <h2 className="market__title">Markets</h2>
          <p className="market__sub">Choose a sport and view market details</p>
        </div>

        <div className="market__sports" role="tablist" aria-label="Sports">
          {SPORTS.map((s) => (
            <button
              key={s}
              type="button"
              className={sport === s ? 'market__sportBtn market__sportBtn--active' : 'market__sportBtn'}
              onClick={() => setSport(s)}
              role="tab"
              aria-selected={sport === s}
            >
              {s === 'cricket' ? 'Cricket' : s === 'soccer' ? 'Soccer' : 'Tennis'}
            </button>
          ))}
        </div>
      </div>

      <div className="market__list">
        {list.map((m) => (
          <button
            key={m.id}
            type="button"
            className="matchCard"
            onClick={() => setActiveMatchId(m.id)}
          >
            <div className="matchCard__row">
              <div className="matchCard__time">{m.startTime}</div>
              <StatusPill value={m.status} />
            </div>

            <div className="matchCard__name">{m.name}</div>

            <div className="matchCard__tabs">
              <span className="matchCard__tab">
                <strong>All</strong> <span>({m.counts.all})</span>
              </span>
              <span className="matchCard__tab">
                <strong>Odds</strong> <span>({m.counts.odds})</span>
              </span>
              <span className="matchCard__tab">
                <strong>Fancy</strong> <span>({m.counts.fancy})</span>
              </span>
            </div>

            {m.oddsMarket && (
              <div className="matchCard__odds">
                <span className="miniLabel">Market</span>
                <span className="miniValue">
                  <StatusPill value={m.oddsMarket.status} />
                </span>
                <span className="miniLabel">Updated</span>
                <span className="miniValue">
                  {new Date(m.oddsMarket.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <Drawer
        open={Boolean(activeMatchId)}
        title={active ? `Match · ${active.name}` : 'Match'}
        onClose={() => setActiveMatchId(null)}
      >
        {active && (
          <div className="drawerBlock">
            <div className="drawerMeta">
              <div className="drawerMeta__row">
                <span className="drawerMeta__label">Start time</span>
                <span className="drawerMeta__value">{active.startTime}</span>
              </div>
              <div className="drawerMeta__row">
                <span className="drawerMeta__label">Status</span>
                <span className="drawerMeta__value">
                  <StatusPill value={active.status} />
                </span>
              </div>
            </div>

            <div className="drawerSectionTitle">Markets</div>
            <div className="drawerMarkets">
              {activeMarkets.map((mk) => (
                <div key={mk.id} className="drawerMarket">
                  <div className="drawerMarket__top">
                    <div>
                      <div className="drawerMarket__name">
                        {mk.type === 'matchOdds'
                          ? 'Match Odds'
                          : mk.type === 'fancy'
                            ? 'Fancy'
                            : mk.type === 'toss'
                              ? 'Toss'
                              : 'Back/Lay'}
                      </div>
                      <div className="drawerMarket__sub">ID: {mk.id}</div>
                    </div>
                    <div className="drawerMarket__right">
                      <StatusPill value={mk.status} />
                      <button
                        type="button"
                        className="drawerMarket__btn"
                        onClick={() => mockActions.toggleMarketStatus(mk.id)}
                      >
                        {mk.status === 'active' ? 'Suspend' : 'Resume'}
                      </button>
                    </div>
                  </div>

                  {mk.runners?.length ? (
                    <div className="runnerGrid">
                      {mk.runners.map((r) => (
                        <div key={r.id} className="runnerRow">
                          <div className="runnerRow__name">{r.name}</div>
                          <div className="runnerRow__price runnerRow__price--back">
                            <span>Back</span>
                            <strong>{r.back}</strong>
                          </div>
                          <div className="runnerRow__price runnerRow__price--lay">
                            <span>Lay</span>
                            <strong>{r.lay}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="drawerEmpty">No runners data for this market.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default MatchOdds;

