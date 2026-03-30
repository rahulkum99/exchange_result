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
  const [publishByMarketId, setPublishByMarketId] = React.useState({});
  const [publishBySelectionId, setPublishBySelectionId] = React.useState({});
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
      const isOddEven = m.marketName === 'oddeven';

      // For oddeven markets with no selections/section, synthesise Odd & Even rows
      const fromSection = Array.isArray(m.section) && m.section.length > 0;
      const hasSelections = Array.isArray(m.selections) && m.selections.length > 0;

      if (isOddEven && !fromSection && !hasSelections) {
        return [
          {
            marketId: m.marketId,
            marketName: m.marketName,
            selectionId: `${m.marketId}_odd`,
            selectionName: 'Odd',
            issettle: Boolean(m.settled),
            published: Boolean(m.published),
            finalValue: m.finalValue ?? '',
            isOddEven: true,
          },
          {
            marketId: m.marketId,
            marketName: m.marketName,
            selectionId: `${m.marketId}_even`,
            selectionName: 'Even',
            issettle: Boolean(m.settled),
            published: Boolean(m.published),
            finalValue: m.finalValue ?? '',
            isOddEven: true,
          },
        ];
      }

      const rows = fromSection ? m.section : m.selections || [];
      return rows.map((row) => ({
        marketId: m.marketId,
        marketName: m.marketName,
        selectionId: fromSection ? (row.selectionId ?? row.sid) : row.selectionId,
        selectionName: fromSection ? row.nat : row.selectionName,
        issettle: Boolean(row.issettle),
        published: Boolean(fromSection ? row.published : m.published),
        finalValue: fromSection ? (row.finalValue ?? '') : (m.finalValue ?? ''),
        isOddEven,
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
    const finalValueStr = String(rawValue ?? '').trim();
    const finalValueNum = Number(finalValueStr);
    const publish = Boolean(publishBySelectionId[row.selectionId]);

    if (!Number.isFinite(finalValueNum)) {
      // eslint-disable-next-line no-alert
      alert('Please enter a valid numeric value.');
      return;
    }

    try {
      const result = await settleFancy({
        eventId,
        marketId: row.marketId,
        selectionId: row.selectionId,
        finalValue: finalValueStr,
        publish,
      }).unwrap();

      const message =
        result?.data?.message ??
        (result?.success ? 'Fancy market settled successfully.' : 'Settlement failed.');
      // eslint-disable-next-line no-alert
      alert(message);
      setPublishBySelectionId((prev) => ({ ...prev, [row.selectionId]: false }));
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
    const publish = Boolean(publishByMarketId[market.marketId]);

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
          eventId,
          marketId: market.marketId,
          winnerSelectionId,
          publish,
        }).unwrap();
      } else if (market.marketName === 'Bookmaker') {
        result = await settleBookmakerFancy({
          eventId,
          marketId: market.marketId,
          winnerSelectionId,
          publish,
        }).unwrap();
      } else {
        result = await settleMatchOdds({
          marketType: 'match_odds',
          eventId,
          marketId: market.marketId,
          winnerSelectionId,
          winnerSelectionName,
          marketName: market.marketName,
          publish,
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
      setPublishByMarketId((prev) => ({ ...prev, [market.marketId]: false }));
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
                            disabled={Boolean(market.published)}
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
                          <button
                            type="button"
                            className="cricket-event__save-btn"
                            onClick={() => handleSave(market)}
                            disabled={Boolean(market.published) || savingMarketId === market.marketId}
                          >
                            {savingMarketId === market.marketId
                              ? publishByMarketId[market.marketId]
                                ? 'Publishing...'
                                : market.settled
                                  ? 'Editing...'
                                  : 'Saving...'
                              : Boolean(market.published)
                                ? 'Published'
                                : publishByMarketId[market.marketId]
                                  ? 'Publish'
                                  : market.settled
                                    ? 'Edit'
                                    : 'Save'}
                          </button>
                          <input
                            type="checkbox"
                            className="cricket-event__check-box"
                            disabled={Boolean(market.published)}
                            checked={Boolean(publishByMarketId[market.marketId])}
                            onChange={(e) =>
                              setPublishByMarketId((prev) => ({
                                ...prev,
                                [market.marketId]: e.target.checked,
                              }))
                            }
                            aria-label="publish"
                            title="Publish"
                          />
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
                          <th>Market</th>
                          <th>Runners</th>
                          <th>Input</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manualEntryRows.length === 0 ? (
                          <tr className="cricket-event__table-row">
                            <td colSpan={5} className="cricket-event__empty">
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
                              <td>
                                <span className={`cricket-event__market-badge cricket-event__market-badge--${row.marketName === 'oddeven' ? 'oddeven' : 'normal'}`}>
                                  {row.marketName === 'oddeven' ? 'Odd-Even' : 'Normal'}
                                </span>
                              </td>
                              <td>{row.selectionName}</td>
                              <td>
                                <input
                                  type="text"
                                  className="cricket-event__input"
                                  placeholder="value"
                                  value={manualValues[row.selectionId] ?? row.finalValue ?? ''}
                                  disabled={Boolean(row.published)}
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
                                    disabled={Boolean(row.published)}
                                  >
                                    {row.published
                                      ? 'Published'
                                      : publishBySelectionId[row.selectionId]
                                        ? 'Publish'
                                        : row.issettle
                                          ? 'Edit'
                                          : 'Save'}
                                  </button>
                                  <button
                                    type="button"
                                    className="cricket-event__cancel-btn"
                                    onClick={() => handleManualCancel(row)}
                                    disabled={Boolean(row.published)}
                                  >
                                    Cancel
                                  </button>

                                  <input
                                    type="checkbox"
                                    className="cricket-event__check-box"
                                    disabled={Boolean(row.published)}
                                    checked={Boolean(publishBySelectionId[row.selectionId])}
                                    onChange={(e) =>
                                      setPublishBySelectionId((prev) => ({
                                        ...prev,
                                        [row.selectionId]: e.target.checked,
                                      }))
                                    }
                                    aria-label="publish"
                                    title="Publish"
                                  />
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

