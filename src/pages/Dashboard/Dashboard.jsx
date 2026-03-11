import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import StatusPill from '../../components/StatusPill/StatusPill.jsx';
import { SPORTS } from '../../services/mock/mockData.js';
import { getMarketCounts } from '../../services/mock/mockApi.js';
import { useMockStore } from '../../services/mock/useMockStore.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const { matches, markets } = useMockStore((s) => ({ matches: s.matches, markets: s.markets }));
  const [sport, setSport] = useState('cricket');

  const list = useMemo(() => {
    const ms = matches.filter((m) => m.sport === sport);
    return ms.map((m) => ({
      ...m,
      counts: getMarketCounts(m.id),
      oddsMarket: markets.find((mk) => mk.matchId === m.id && mk.type === 'matchOdds') || null,
    }));
  }, [matches, markets, sport]);

  const activity = useMemo(
    () => [
      { title: 'Market resumed', meta: 'Match Odds · 6 mins ago', tag: 'Market' },
      { title: 'Settlement queued', meta: 'Cricket · 18 mins ago', tag: 'Settlement' },
      { title: 'Odds updated', meta: 'Back/Lay · 31 mins ago', tag: 'Market' },
    ],
    []
  );

  return (
    <div className="dash">
      <div className="dash__top">
        <div>
          <h2 className="dash__title">Dashboard</h2>
          <p className="dash__subtitle">Sports overview and live matches</p>
        </div>

        <div className="dashSports" role="tablist" aria-label="Sports">
          {SPORTS.map((s) => (
            <button
              key={s}
              type="button"
              className={sport === s ? 'dashSportBtn dashSportBtn--active' : 'dashSportBtn'}
              onClick={() => setSport(s)}
              role="tab"
              aria-selected={sport === s}
            >
              {s === 'cricket' ? 'Cricket' : s === 'soccer' ? 'Soccer' : 'Tennis'}
            </button>
          ))}
        </div>
      </div>

      <section className="dashMatches">
        {list.map((m) => (
          <button
            key={m.id}
            type="button"
            className="dashMatch"
            onClick={() => navigate(`/markets/match-odds?sport=${sport}`)}
          >
            <div className="dashMatch__row">
              <div className="dashMatch__time">{m.startTime}</div>
              <StatusPill value={m.status} />
            </div>

            <div className="dashMatch__name">{m.name}</div>

            <div className="dashMatch__tabs">
              <span className="dashMatch__tab">
                <strong>All</strong> <span>({m.counts.all})</span>
              </span>
              <span className="dashMatch__tab">
                <strong>Odds</strong> <span>({m.counts.odds})</span>
              </span>
              <span className="dashMatch__tab">
                <strong>Fancy</strong> <span>({m.counts.fancy})</span>
              </span>
            </div>

            {m.oddsMarket && (
              <div className="dashMatch__odds">
                <span className="dashMiniLabel">Market</span>
                <span className="dashMiniValue">
                  <StatusPill value={m.oddsMarket.status} />
                </span>
                <span className="dashMiniLabel">Updated</span>
                <span className="dashMiniValue">
                  {new Date(m.oddsMarket.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            )}
          </button>
        ))}
      </section>

      <section className="dash__two">
        <article className="panel">
          <div className="panel__head">
            <h3 className="panel__title">Quick actions</h3>
            <span className="panel__meta">Navigation</span>
          </div>

          <div className="quick">
            <button
              type="button"
              className="quick__item"
              onClick={() => navigate(`/markets/match-odds?sport=${sport}`)}
            >
              <span className="quick__icon">🎯</span>
              <span className="quick__text">
                <strong>Open Match Odds</strong>
                <span>{sport.toUpperCase()} markets</span>
              </span>
            </button>
            <button
              type="button"
              className="quick__item"
              onClick={() => navigate('/settlement')}
            >
              <span className="quick__icon">✅</span>
              <span className="quick__text">
                <strong>Settlement</strong>
                <span>Queue and finalize</span>
              </span>
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="panel__head">
            <h3 className="panel__title">Recent activity</h3>
            <span className="panel__meta">Last 24 hours</span>
          </div>

          <ul className="activity">
            {activity.map((a) => (
              <li key={`${a.title}-${a.meta}`} className="activity__item">
                <div className="activity__main">
                  <div className="activity__title">{a.title}</div>
                  <div className="activity__meta">{a.meta}</div>
                </div>
                <span className="tag">{a.tag}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
};

export default Dashboard;

