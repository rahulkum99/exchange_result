import './StatusPill.css';

const map = {
  finished: { label: 'FINISHED', tone: 'muted' },
  inplay: { label: 'GOING IN-PLAY', tone: 'ok' },
  upcoming: { label: 'UPCOMING', tone: 'warn' },
  active: { label: 'ACTIVE', tone: 'ok' },
  suspended: { label: 'SUSPENDED', tone: 'bad' },
  pending: { label: 'PENDING', tone: 'warn' },
  ready: { label: 'READY', tone: 'ok' },
  finalized: { label: 'FINALIZED', tone: 'muted' },
};

const StatusPill = ({ value }) => {
  const conf = map[value] || { label: String(value || ''), tone: 'muted' };
  return <span className={`statusPill statusPill--${conf.tone}`}>{conf.label}</span>;
};

export default StatusPill;

