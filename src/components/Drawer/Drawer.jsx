import { useEffect } from 'react';
import './Drawer.css';

const Drawer = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div className={open ? 'drawer drawer--open' : 'drawer'} aria-hidden={!open}>
      <button className="drawer__backdrop" type="button" onClick={onClose} />
      <aside className="drawer__panel" role="dialog" aria-modal="true">
        <div className="drawer__head">
          <div className="drawer__title">{title}</div>
          <button className="drawer__close" type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="drawer__body">{children}</div>
      </aside>
    </div>
  );
};

export default Drawer;

