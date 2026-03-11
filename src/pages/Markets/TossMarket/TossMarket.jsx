import { useMemo, useState } from 'react';
import './TossMarket.css';
import StatusPill from '../../../components/StatusPill/StatusPill.jsx';
import { SPORTS } from '../../../services/mock/mockData.js';
import { mockActions } from '../../../services/mock/mockApi.js';
import { useMockStore } from '../../../services/mock/useMockStore.js';

const TossMarket = () => {
  const { matches, markets } = useMockStore((s) => ({ matches: s.matches, markets: s.markets }));
  const [sport, setSport] = useState('cricket');

  const rows = useMemo(() => {
    const ms = matches.filter((m) => m.sport === sport);
    return ms
      .map((m) => ({
        match: m,
        market: markets.find((mk) => mk.matchId === m.id && mk.type === 'toss') || null,
      }))
      .filter((x) => Boolean(x.market));
  }, [matches, markets, sport]);

  return (
    <div className="toss">
      <div className="toss__top">
        <div>
          <h2 className="toss__title">Toss Market</h2>
          <p className="toss__sub">Quick controls for toss markets</p>
        </div>

        <div className="toss__sports" role="tablist" aria-label="Sports">
          {SPORTS.map((s) => (
            <button
              key={s}
              type="button"
              className={sport === s ? 'toss__sportBtn toss__sportBtn--active' : 'toss__sportBtn'}
              onClick={() => setSport(s)}
              role="tab"
              aria-selected={sport === s}
            >
              {s === 'cricket' ? 'Cricket' : s === 'soccer' ? 'Soccer' : 'Tennis'}
            </button>
          ))}
        </div>
      </div>

      <div className="toss__list">
        {rows.map(({ match, market }) => (
          <div key={market.id} className="tossCard">
            <div className="tossCard__head">
              <div>
                <div className="tossCard__name">{match.name}</div>
                <div className="tossCard__time">{match.startTime}</div>
              </div>
              <StatusPill value={market.status} />
            </div>

            <div className="tossCard__runners">
              {market.runners?.map((r) => (
                <div key={r.id} className="tossRunner">
                  <div className="tossRunner__name">{r.name}</div>
                  <div className="tossRunner__price">
                    <span>Back</span>
                    <strong>{r.back}</strong>
                  </div>
                  <div className="tossRunner__price tossRunner__price--lay">
                    <span>Lay</span>
                    <strong>{r.lay}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="tossCard__actions">
              <button
                type="button"
                className="tossBtn"
                onClick={() => mockActions.toggleMarketStatus(market.id)}
              >
                {market.status === 'active' ? 'Suspend' : 'Resume'}
              </button>
              <button type="button" className="tossBtn tossBtn--primary">
                Lock Odds
              </button>
              <button type="button" className="tossBtn">
                Set Winner
              </button>
            </div>
          </div>
        ))}

        {!rows.length && <div className="tossEmpty">No toss markets for this sport.</div>}
      </div>
    </div>
  );
};

export default TossMarket;

