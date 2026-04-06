import React from 'react';
import Navbar from '../../components/Navbar';
import './CricketUnsettled.css';
import { Link } from 'react-router-dom';
import { useGetCricketUnsettledSummaryQuery } from '../../features/cricket/cricketAPI';

const DEFAULT_LIMIT = 20;

const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/** IST is UTC+5:30 (no DST). Returns UTC ms for scheduled start, or null if no parseable date/time in name. */
function parseCricketEventStartUtcMs(eventName) {
  if (!eventName || typeof eventName !== 'string') return null;
  const slash = eventName.indexOf('/');
  if (slash < 0) return null;
  const tail = eventName.slice(slash + 1).trim();
  const m = tail.match(
    /([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i,
  );
  if (!m) return null;
  const [, monStr, dayStr, yearStr, hStr, minStr, ap] = m;
  const mon = MONTHS[monStr.slice(0, 3).toLowerCase()];
  if (mon === undefined) return null;
  let h = parseInt(hStr, 10);
  const mi = parseInt(minStr, 10);
  const y = parseInt(yearStr, 10);
  const d = parseInt(dayStr, 10);
  const apu = ap.toUpperCase();
  if (apu === 'PM' && h !== 12) h += 12;
  if (apu === 'AM' && h === 12) h = 0;
  const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
  return Date.UTC(y, mon, d, h, mi, 0, 0) - IST_OFFSET_MS;
}

function getCricketCardStatus(event, nowMs) {
  const startMs = parseCricketEventStartUtcMs(event.eventName);

  if (event.inPlay === true) {
    return {
      label: 'IN-PLAY',
      className: 'cricket-card__status cricket-card__status--in-play',
    };
  }

  if (startMs !== null && nowMs < startMs) {
    return {
      label: 'GOING IN-PLAY',
      className: 'cricket-card__status cricket-card__status--going-in-play',
    };
  }

  if (startMs === null) {
    if (event.inPlay === false) {
      return {
        label: 'NOT IN-PLAY',
        className: 'cricket-card__status cricket-card__status--not-in-play',
      };
    }
    return {
      label: 'PRE-MATCH',
      className: 'cricket-card__status cricket-card__status--pre-match',
    };
  }

  return {
    label: 'FINISHED',
    className: 'cricket-card__status cricket-card__status--finished',
  };
}

function CricketUnsettled() {
  const [openEventFilter, setOpenEventFilter] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(DEFAULT_LIMIT);
  const [nowMs, setNowMs] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { data, isLoading, isError } = useGetCricketUnsettledSummaryQuery({
    page,
    limit,
    openEvent: openEventFilter,
  });

  const events = React.useMemo(() => {
    const list = [...(data?.data || [])];
    list.sort(
      (a, b) =>
        Number(b.inPlay === true) - Number(a.inPlay === true),
    );
    return list;
  }, [data?.data]);
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
          <h1 className="cricket-page__title">Cricket</h1>
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
              {/* <div className="cricket-page__toggle-row">
                <span className="cricket-page__toggle-label">On</span>
                <button className="cricket-page__toggle-switch" />
              </div> */}

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

                  const { label: statusLabel, className: statusClass } =
                    getCricketCardStatus(event, nowMs);

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
                            <span className={statusClass}>{statusLabel}</span>
                          </div>

                          <div className="cricket-card__match">
                            {event.eventName.split('/')[0]?.trim()}
                          </div>
                        </div>

                        <div className="cricket-card__segments">
                          <div className="cricket-card__segment">
                            <span className="cricket-card__segment-label mx-1">
                              All
                            </span>
                            <span className="cricket-card__segment-value">
                             ( {allCount} )
                            </span>
                          </div>
                          <div className="cricket-card__segment">
                            <span className="cricket-card__segment-label mx-1">
                              Odds
                            </span>
                            <span className="cricket-card__segment-value">
                             ( {oddsCount} ) 
                            </span>
                          </div>
                          <div className="cricket-card__segment">
                            <span className="cricket-card__segment-label mx-1">
                              Fancy
                            </span>
                            <span className="cricket-card__segment-value">
                             ( {fancyCount} )
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

export default CricketUnsettled;

