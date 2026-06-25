export default function AlertBanner() {
  return (
    <div role="alert" className="mb-4" style={{ background: '#fffbf0', borderRadius: 12, border: '1px solid #f0c060', borderLeft: '5px solid #e08000', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, boxShadow: '0 2px 8px rgba(200,120,0,0.08)' }}>
      <div style={{ flexShrink: 0, width: 36, height: 36, background: '#fff3cc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fas fa-exclamation-triangle" style={{ color: '#c07800', fontSize: '1rem' }} />
      </div>
      <div>
        <p className="mb-1" style={{ fontWeight: 700, color: '#7a4a00', fontSize: '0.95rem' }}>Aviso importante:</p>
        <p className="mb-0" style={{ color: '#5a4010', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Este cálculo é um <strong>mero auxílio automático</strong>. A pontuação final prevalece a da planilha oficial preenchida pela comissão.{' '}
          <strong>Faça um lançamento para cada documento comprobatório.</strong> Quando o mesmo critério possuir mais de um comprovante, adicione ou duplique o lançamento.
          O sistema aplica automaticamente os <strong>limites máximos de unidades por critério</strong> e os <strong>limites máximos de pontuação por diretriz</strong>.
        </p>
      </div>
    </div>
  );
}
