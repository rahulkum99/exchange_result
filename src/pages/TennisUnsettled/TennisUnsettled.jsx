import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../CricketUnsettled/CricketUnsettled.css';
import { useGetTennisUnsettledSummaryQuery } from '../../features/tennis/tennisAPI';

const DEFAULT_LIMIT = 20;

function TennisUnsettled() {
  const [openEventFilter, setOpenEventFilter] = React.useState(undefined);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(DEFAULT_LIMIT);

  const { data, isLoading, isError } = useGetTennisUnsettledSummaryQuery({
    page,
    limit,
    openEvent: openEventFilter,
  });

  const events = data?.data || [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const setOpenEventFilterAndResetPage = (value) => {
    setOpenEventFilter(value);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="cricket-page">
        <header className="cricket-page__header">
          <h1 className="cricket-page__title">Tennis</h1>
          <div className="cricket-page__header-actions">
            <button
              type="button"
              className={`cricket-page__filter-btn ${openEventFilter === true ? 'cricket-page__filter-btn--active' : ''}`}
              onClick={() => setOpenEventFilterAndResetPage(openEventFilter === true ? undefined : true)}
            >
              Open event
            </button>
            <button
              type="button"
              className={`cricket-page__filter-btn ${openEventFilter === false ? 'cricket-page__filter-btn--active' : ''}`}
              onClick={() => setOpenEventFilterAndResetPage(openEventFilter === false ? undefined : false)}
            >
              Close event
            </button>
          </div>
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
                      to={`/tennis/event/${event.eventId}`}
                      className="cricket-card-link"
                      key={event.eventId}
                    >
                      <article className="cricket-card">
                      <div>
                        <div className="cricket-card__top">
                          <div className="cricket-card__date">
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
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="cricket-page__pagination">
                  <button
                    type="button"
                    className="cricket-page__pagination-btn"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span className="cricket-page__pagination-info">
                    Page {currentPage} of {totalPages}
                    {total > 0 && ` (${total} total)`}
                  </span>
                  <button
                    type="button"
                    className="cricket-page__pagination-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default TennisUnsettled;

