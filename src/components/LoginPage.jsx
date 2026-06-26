import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const FEATURES = [
  { icon: 'fa-tasks',         text: 'Lance comprovantes por critério RSC com cálculo automático de pontuação' },
  { icon: 'fa-file-pdf',      text: 'Gere o memorial em PDF unificado com todos os documentos anexados' },
  { icon: 'fa-table',         text: 'Exporte a planilha oficial de avaliação (XLSX) para a comissão' },
  { icon: 'fa-save',          text: 'Salva o progresso automaticamente no seu navegador — sem perder dados' },
  { icon: 'fa-file-export',   text: 'Exporte e importe o memorial em JSON para continuar em outro dispositivo' },
];

export default function LoginPage() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn();
    } catch (err) {
      const msgs = {
        'auth/popup-blocked':
          'O pop-up foi bloqueado pelo navegador. Clique no ícone de pop-up bloqueado na barra de endereço e permita para este site.',
        'auth/popup-closed-by-user': '',
        'auth/cancelled-popup-request': '',
        'auth/unauthorized-domain':
          'Este domínio não está autorizado no Firebase. Acesse o Firebase Console → Authentication → Settings → Authorized domains e adicione o domínio atual.',
        'auth/operation-not-allowed':
          'O login com Google não está ativado. Acesse o Firebase Console → Authentication → Sign-in method e ative o Google.',
        'auth/network-request-failed':
          'Sem conexão com a internet. Verifique sua rede e tente novamente.',
        'auth/internal-error':
          'Erro interno do Firebase. Verifique se o domínio está na lista de domínios autorizados no Firebase Console.',
      };
      const msg = msgs[err.code];
      if (msg === undefined) {
        setError(`Erro ao entrar (${err.code || 'desconhecido'}). Tente novamente.`);
      } else if (msg) {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #072d60 0%, #0B3A75 55%, #0d4085 100%)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ borderBottom: '3px solid #1C7C3B', padding: '16px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="/logo-cppd.png" alt="Logo IFSC CPPD" style={{ height: 41, filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>SGRSC — Sistema de Geração de Memorial RSC</div>
            <div style={{ color: '#a8c4f0', fontSize: '0.75rem' }}>Instituto Federal de Santa Catarina · CPPD</div>
          </div>
          <span style={{ marginLeft: 'auto', background: 'rgba(28,124,59,0.22)', border: '1px solid rgba(28,124,59,0.55)', color: '#7ee8a2', borderRadius: 20, padding: '4px 13px', fontSize: '0.73rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            <i className="fas fa-university" style={{ marginRight: 5 }} />IFSC · CPPD
          </span>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '48px 24px', display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Left — app description */}
        <div style={{ flex: '1 1 380px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(28,124,59,0.2)', border: '1px solid rgba(28,124,59,0.4)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
            <i className="fas fa-medal" style={{ color: '#7ee8a2', fontSize: '0.8rem' }} />
            <span style={{ color: '#7ee8a2', fontSize: '0.78rem', fontWeight: 600 }}>Ferramenta oficial IFSC/CPPD</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
            Monte seu Memorial RSC com facilidade
          </h1>

          <p style={{ color: '#c0d6f5', fontSize: '0.97rem', lineHeight: 1.65, marginBottom: 28 }}>
            O <strong style={{ color: '#fff' }}>SGRSC</strong> é a ferramenta do IFSC para servidores docentes organizarem seus comprovantes,
            calcularem a pontuação estimada e gerarem o memorial e a planilha oficial para o processo de
            <strong style={{ color: '#fff' }}> Reconhecimento de Saberes e Competências (RSC)</strong>, conforme a Resolução Consup nº&nbsp;29/2014.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map(f => (
              <li key={f.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <i className={`fas ${f.icon}`} style={{ color: '#7ee8a2', fontSize: '0.85rem' }} />
                </span>
                <span style={{ color: '#c0d6f5', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Data transparency */}
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-shield-alt" style={{ color: '#7ee8a2' }} /> Por que solicitamos acesso à sua conta Google?
            </div>
            <p style={{ color: '#aac4f5', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
              Usamos o login com Google <strong style={{ color: '#c0d6f5' }}>exclusivamente para identificar você</strong> e separar seus dados dos
              demais usuários neste dispositivo. Solicitamos apenas <strong style={{ color: '#c0d6f5' }}>nome, e-mail e foto de perfil</strong>.
              <br /><br />
              <strong style={{ color: '#c0d6f5' }}>Nenhuma informação do formulário ou arquivo anexado é enviada a servidores externos.</strong>
              Todo o processamento ocorre localmente no seu navegador.
            </p>
          </div>
        </div>

        {/* Right — login card */}
        <div style={{ flex: '0 1 360px', minWidth: 300 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.28)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#0B3A75,#1351b4)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 4px 16px rgba(19,81,180,0.3)' }}>
              <i className="fas fa-medal" style={{ color: '#fff', fontSize: 28 }} />
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0B3A75', marginBottom: 6 }}>Acessar o SGRSC</h2>
            <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 28 }}>
              Entre com sua conta Google para acessar, salvar e continuar seu memorial.
            </p>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, textAlign: 'left', fontSize: '0.85rem', color: '#b91c1c' }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: 6 }} />{error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '13px 20px', fontSize: '0.95rem', fontWeight: 600, background: loading ? '#6b8fc7' : '#1351b4', color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#0d3d8a'; }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#1351b4'; }}
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> Entrando...</>
                : <><i className="fab fa-google" /> Entrar com Google</>
              }
            </button>

            <div style={{ margin: '20px 0', borderTop: '1px solid #eef0f5' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: 'fa-lock', text: 'Dados salvos só no seu navegador' },
                { icon: 'fa-user-shield', text: 'Nenhum arquivo enviado a servidores' },
                { icon: 'fa-file-export', text: 'Exporte seus dados a qualquer momento' },
              ].map(item => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#555' }}>
                  <i className={`fas ${item.icon}`} style={{ color: '#1C7C3B', width: 14, textAlign: 'center' }} />
                  {item.text}
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.71rem', marginTop: 20, color: '#bbb', lineHeight: 1.5 }}>
              Ao entrar, você concorda com os{' '}
              <a href="/termos.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1351b4' }}>Termos de Serviço</a>
              {' '}e a{' '}
              <a href="/privacidade.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1351b4' }}>Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem', margin: 0 }}>
          &copy; {new Date().getFullYear()} Instituto Federal de Santa Catarina (IFSC) · Todos os direitos reservados ·{' '}
          <a href="/privacidade.html" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)' }}>Política de Privacidade</a>
          {' · '}
          <a href="/termos.html" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)' }}>Termos de Serviço</a>
        </p>
      </footer>

    </div>
  );
}
