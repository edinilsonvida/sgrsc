import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState('');
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <footer style={{ background: '#0c326f', color: '#fff', marginTop: '3rem' }}>
      <div className="container-lg py-4">
        <div className="row align-items-start">
          <div className="col-sm-3 text-center text-sm-left mb-4 mb-sm-0">
            <img
              src="/logo-ifsc.png"
              alt="Logo IFSC"
              style={{ height: 70, filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div className="col-sm-4 mb-4 mb-sm-0">
            <p className="text-weight-bold mb-1" style={{ fontSize: '0.95rem', color: '#d4e3ff' }}>Instituto Federal de Santa Catarina</p>
            <p style={{ fontSize: '0.82rem', color: '#aac4f5', marginBottom: 4 }}>Comissão Permanente de Pessoal Docente (CPPD)</p>
            <p style={{ fontSize: '0.8rem', color: '#7fa8e8', marginBottom: 4 }}>
              <i className="fas fa-map-marker-alt mr-1" /> Rua 14 de Julho, 150, Coqueiros | Florianópolis — SC
            </p>
            <p style={{ fontSize: '0.8rem', color: '#7fa8e8', marginBottom: 0 }}>
              <i className="fas fa-globe mr-1" />
              <a href="https://www.ifsc.edu.br" target="_blank" rel="noopener noreferrer" style={{ color: '#7fa8e8', textDecoration: 'underline' }}>www.ifsc.edu.br</a>
            </p>
          </div>
          <div className="col-sm-5">
            <p className="text-weight-bold mb-2" style={{ fontSize: '0.95rem', color: '#d4e3ff' }}>
              <i className="fas fa-laptop-code mr-2" />Sistema de Geração de Memorial RSC (SGRSC)
            </p>
            <p style={{ fontSize: '0.8rem', color: '#aac4f5', lineHeight: 1.5, marginBottom: 8 }}>
              Ferramenta de apoio à organização dos comprovantes e ao cálculo estimado da pontuação para RSC, conforme o Anexo III da Resolução Consup nº 29/2014 e suas retificações pelas Resoluções Consup nº 13/2017 e nº 48/2018, no âmbito do IFSC.
            </p>
            <div className="d-flex align-items-start" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '10px 12px' }}>
              <i className="fas fa-shield-alt mt-1 mr-2" style={{ color: '#76c893' }} />
              <p style={{ fontSize: '0.78rem', color: '#b8d0f5', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: '#d4e3ff' }}>Privacidade garantida:</strong> nenhuma informação inserida ou arquivo anexado é transmitida a servidores externos. Todo o processamento ocorre localmente no seu navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#071d4a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container-lg py-3">
          <div className="row align-items-center">
            <div className="col-sm-8 text-center text-sm-left mb-2 mb-sm-0">
              <p style={{ fontSize: '0.75rem', color: '#7fa8e8', margin: 0 }}>
                <i className="fas fa-info-circle mr-1" />
                Esta ferramenta tem caráter exclusivamente orientativo. A <strong style={{ color: '#aac4f5' }}>pontuação oficial</strong> é determinada pela planilha preenchida pela comissão avaliadora do IFSC.
              </p>
            </div>
            <div className="col-sm-4 text-center text-sm-right">
              <p style={{ fontSize: '0.75rem', color: '#556fa0', margin: 0 }}>
                &copy; {year} Instituto Federal de Santa Catarina (IFSC). Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
