import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './CricketUnsettled.css';
import { useGetCricketUnsettledEventQuery } from '../../features/cricket/cricketAPI';

function CricketUnsettledEvent() {
  const { eventId } = useParams();
  const { data, isLoading, isError } = useGetCricketUnsettledEventQuery(eventId);
  const markets = data?.data || [];

  const eventName = markets[0]?.eventName || '';

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
              Failed to load event data. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="cricket-event__header">
                <div className="cricket-event__match">
                  {eventName.split('/')[0]?.trim()}
                </div>
                <div className="cricket-event__date">
                  {eventName.split('/')[1]?.trim()}
                </div>
              </div>

              <div className="cricket-event__auto-settle">
                <div className="cricket-event__auto-title">
                  "{eventName.split('/')[0]?.trim()}" Match Auto Settle
                </div>
                <button type="button" className="cricket-event__auto-toggle">
                  <span className="cricket-event__auto-toggle-label">On</span>
                  <span className="cricket-event__auto-toggle-knob" />
                </button>
              </div>

              <div className="cricket-event__actions">
                <button type="button" className="cricket-event__btn">
                  Get Missing Fancy
                </button>
                <button type="button" className="cricket-event__btn">
                  Unsettled Bets
                </button>
                <button type="button" className="cricket-event__btn">
                  Refresh
                </button>
              </div>

              <div className="cricket-event__markets">
                {markets.map((market) => (
                  <div
                    key={market.marketId}
                    className="cricket-event__market-card"
                  >
                    <div className="cricket-event__market-header">
                      <span className="cricket-event__market-name">
                        "{eventName.split('/')[0]?.trim()}" {market.marketName}
                      </span>
                    </div>

                    <div className="cricket-event__table">
                      <div className="cricket-event__table-row cricket-event__table-row--head">
                        <span>S.No.</span>
                        <span>Result</span>
                        <span>Action</span>
                      </div>

                      <div className="cricket-event__table-row">
                        <span>1</span>
                        <span>
                          <select className="cricket-event__select">
                            {market.selections?.map((sel) => (
                              <option
                                key={sel.selectionId}
                                value={sel.selectionId}
                              >
                                {sel.selectionName}
                              </option>
                            ))}
                          </select>
                        </span>
                        <span>
                          <button
                            type="button"
                            className="cricket-event__save-btn"
                          >
                            Save
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default CricketUnsettledEvent;

