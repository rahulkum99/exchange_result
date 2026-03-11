import { useMemo, useState } from 'react';
import './Settlement.css';
import StatusPill from '../../components/StatusPill/StatusPill.jsx';
import { mockActions } from '../../services/mock/mockApi.js';
import { useMockStore } from '../../services/mock/useMockStore.js';

const Settlement = () => {
  const { matches, settlements } = useMockStore((s) => ({
    matches: s.matches,
    settlements: s.settlements,
  }));

  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [result, setResult] = useState('');

  const queue = useMemo(() => {
    return settlements
      .map((st) => ({
        ...st,
        match: matches.find((m) => m.id === st.matchId) || null,
      }))
      .filter((x) => x.match);
  }, [matches, settlements]);

  const selected = useMemo(() => queue.find((q) => q.matchId === selectedMatchId) || null, [queue, selectedMatchId]);

  return (
    <div className="settle">
      <div className="settle__top">
        <div>
          <h2 className="settle__title">Game Settlement</h2>
          <p className="settle__sub">Pick a match, set result, and finalize</p>
        </div>
      </div>

      <div className="settle__grid">
        <section className="settlePanel">
          <div className="settlePanel__head">
            <div className="settlePanel__title">Settlement queue</div>
            <div className="settlePanel__meta">{queue.length} matches</div>
          </div>

          <div className="settleList">
            {queue.map((q) => (
              <button
                key={q.matchId}
                type="button"
                className={q.matchId === selectedMatchId ? 'settleItem settleItem--active' : 'settleItem'}
                onClick={() => {
                  setSelectedMatchId(q.matchId);
                  setResult(q.result || '');
                }}
              >
                <div className="settleItem__row">
                  <div className="settleItem__name">{q.match.name}</div>
                  <StatusPill value={q.status} />
                </div>
                <div className="settleItem__meta">{q.match.startTime}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="settlePanel">
          <div className="settlePanel__head">
            <div className="settlePanel__title">Settlement form</div>
            <div className="settlePanel__meta">{selected ? selected.match.name : 'Select a match'}</div>
          </div>

          {!selected ? (
            <div className="settleEmpty">Select a match from the queue.</div>
          ) : (
            <div className="settleForm">
              <label className="settleLabel">
                Result
                <input
                  className="settleInput"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="e.g. Bundelkhand Bulls won"
                />
              </label>

              <div className="settleSummary">
                <div className="settleSummary__row">
                  <span>Profit (demo)</span>
                  <strong>₹ 2,150</strong>
                </div>
                <div className="settleSummary__row">
                  <span>Loss (demo)</span>
                  <strong>₹ 900</strong>
                </div>
              </div>

              <div className="settleActions">
                <button
                  type="button"
                  className="settleBtn"
                  onClick={() => mockActions.setSettlementResult(selected.matchId, result || 'Result set')}
                  disabled={selected.finalized}
                >
                  Save result
                </button>
                <button
                  type="button"
                  className="settleBtn settleBtn--primary"
                  onClick={() => mockActions.finalizeSettlement(selected.matchId)}
                  disabled={!result || selected.finalized}
                >
                  Finalize
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settlement;

