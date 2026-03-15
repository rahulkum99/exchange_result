import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../CricketUnsettled/CricketUnsettled.css';
import {
  useGetTennisUnsettledEventQuery,
  useSetTennisEventOpenMutation,
  useSetTennisSettleMatchOddsMutation,
} from '../../features/tennis/tennisAPI';

function TennisUnsettledEvent() {
  const { eventId } = useParams();
  const { data, isLoading, isError, refetch, isFetching } = useGetTennisUnsettledEventQuery(eventId);
  const markets = data?.data || [];

  const eventName = markets[0]?.eventName || data?.eventName || `Event ${eventId}`;
  const getMarketName = (market) =>
    market.marketName || `Market ${market.marketId}`;

  const [selectedByMarket, setSelectedByMarket] = React.useState({});
  const [exchangeReportModal, setExchangeReportModal] = React.useState(null);
  const [savingMarketId, setSavingMarketId] = React.useState(null);
  const [openEvent, setOpenEvent] = React.useState(true);
  const [setEventOpen] = useSetTennisEventOpenMutation();
  const [settleMatchOdds] = useSetTennisSettleMatchOddsMutation();

  const handleSelectionChange = (marketId, selectionId) => {
    setSelectedByMarket((prev) => ({
      ...prev,
      [marketId]: selectionId,
    }));
  };

  const handleSave = async (market) => {
    const winnerSelectionId =
      selectedByMarket[market.marketId] ||
      market.section?.[0]?.sid ||
      market.selections?.[0]?.selectionId;

    if (!winnerSelectionId) return;

    setSavingMarketId(market.marketId);
    const winnerSelectionName =
      market.section?.find((s) => s.sid === winnerSelectionId)?.nat ||
      market.selections?.find((s) => s.selectionId === winnerSelectionId)
        ?.selectionName ||
      '';

    try {
      const result = await settleMatchOdds({
        marketType: 'match_odds',
        eventId,
        marketId: market.marketId,
        winnerSelectionId,
        winnerSelectionName,
        marketName: market.marketName || 'MATCH_ODDS',
      }).unwrap();

      const message =
        result?.data?.[0]?.data?.message ??
        (result?.success ? 'Market settled successfully.' : 'Settlement failed.');
      alert(message);
      await refetch();
    } catch (error) {
      alert('Failed to settle match odds. Please try again.');
      console.error('Settle match odds error', error);
    } finally {
      setSavingMarketId(null);
    }
  };

  const handleShowExchangeReport = (market) => {
    const reports = market.exchange_report || [];
    if (!reports.length) return;
    setExchangeReportModal({
      marketName: market.marketName || getMarketName(market),
      reports,
    });
  };

  React.useEffect(() => {
    if (markets.length > 0 && markets[0].inplay != null) {
      setOpenEvent(Boolean(markets[0].inplay));
    }
  }, [markets]);

  const handleAutoToggle = async () => {
    const next = !openEvent;
    try {
      await setEventOpen({ eventId, openEvent: next }).unwrap();
      setOpenEvent(next);
    } catch (err) {
      alert('Failed to update auto settle. Please try again.');
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (!exchangeReportModal) return;
    const onEscape = (e) => {
      if (e.key === 'Escape') setExchangeReportModal(null);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [exchangeReportModal]);

  return (
    <>
      {exchangeReportModal && (
        <div
          className="cricket-event__modal-overlay"
          onClick={() => setExchangeReportModal(null)}
          role="presentation"
        >
          <div
            className="cricket-event__modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exchange-report-title"
            tabIndex={-1}
          >
            <div className="cricket-event__modal-header">
              <h2 id="exchange-report-title" className="cricket-event__modal-title">
                Exchange report — {exchangeReportModal.marketName}
              </h2>
              <button
                type="button"
                className="cricket-event__modal-close"
                onClick={() => setExchangeReportModal(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="cricket-event__modal-body">
              {exchangeReportModal.reports.map((rep, i) => (
                <div key={rep._id || i} className="cricket-event__modal-row">
                  <span className="cricket-event__modal-exchange">{rep.exchangeKey}</span>
                  <span className="cricket-event__modal-message">
                    {rep.data?.message ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Navbar />
      <main className="cricket-page">
        <header className="cricket-page__header">
          <h1 className="cricket-page__title">Tennis</h1>
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
                  {eventName.includes('/') ? eventName.split('/')[0]?.trim() : eventName}
                </div>
                <div className="cricket-event__date">
                  {eventName.includes('/') ? eventName.split('/')[1]?.trim() : ''}
                </div>
              </div>

              <div className="cricket-event__auto-settle">
                <div className="cricket-event__auto-title">
                  &quot;{eventName.includes('/') ? eventName.split('/')[0]?.trim() : eventName}&quot; Match Auto Settle
                </div>
                <button
                  type="button"
                  className={`cricket-event__auto-toggle ${openEvent ? 'cricket-event__auto-toggle--on' : 'cricket-event__auto-toggle--off'}`}
                  onClick={handleAutoToggle}
                >
                  <span className="cricket-event__auto-toggle-label">
                    {openEvent ? 'On' : 'Off'}
                  </span>
                  <span className="cricket-event__auto-toggle-knob" />
                </button>
              </div>

              <div className="cricket-event__actions">
                <button
                  type="button"
                  className="cricket-event__btn"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div className="cricket-event__markets">
                {markets.length === 0 && (
                  <div className="cricket-page__state">
                    No markets for this event.
                  </div>
                )}
                {markets.map((market) => (
                  <div
                    key={market.marketId}
                    className="cricket-event__market-card"
                  >
                    <div className="cricket-event__market-header">
                      <span className="cricket-event__market-name">
                        &quot;{eventName.includes('/') ? eventName.split('/')[0]?.trim() : eventName}&quot; {getMarketName(market)}
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
                          <select
                            className="cricket-event__select"
                            disabled={market.settled}
                            value={
                              selectedByMarket[market.marketId] ||
                              market.section?.[0]?.sid ||
                              market.selections?.[0]?.selectionId ||
                              ''
                            }
                            onChange={(e) =>
                              handleSelectionChange(market.marketId, e.target.value)
                            }
                          >
                            {market.section && market.section.length > 0
                              ? market.section.map((sec) => (
                                  <option key={sec.sid} value={sec.sid}>
                                    {sec.nat}
                                  </option>
                                ))
                              : market.selections?.map((sel) => (
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
                          {market.settled ? (
                            <>
                              <button
                                type="button"
                                className="cricket-event__save-btn"
                                disabled
                              >
                                Settled
                              </button>
                              {market.exchange_report?.length > 0 && (
                                <button
                                  type="button"
                                  className="cricket-event__info-btn"
                                  onClick={() => handleShowExchangeReport(market)}
                                >
                                  i
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              className="cricket-event__save-btn"
                              onClick={() => handleSave(market)}
                              disabled={savingMarketId === market.marketId}
                            >
                              {savingMarketId === market.marketId ? 'Saving...' : 'Save'}
                            </button>
                          )}
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

export default TennisUnsettledEvent;
