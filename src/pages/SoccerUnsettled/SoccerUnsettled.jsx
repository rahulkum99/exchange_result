import React from 'react';
import Navbar from '../../components/Navbar';
import '../CricketUnsettled/CricketUnsettled.css';
import { useGetSoccerUnsettledSummaryQuery } from '../../features/soccer/soccerAPI';

function SoccerUnsettled() {
  const { data, isLoading, isError } = useGetSoccerUnsettledSummaryQuery();
  const events = data?.data || [];

  return (
    <>
      <Navbar />
      <main className="cricket-page">
        <header className="cricket-page__header">
          <h1 className="cricket-page__title">Soccer</h1>
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
                    <article className="cricket-card" key={event.eventId}>
                      <div>
                        <div className="cricket-card__top">
                          <div className="cricket-card__date">
                            {/* Soccer API eventName is usually like "Team A v Team B" */}
                            {event.eventName || `Event ${event.eventId}`}
                          </div>
                          <span className="cricket-card__status">
                            GOING IN-PLAY
                          </span>
                        </div>

                        <div className="cricket-card__match">
                          Total open bets
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

export default SoccerUnsettled;

