import React from 'react';
import Navbar from '../../components/Navbar';
import './Dashboard.css';
import { useGetCricketUnsettledSummaryQuery } from '../../features/cricket/cricketAPI';

function Dashboard() {
  const { data, isLoading, isError } = useGetCricketUnsettledSummaryQuery();

  const events = data?.data || [];

  const totalMarkets = events.reduce(
    (sum, event) => sum + (event.markets ? event.markets.length : 0),
    0,
  );

  const totalUnsettledBets = events.reduce((sum, event) => {
    if (!event.markets) return sum;
    return (
      sum +
      event.markets.reduce(
        (inner, market) => inner + (market.totalOpenBets || 0),
        0,
      )
    );
  }, 0);

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <header className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Overview</h1>
            <p className="dashboard__subtitle">
              {isLoading && 'Loading cricket unsettled summary...'}
              {isError && 'Could not load data. Please try again.'}
              {!isLoading &&
                !isError &&
                'Live snapshot of all sports markets and unsettled positions.'}
            </p>
          </div>

          <div className="dashboard__header-actions">
            <select className="dashboard__select">
              <option>All sports</option>
              <option>Cricket</option>
              <option>Soccer</option>
              <option>Tennis</option>
            </select>
            <button className="dashboard__refresh">Refresh</button>
          </div>
        </header>

        <section className="dashboard__grid">
          <article className="dashboard__card">
            <h2 className="dashboard__card-label">Open Markets</h2>
            <p className="dashboard__card-value">
              {isLoading ? '—' : totalMarkets}
            </p>
            <p className="dashboard__card-meta">Cricket unsettled markets</p>
          </article>
          <article className="dashboard__card">
            <h2 className="dashboard__card-label">Unsettled Bets</h2>
            <p className="dashboard__card-value">
              {isLoading ? '—' : totalUnsettledBets}
            </p>
            <p className="dashboard__card-meta dashboard__card-meta--warning">
              {isLoading ? 'Loading...' : 'Total open positions'}
            </p>
          </article>
          <article className="dashboard__card">
            <h2 className="dashboard__card-label">Exposure</h2>
            <p className="dashboard__card-value">₹ 4,52,300</p>
            <p className="dashboard__card-meta">Estimated risk</p>
          </article>
        </section>

        <section className="dashboard__table-card">
          <header className="dashboard__table-header">
            <div>
              <h2 className="dashboard__table-title">Cricket unsettled events</h2>
              <p className="dashboard__table-subtitle">
                Quick view of the latest markets being traded.
              </p>
            </div>
            <button className="dashboard__link-button">View all</button>
          </header>

            <div className="dashboard__table">
              <div className="dashboard__table-row dashboard__table-row--head">
                <span>Sport</span>
                <span>Event</span>
                <span>Markets</span>
                <span>Unsettled bets</span>
                <span>Market names</span>
              </div>

              {isLoading && (
                <div className="dashboard__table-row">
                  <span colSpan={5}>Loading...</span>
                </div>
              )}

              {!isLoading &&
                !isError &&
                events.slice(0, 10).map((event) => {
                  const markets = event.markets || [];
                  const unsettledForEvent = markets.reduce(
                    (sum, market) => sum + (market.totalOpenBets || 0),
                    0,
                  );
                  const marketNames = markets
                    .map((market) => market.marketName)
                    .filter(Boolean)
                    .join(', ');

                  return (
                    <div className="dashboard__table-row" key={event.eventId}>
                      <span>Cricket</span>
                      <span>{event.eventName}</span>
                      <span>{markets.length}</span>
                      <span>{unsettledForEvent}</span>
                      <span>{marketNames || '—'}</span>
                    </div>
                  );
                })}

              {!isLoading && isError && (
                <div className="dashboard__table-row">
                  <span colSpan={5}>Failed to load cricket data.</span>
                </div>
              )}
            </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;