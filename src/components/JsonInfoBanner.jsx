import { useState } from 'react';

const STORAGE_KEY = 'sgrsc_json_banner_dismissed';

export default function JsonInfoBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  return (
    <div role="note" className="mb-4" style={{
      background: 'linear-gradient(135deg, #e8f4fd 0%, #deeefb 100%)',
      borderRadius: 12,
      border: '1px solid #90c8f0',
      borderLeft: '5px solid #1351b4',
      padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(19,81,180,0.08)',
      position: 'relative',
    }}>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Fechar aviso"
        style={{
          position: 'absolute', top: 10, right: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#5a7aa8', fontSize: '0.85rem', lineHeight: 1, padding: 4,
        }}
      >
        <i className="fas fa-times" />
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 24 }}>
        <div style={{
          flexShrink: 0, width: 38, height: 38,
          background: '#1351b4', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="fas fa-sync-alt" style={{ color: '#fff', fontSize: '1rem' }} />
        </div>

        <div>
          <p style={{ fontWeight: 700, color: '#0B3A75', fontSize: '0.95rem', marginBottom: 6 }}>
            Salve e retome seu memorial de onde parou
          </p>
          <p style={{ color: '#1a3a6e', fontSize: '0.855rem', lineHeight: 1.65, marginBottom: 10 }}>
            Os dados são salvos automaticamente no navegador, mas ficam restritos ao dispositivo e perfil atuais.
            Para continuar o preenchimento em outro computador, navegador ou após limpar os dados do site,
            use as opções de <strong>Exportar JSON</strong> e <strong>Importar JSON</strong> disponíveis no menu do usuário{' '}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#1351b4', color: '#fff', borderRadius: 20, padding: '1px 9px', fontSize: '0.78rem', fontWeight: 600, verticalAlign: 'middle' }}>
              <i className="fas fa-user-circle" style={{ fontSize: '0.7rem' }} /> seu nome
            </span>{' '}
            no canto superior direito da tela.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fff', border: '1px solid #b8d8f5', borderRadius: 8, padding: '8px 12px', flex: '1 1 220px' }}>
              <i className="fas fa-file-export" style={{ color: '#1351b4', marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0B3A75', marginBottom: 2 }}>Exportar JSON</div>
                <div style={{ fontSize: '0.78rem', color: '#3a5a8a', lineHeight: 1.5 }}>
                  Gera um arquivo <code style={{ background: '#e8f0fe', padding: '0 4px', borderRadius: 3 }}>.json</code> com todos os seus dados e comprovantes lançados. Guarde-o como cópia de segurança.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fff', border: '1px solid #b8d8f5', borderRadius: 8, padding: '8px 12px', flex: '1 1 220px' }}>
              <i className="fas fa-file-import" style={{ color: '#1351b4', marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0B3A75', marginBottom: 2 }}>Importar JSON</div>
                <div style={{ fontSize: '0.78rem', color: '#3a5a8a', lineHeight: 1.5 }}>
                  Carrega um arquivo exportado anteriormente, restaurando todos os dados para continuar o preenchimento.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
