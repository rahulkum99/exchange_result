import React from 'react';
import Navbar from '../../components/Navbar';
import './CricketUnsettled.css';
import { Link } from 'react-router-dom';
import { useGetCricketUnsettledSummaryQuery } from '../../features/cricket/cricketAPI';

function CricketUnsettled() {
  const { data, isLoading, isError } = useGetCricketUnsettledSummaryQuery();
  const events = data?.data || [];

  return (
    <>
      <Navbar />
      <main className="cricket-page">
        <header className="cricket-page__header">
          <h1 className="cricket-page__title">Cricket</h1>
        </header>

        <section className="cricket-page__content">
          {isLoading && <div className="cricket-page__state">Loading...</div>}
          {isError && (
            <div className="cricket-page__state cricket-page__state--error">
              Failed to load data. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="cricket-page__toggle-row">
                <span className="cricket-page__toggle-label">On</span>
                <button className="cricket-page__toggle-switch" />
              </div>

              <div className="cricket-page__list">
                {events.map((event) => {
                  const markets = event.markets || [];
                  const totalUnsettled = markets.reduce(
                    (sum, m) => sum + (m.totalOpenBets || 0),
                    0,
                  );

                  const allCount = totalUnsettled;
                  const oddsCount =
                    markets.find((m) => m.marketName?.toLowerCase().includes('odds'))
                      ?.totalOpenBets || 0;
                  const fancyCount =
                    markets.find((m) => m.marketName?.toLowerCase().includes('fancy'))
                      ?.totalOpenBets || 0;

                  return (
                    <Link
                      to={`/cricket/event/${event.eventId}`}
                      className="cricket-card-link"
                      key={event.eventId}
                    >
                      <article className="cricket-card">
                        <div>
                          <div className="cricket-card__top">
                            <div className="cricket-card__date">
                              {event.eventName.split('/')[1]?.trim() || '—'}
                            </div>
                            <span className="cricket-card__status">
                              GOING IN-PLAY
                            </span>
                          </div>

                          <div className="cricket-card__match">
                            {event.eventName.split('/')[0]?.trim()}
                          </div>
                        </div>

                        <div className="cricket-card__segments">
                          <div className="cricket-card__segment">
                            <span className="cricket-card__segment-label">
                              All
                            </span>
                            <span className="cricket-card__segment-value">
                              {allCount}
                            </span>
                          </div>
                          <div className="cricket-card__segment">
                            <span className="cricket-card__segment-label">
                              Odds
                            </span>
                            <span className="cricket-card__segment-value">
                              {oddsCount}
                            </span>
                          </div>
                          <div className="cricket-card__segment">
                            <span className="cricket-card__segment-label">
                              Fancy
                            </span>
                            <span className="cricket-card__segment-value">
                              {fancyCount}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default CricketUnsettled;

