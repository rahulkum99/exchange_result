import { useMemo, useState } from 'react';
import './BackLay.css';
import StatusPill from '../../../components/StatusPill/StatusPill.jsx';
import { SPORTS } from '../../../services/mock/mockData.js';
import { mockActions } from '../../../services/mock/mockApi.js';
import { useMockStore } from '../../../services/mock/useMockStore.js';

const BackLay = () => {
  const { matches, markets } = useMockStore((s) => ({ matches: s.matches, markets: s.markets }));
  const [sport, setSport] = useState('cricket');

  const items = useMemo(() => {
    const ms = matches.filter((m) => m.sport === sport);
    return ms
      .map((m) => ({
        match: m,
        market: markets.find((mk) => mk.matchId === m.id && mk.type === 'backLay') || null,
      }))
      .filter((x) => Boolean(x.market));
  }, [matches, markets, sport]);

  return (
    <div className="bl">
      <div className="bl__top">
        <div>
          <h2 className="bl__title">Back / Lay</h2>
          <p className="bl__sub">Ladder view and market controls</p>
        </div>

        <div className="bl__sports" role="tablist" aria-label="Sports">
          {SPORTS.map((s) => (
            <button
              key={s}
              type="button"
              className={sport === s ? 'bl__sportBtn bl__sportBtn--active' : 'bl__sportBtn'}
              onClick={() => setSport(s)}
              role="tab"
              aria-selected={sport === s}
            >
              {s === 'cricket' ? 'Cricket' : s === 'soccer' ? 'Soccer' : 'Tennis'}
            </button>
          ))}
        </div>
      </div>

      <div className="bl__list">
        {items.map(({ match, market }) => (
          <div key={market.id} className="blCard">
            <div className="blCard__head">
              <div>
                <div className="blCard__name">{match.name}</div>
                <div className="blCard__meta">
                  {match.startTime} · <span className="mono">{market.selection}</span>
                </div>
              </div>
              <div className="blCard__right">
                <StatusPill value={market.status} />
                <button
                  type="button"
                  className="blBtn"
                  onClick={() => mockActions.toggleMarketStatus(market.id)}
                >
                  {market.status === 'active' ? 'Suspend' : 'Resume'}
                </button>
              </div>
            </div>

            <div className="ladder">
              <div className="ladder__head">
                <span>Price</span>
                <span>Back</span>
                <span>Lay</span>
              </div>
              {market.ladder?.map((row) => (
                <div key={row.price} className="ladder__row">
                  <div className="ladder__price">{row.price}</div>
                  <div className="ladder__cell ladder__cell--back">{row.back}</div>
                  <div className="ladder__cell ladder__cell--lay">{row.lay}</div>
                </div>
              ))}
            </div>

            <div className="blExposure">
              <div className="blExposure__label">Exposure (demo)</div>
              <div className="blExposure__value">- ₹ 1,250</div>
            </div>
          </div>
        ))}

        {!items.length && <div className="blEmpty">No back/lay markets for this sport.</div>}
      </div>
    </div>
  );
};

export default BackLay;

