import { useEffect, useState } from 'react';

export default function LibErrorBanner() {
  const [missing, setMissing] = useState([]);

  useEffect(() => {
    const check = () => {
      const m = [];
      if (typeof window.jspdf === 'undefined') m.push('jsPDF');
      if (typeof window.PDFLib === 'undefined') m.push('pdf-lib');
      if (typeof window.saveAs === 'undefined') m.push('FileSaver');
      if (typeof window.XLSX === 'undefined') m.push('SheetJS');
      setMissing(m);
    };
    if (document.readyState === 'complete') check();
    else window.addEventListener('load', check);
    return () => window.removeEventListener('load', check);
  }, []);

  if (missing.length === 0) return null;

  return (
    <div style={{ display: 'flex', background: '#7d1a1a', color: '#fff', padding: '14px 20px', alignItems: 'center', gap: 12, fontSize: '0.9rem', position: 'sticky', top: 0, zIndex: 9999, flexWrap: 'wrap' }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: '1.2rem', flexShrink: 0 }} />
      <div>
        <strong>Atenção:</strong> As bibliotecas <strong>{missing.join(', ')}</strong> não foram carregadas.
        Verifique sua conexão com a Internet e recarregue a página.
      </div>
    </div>
  );
}
