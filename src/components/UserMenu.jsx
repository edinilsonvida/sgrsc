import { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu({ onExport, onImport, onClear }) {
  const { user, signOut } = useAuth();
  const [open, setOpen]   = useState(false);
  const importRef         = useRef(null);

  const handleImportChange = e => {
    const file = e.target.files[0];
    if (file) onImport(file);
    e.target.value = '';
    setOpen(false);
  };

  const close = () => setOpen(false);

  const btnStyle = {
    width: '100%',
    textAlign: 'left',
    padding: '11px 18px',
    display: 'flex',
    gap: 11,
    alignItems: 'center',
    borderRadius: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.88rem',
    color: '#1a1a1a',
    transition: 'background 0.15s',
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '5px 13px', borderRadius: 24,
          border: '1.5px solid rgba(255,255,255,0.38)',
          color: '#fff', background: 'rgba(255,255,255,0.12)',
          cursor: 'pointer', fontSize: '0.86rem',
        }}
      >
        {user.photoURL
          ? <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} referrerPolicy="no-referrer" />
          : <i className="fas fa-user-circle" style={{ fontSize: 22 }} />
        }
        <span style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.displayName?.split(' ')[0] || user.email}
        </span>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'}`} style={{ fontSize: '0.65rem', opacity: 0.8 }} />
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={close}
          />
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            background: '#fff', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
            minWidth: 220, zIndex: 100, overflow: 'hidden',
          }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #eef0f5' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0B3A75' }}>
                {user.displayName}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#888', marginTop: 2 }}>
                {user.email}
              </div>
            </div>

            <button
              style={btnStyle}
              onMouseOver={e => e.currentTarget.style.background='#f2f5fb'}
              onMouseOut={e => e.currentTarget.style.background='none'}
              onClick={() => { onExport(); close(); }}
            >
              <i className="fas fa-file-export" style={{ color: '#1351b4', width: 16 }} />
              Exportar JSON
            </button>

            <button
              style={btnStyle}
              onMouseOver={e => e.currentTarget.style.background='#f2f5fb'}
              onMouseOut={e => e.currentTarget.style.background='none'}
              onClick={() => importRef.current.click()}
            >
              <i className="fas fa-file-import" style={{ color: '#1351b4', width: 16 }} />
              Importar JSON
            </button>

            <button
              style={{ ...btnStyle, color: '#b91c1c' }}
              onMouseOver={e => e.currentTarget.style.background='#fff5f5'}
              onMouseOut={e => e.currentTarget.style.background='none'}
              onClick={() => { onClear(); close(); }}
            >
              <i className="fas fa-trash-alt" style={{ color: '#b91c1c', width: 16 }} />
              Limpar tudo
            </button>

            <div style={{ borderTop: '1px solid #eef0f5' }}>
              <button
                style={{ ...btnStyle, color: '#555' }}
                onMouseOver={e => e.currentTarget.style.background='#f7f7f7'}
                onMouseOut={e => e.currentTarget.style.background='none'}
                onClick={() => { signOut(); close(); }}
              >
                <i className="fas fa-sign-out-alt" style={{ width: 16 }} />
                Sair
              </button>
            </div>
          </div>
        </>
      )}

      <input
        ref={importRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportChange}
      />
    </div>
  );
}
