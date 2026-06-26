import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ text }) {
  const [pos, setPos]   = useState(null);
  const btnRef          = useRef(null);

  const open = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({
      bottom: window.innerHeight - r.top + 8,
      left:   r.left + r.width / 2,
    });
  };

  const close = () => setPos(null);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: 5 }}>
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={open}
        onMouseLeave={close}
        onClick={e => { e.stopPropagation(); pos ? close() : open(); }}
        aria-label="Ajuda sobre este campo"
        style={{
          width: 15, height: 15, borderRadius: '50%',
          border: '1.5px solid #1351b4', background: '#e8f0fe',
          color: '#1351b4', fontSize: '0.60rem', fontWeight: 800,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
          justifyContent: 'center', padding: 0, lineHeight: 1, flexShrink: 0,
        }}
      >
        ?
      </button>

      {pos && createPortal(
        <span
          role="tooltip"
          style={{
            position: 'fixed',
            bottom: pos.bottom,
            left: pos.left,
            transform: 'translateX(-40%)',
            minWidth: 220, maxWidth: 280,
            background: '#1a2e50', color: '#fff',
            fontSize: '0.76rem', lineHeight: 1.6, fontWeight: 400,
            borderRadius: 7, padding: '9px 12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.30)', zIndex: 99999,
            pointerEvents: 'none', whiteSpace: 'normal',
          }}
        >
          {text}
          <span style={{
            position: 'absolute', top: '100%', left: '40%',
            border: '6px solid transparent',
            borderTopColor: '#1a2e50',
            display: 'block', width: 0, height: 0,
          }} />
        </span>,
        document.body
      )}
    </span>
  );
}
