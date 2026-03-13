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

              <div className="cricket-event__markets">
                {markets.map((market) => (
                  <div
                    key={market.marketId}
                    className="cricket-event__market-card"
                  >
                    <div className="cricket-event__market-header">
                      <span className="cricket-event__market-name">
                        {market.marketName}
                      </span>
                      <span className="cricket-event__market-meta">
                        Open bets: {market.openBets} • Stake: {market.totalStake} •
                        Exposure: {market.totalExposure}
                      </span>
                    </div>

                    <div className="cricket-event__table">
                      <div className="cricket-event__table-row cricket-event__table-row--head">
                        <span>Selection</span>
                        <span>Open bets</span>
                        <span>Stake</span>
                        <span>Exposure</span>
                      </div>

                      {market.selections?.map((sel) => (
                        <div
                          className="cricket-event__table-row"
                          key={sel.selectionId}
                        >
                          <span>{sel.selectionName}</span>
                          <span>{sel.openBets}</span>
                          <span>{sel.totalStake}</span>
                          <span>{sel.totalExposure}</span>
                        </div>
                      ))}
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

