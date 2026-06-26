import UserMenu from './UserMenu';

export default function Header({ onExport, onImport, onClear }) {
  return (
    <header style={{
      background: 'linear-gradient(160deg, #072d60 0%, #0B3A75 55%, #0d4085 100%)',
      borderBottom: '4px solid #1C7C3B',
      boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
      position: 'relative',
    }}>
      <div className="container-lg">
        <div className="d-flex align-items-center flex-wrap py-3" style={{ gap: '0 16px', minHeight: 72 }}>
          <div className="d-flex align-items-center" style={{ gap: 14 }}>
            <img
              src="/logo-cppd.png"
              alt="Logo IFSC CPPD"
              style={{ height: 45, filter: 'brightness(0) invert(1)', flexShrink: 0 }}
            />
            <div className="d-none d-sm-block" style={{ width: 1, height: 42, background: 'rgba(255,255,255,0.22)' }} />
          </div>

          <div className="flex-grow-1">
            <div style={{ color: '#fff', fontFamily: "'Rawline', sans-serif", fontWeight: 700, fontSize: '1.15rem', letterSpacing: '0.3px', lineHeight: 1.3 }}>
              Sistema de Geração de Memorial RSC (SGRSC)
            </div>
            <div style={{ color: '#a8c4f0', fontFamily: "'Rawline', sans-serif", fontSize: '0.82rem', marginTop: 3, lineHeight: 1.3 }}>
              Organize seus comprovantes e gere a planilha oficial e o PDF unificado.
            </div>
          </div>

          <div className="d-flex align-items-center" style={{ gap: 10, flexShrink: 0 }}>
            <span className="d-none d-md-inline-flex" style={{ background: 'rgba(28,124,59,0.22)', border: '1px solid rgba(28,124,59,0.55)', color: '#7ee8a2', borderRadius: 20, padding: '5px 15px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', alignItems: 'center', gap: 4 }}>
              <i className="fas fa-university mr-1" /> IFSC &nbsp;·&nbsp; CPPD
            </span>
            <UserMenu onExport={onExport} onImport={onImport} onClear={onClear} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }} />
    </header>
  );
}
