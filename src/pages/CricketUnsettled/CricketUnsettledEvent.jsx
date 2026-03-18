import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './CricketUnsettled.css';
import {
  useGetCricketUnsettledEventQuery,
  useSetEventOpenMutation,
  useGetMissingFancyMutation,
  useSettleMatchOddsMutation,
  useSettleTosMarketMutation,
  useSettleBookmakerFancyMutation,
  useSettleFancyMutation,
  useCancelMarketMutation,
} from '../../features/cricket/cricketAPI';

function CricketUnsettledEvent() {
  const { eventId } = useParams();
  const { data, isLoading, isError, refetch, isFetching } = useGetCricketUnsettledEventQuery(eventId);
  const markets = data?.data || [];

  const [selectedByMarket, setSelectedByMarket] = React.useState({});
  const [manualValues, setManualValues] = React.useState({});
  const [exchangeReportModal, setExchangeReportModal] = React.useState(null);
  const [savingMarketId, setSavingMarketId] = React.useState(null);
  const [openEvent, setOpenEvent] = React.useState(true);
  const [showUnsettledOnly, setShowUnsettledOnly] = React.useState(false);
  const [setEventOpen] = useSetEventOpenMutation();
  const [getMissingFancy, { isLoading: isMissingFancyLoading }] = useGetMissingFancyMutation();
  const [settleMatchOdds] = useSettleMatchOddsMutation();
  const [settleTosMarket] = useSettleTosMarketMutation();
  const [settleBookmakerFancy] = useSettleBookmakerFancyMutation();
  const [settleFancy] = useSettleFancyMutation();
  const [cancelMarket] = useCancelMarketMutation();

  const visibleMarkets = React.useMemo(
    () => (showUnsettledOnly ? markets.filter((m) => m.settled === false) : markets),
    [markets, showUnsettledOnly],
  );

  const visibleSettleableMarkets = React.useMemo(
    () =>
      visibleMarkets.filter((m) =>
        ['Match Odds', 'Bookmaker','MATCH_ODDS','BOOKMAKER','fancy1'].includes(m.marketName),
      ),
    [visibleMarkets],
  );

  const manualEntryRows = React.useMemo(() => {
    const manualMarkets = markets.filter((m) => ['Normal', 'oddeven'].includes(m.marketName));
    return manualMarkets.flatMap((m) => {
      const fromSection = Array.isArray(m.section) && m.section.length > 0;
      const rows = fromSection ? m.section : m.selections || [];

      return rows.map((row) => ({
        marketId: m.marketId,
        marketName: m.marketName,
        selectionId: fromSection ? row.sid : row.selectionId,
        selectionName: fromSection ? row.nat : row.selectionName,
        issettle: fromSection ? false : Boolean(row.issettle),
      }));
    });
  }, [markets]);

  const eventName = markets[0]?.eventName || '';

  const handleGetMissingFancy = async () => {
    try {
      await getMissingFancy(eventId).unwrap();
      await refetch();
      alert('Missing fancy data updated.');
    } catch (err) {
      alert('Failed to get missing fancy. Please try again.');
      console.error(err);
    }
  };

  const handleToggleUnsettledFilter = () => {
    setShowUnsettledOnly((prev) => !prev);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSelectionChange = (marketId, selectionId) => {
    setSelectedByMarket((prev) => ({
      ...prev,
      [marketId]: selectionId,
    }));
  };

  const handleManualValueChange = (selectionId, value) => {
    setManualValues((prev) => ({ ...prev, [selectionId]: value }));
  };

  const handleManualCancel = async (row) => {
    try {
      const result = await cancelMarket({
        marketType: 'fancy',
        eventId,
        marketId: row.marketId,
        selectionId: row.selectionId,
        reason: 'section cancelled',
      }).unwrap();

      const message =
        result?.data?.message ??
        (result?.success ? 'Selection cancelled successfully.' : 'Cancel failed.');
      // eslint-disable-next-line no-alert
      alert(message);

      setManualValues((prev) => ({ ...prev, [row.selectionId]: '' }));
      await refetch();
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to cancel selection. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Cancel selection error', error);
    }
  };

  const handleManualSave = async (row) => {
    const rawValue = manualValues[row.selectionId];
    const finalValue = Number(rawValue);

    if (!Number.isFinite(finalValue)) {
      // eslint-disable-next-line no-alert
      alert('Please enter a valid numeric value.');
      return;
    }

    try {
      const result = await settleFancy({
        eventId,
        marketId: row.marketId,
        selectionId: row.selectionId,
        finalValue,
      }).unwrap();

      const message =
        result?.data?.message ??
        (result?.success ? 'Fancy market settled successfully.' : 'Settlement failed.');
      // eslint-disable-next-line no-alert
      alert(message);
      await refetch();
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to settle fancy. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Settle fancy error', error);
    }
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
      let result;

      if (market.marketName === 'fancy1') {
        result = await settleTosMarket({
          marketType: 'tos_market',
          eventId,
          marketId: market.marketId,
          winnerSelectionId,
        }).unwrap();
      } else if (market.marketName === 'Bookmaker') {
        result = await settleBookmakerFancy({
          marketType: 'bookmakers_fancy',
          eventId,
          marketId: market.marketId,
          winnerSelectionId,
        }).unwrap();
      } else {
        result = await settleMatchOdds({
          marketType: 'match_odds',
          eventId,
          marketId: market.marketId,
          winnerSelectionId,
          winnerSelectionName,
          marketName: market.marketName,
        }).unwrap();
      }

      const message =
        result?.data?.[0]?.data?.message ??
        (result?.success
          ? market.marketName === 'Bookmaker'
            ? 'Bookmaker market settled successfully.'
            : 'Market settled successfully.'
          : 'Settlement failed.');
      // eslint-disable-next-line no-alert
      alert(message);
      await refetch();
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to settle market. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Settle market error', error);
    } finally {
      setSavingMarketId(null);
    }
  };

  const handleShowExchangeReport = (market) => {
    const reports = market.exchange_report || [];
    if (!reports.length) return;
    setExchangeReportModal({ marketName: market.marketName, reports });
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
      // eslint-disable-next-line no-alert
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
                  onClick={handleGetMissingFancy}
                  disabled={isMissingFancyLoading}
                >
                  {isMissingFancyLoading ? 'Loading...' : 'Get Missing Fancy'}
                </button>
                <button
                  type="button"
                  className={`cricket-event__btn ${showUnsettledOnly ? 'cricket-event__btn--active' : ''}`}
                  onClick={handleToggleUnsettledFilter}
                >
                  {showUnsettledOnly ? 'Show All Bets' : 'Show Unsettled Bets'}
                </button>
                <button
                  type="button"
                  className="cricket-event__btn"
                  onClick={handleRefresh}
                  disabled={isFetching}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div className="cricket-event__markets">
                {visibleSettleableMarkets.map((market) => (
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

              <section className="cricket-event__manual-result">
                <div className="cricket-event__manual-header">
                  <h2 className="cricket-event__manual-title">Manual Result Entry</h2>
                  <p className="cricket-event__manual-subtitle">
                    Use this section to manually record a final result when required by operations.
                  </p>
                </div>

                <div className="cricket-event__market-card cricket-event__market-card--full">
                  <div className="cricket-event__table-scroll">
                    <table className="cricket-event__table cricket-event__table--full cricket-event__table--grid">
                      <thead>
                        <tr className="cricket-event__table-row cricket-event__table-row--head">
                          <th>S.No.</th>
                          <th>Runners</th>
                          <th>Input</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manualEntryRows.length === 0 ? (
                          <tr className="cricket-event__table-row">
                            <td colSpan={4} className="cricket-event__empty">
                              No Normal / Odd-Even selections found for manual entry.
                            </td>
                          </tr>
                        ) : (
                          manualEntryRows.map((row, idx) => (
                            <tr
                              key={`${row.marketId}-${row.selectionId}`}
                              className="cricket-event__table-row mb-2"
                            >
                              <td>{idx + 1}</td>
                              <td>{row.selectionName}</td>
                              <td>
                                <input
                                  type="text"
                                  className="cricket-event__input"
                                  placeholder="value"
                                  value={manualValues[row.selectionId] ?? ''}
                                  disabled={row.issettle}
                                  onChange={(e) =>
                                    handleManualValueChange(row.selectionId, e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <div className="cricket-event__manual-actions">
                                  <button
                                    type="button"
                                    className="cricket-event__save-btn"
                                    onClick={() => handleManualSave(row)}
                                    disabled={row.issettle}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="cricket-event__cancel-btn"
                                    onClick={() => handleManualCancel(row)}
                                    disabled={row.issettle}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="cricket-event__manual-hint">
                    Manual result entry will be enabled once this workflow is fully configured.
                  </p>
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default CricketUnsettledEvent;

