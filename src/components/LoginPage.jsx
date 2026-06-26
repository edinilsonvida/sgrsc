import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
      if (err.code === 'auth/popup-closed-by-user') {
        setError('');
      } else {
        setError('Não foi possível entrar. Verifique os pop-ups e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, #072d60 0%, #0B3A75 55%, #0d4085 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        padding: '48px 40px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
        maxWidth: 400,
        width: '90%',
        textAlign: 'center',
      }}>
        <div style={{
          width: 68, height: 68,
          background: 'linear-gradient(135deg,#0B3A75,#1351b4)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 4px 16px rgba(19,81,180,0.35)',
        }}>
          <i className="fas fa-medal" style={{ color: '#fff', fontSize: 30 }} />
        </div>

        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0B3A75', marginBottom: 6 }}>
          Memorial RSC — SGRSC
        </h1>
        <p style={{ color: '#555', marginBottom: 32, fontSize: '0.9rem', lineHeight: 1.5 }}>
          Faça login para acessar, salvar e continuar o seu memorial de qualquer lugar.
        </p>

        {error && (
          <div className="br-message danger mb-4" style={{ textAlign: 'left', borderRadius: 8 }}>
            <div className="content"><p>{error}</p></div>
          </div>
        )}

        <button
          type="button"
          className="br-button primary"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 20px',
            fontSize: '0.95rem',
            borderRadius: 10,
          }}
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading
            ? <><i className="fas fa-spinner fa-spin" /> Entrando...</>
            : <><i className="fab fa-google" /> Entrar com Google</>
          }
        </button>

        <p style={{ color: '#aaa', fontSize: '0.75rem', marginTop: 24 }}>
          Seus dados ficam salvos apenas neste navegador.
        </p>
        <p style={{ fontSize: '0.72rem', marginTop: 10, color: '#bbb' }}>
          Ao entrar, você concorda com os{' '}
          <a href="/termos.html" target="_blank" rel="noopener noreferrer" style={{ color: '#7fa8e8' }}>Termos de Serviço</a>
          {' '}e a{' '}
          <a href="/privacidade.html" target="_blank" rel="noopener noreferrer" style={{ color: '#7fa8e8' }}>Política de Privacidade</a>.
        </p>
      </div>

      <div style={{ marginTop: 28, color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
        IFSC · CPPD · Sistema de Geração de Memorial RSC
      </div>
    </div>
  );
}
