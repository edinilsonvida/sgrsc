import { calcular } from '../lib/engine';

function CriterioBar({ valor, meta, ok }) {
  const pct = ok === null ? 0 : Math.min(100, (valor / meta) * 100);
  const barColor = ok ? 'linear-gradient(90deg,#168821,#1ca82a)'
    : ok === false ? 'linear-gradient(90deg,#1351b4,#1e6fd6)'
    : '#e8edf5';
  return (
    <>
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
        <div title={`Meta: ${meta} pontos`} style={{ position: 'absolute', top: -3, right: 0, width: 2, height: 16, background: 'rgba(80,100,140,0.4)', borderRadius: 1 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.68rem', color: '#8a9ab5' }}>
        <span>0</span><span style={{ color: '#556680' }}>meta: {meta} pontos</span>
      </div>
    </>
  );
}

function Badge({ ok }) {
  if (ok === null) return <span style={{ fontSize: '0.82rem', color: '#8a9ab5', fontStyle: 'italic' }}>— pontos</span>;
  const [bg, col, bor, ico, lbl] = ok
    ? ['#d4edda', '#0c4f15', '#a8d5b0', 'fa-check-circle', 'Atendido']
    : ['#fde8d0', '#7a3200', '#f5b880', 'fa-times-circle', 'Não atendido'];
  return (
    <span style={{ background: bg, color: col, border: `1px solid ${bor}`, borderRadius: 20, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      <i className={`fas ${ico}`} style={{ marginRight: 4 }} />{lbl}
    </span>
  );
}

export default function ScorePanel({ items, nivelPretendido }) {
  const res = calcular(items, nivelPretendido);
  const { totals, totalGeral, pontosPretendido, c1ok, c2ok, aprovado } = res;

  const [sBg, sBor, sCor, sIco, sLbl, sDesc] = (() => {
    if (!nivelPretendido)
      return ['#f4f7fb','#c7d7f8','#5a70a0','fa-question-circle','Selecione o nível pretendido','Informe o nível de RSC pretendido na aba de Identificação para ver o resultado.'];
    if (aprovado)
      return ['#d4edda','#a8d5b0','#0c4f15','fa-check-circle','Pontuação aprovada','Os dois critérios obrigatórios foram atendidos. A pontuação final prevalece sobre a planilha oficial.'];
    return ['#fdecea','#f5c6c0','#7a1f1a','fa-times-circle','Pontuação insuficiente','Um ou mais critérios não foram atendidos. Continue lançando comprovantes.'];
  })();

  const NIVEIS = [
    { key: 'rsc1', label: 'RSC I' },
    { key: 'rsc2', label: 'RSC II' },
    { key: 'rsc3', label: 'RSC III' },
  ];

  return (
    <div className="mt-4" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(11,58,117,0.13)', border: '1px solid #c7d7f8' }}>
      <div style={{ background: 'linear-gradient(90deg,#0B3A75,#1351b4)', borderBottom: '3px solid #1C7C3B', padding: '14px 20px' }}>
        <div className="d-flex align-items-center">
          <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-chart-line" style={{ color: '#fff', fontSize: '0.95rem' }} />
          </div>
          <div className="ml-3">
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.2px' }}>Painel de pontuação simultânea</div>
            <div style={{ color: '#a8c4f0', fontSize: '0.78rem', marginTop: 1 }}>Cálculo automático com limites por diretriz e por nível</div>
          </div>
        </div>
      </div>

      <div className="p-4" style={{ backgroundColor: '#f4f6f9' }}>
        {/* Status banner */}
        <div style={{ background: sBg, border: `1.5px solid ${sBor}`, borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <i className={`fas ${sIco}`} style={{ fontSize: '1.8rem', color: sCor, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: sCor, marginBottom: 2 }}>{sLbl}</div>
            <div style={{ fontSize: '0.8rem', color: sCor, opacity: 0.85, lineHeight: 1.5 }}>{sDesc}</div>
          </div>
        </div>

        {/* Critério 1 */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #dde6f4', padding: '14px 16px', marginBottom: 10, boxShadow: '0 1px 4px rgba(11,58,117,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a2e50' }}>Critério 1 — Total geral de pontos</div>
              <div style={{ fontSize: '0.73rem', color: '#8a9ab5', marginTop: 1 }}>Soma de todos os níveis ≥ 50 pontos (qualquer nível)</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: c1ok ? '#0c4f15' : '#1351b4' }}>
                {totalGeral.toFixed(2)} <span style={{ fontSize: '0.78rem', fontWeight: 400, color: '#6b7f99' }}>pontos</span>
              </span>
              <Badge ok={c1ok} />
            </div>
          </div>
          <CriterioBar valor={totalGeral} meta={50} ok={c1ok} />
        </div>

        {/* Critério 2 */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #dde6f4', padding: '14px 16px', marginBottom: 14, boxShadow: '0 1px 4px rgba(11,58,117,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a2e50' }}>
                Critério 2 — Nível pretendido {nivelPretendido ? `(${nivelPretendido})` : ''}
              </div>
              <div style={{ fontSize: '0.73rem', color: '#8a9ab5', marginTop: 1 }}>
                {nivelPretendido ? `Pontuação específica em ${nivelPretendido} ≥ 25 pontos` : 'Selecione o nível pretendido para verificar'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {pontosPretendido !== null && (
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: c2ok ? '#0c4f15' : '#1351b4' }}>
                  {pontosPretendido.toFixed(2)} <span style={{ fontSize: '0.78rem', fontWeight: 400, color: '#6b7f99' }}>pontos</span>
                </span>
              )}
              <Badge ok={c2ok} />
            </div>
          </div>
          <CriterioBar valor={pontosPretendido ?? 0} meta={25} ok={c2ok} />
        </div>

        {/* Detalhamento por nível */}
        <div style={{ background: '#f4f7fb', borderRadius: 8, padding: '12px 14px', border: '1px solid #dce6f5', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: '0.77rem', color: '#5a70a0', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detalhamento por nível</div>
          {NIVEIS.map(({ key, label }) => {
            const t   = totals[key] || 0;
            const isPr = label === nivelPretendido;
            const pct  = Math.min(100, Math.round((t / 100) * 100));
            return (
              <div key={key} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: isPr ? 700 : 500, color: isPr ? '#1351b4' : '#5a70a0' }}>
                    {label}
                    {isPr && <span style={{ fontSize: '0.68rem', background: '#e8f0fe', color: '#1351b4', borderRadius: 10, padding: '1px 7px', marginLeft: 5, fontWeight: 600 }}>pretendido</span>}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2e50' }}>{t.toFixed(2)} pontos</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: '#e0e7f0' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: isPr ? 'linear-gradient(90deg,#1351b4,#1e6fd6)' : '#b8cae8', borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div style={{ background: '#e8f0fe', borderLeft: '4px solid #1351b4', borderRadius: 8, padding: '12px 16px', fontSize: '0.8rem', color: '#1a3a6e', lineHeight: 1.7 }}>
          <i className="fas fa-info-circle" style={{ color: '#1351b4', marginRight: 5 }} />
          <strong>Regras de aprovação:</strong><br />
          &bull; <strong>Critério 1:</strong> total geral ≥ 50 pontos (qualquer combinação de níveis);<br />
          &bull; <strong>Critério 2:</strong> nível pretendido deve ter ≥ 25 pontos específicos.<br />
          A pontuação final prevalece sobre a planilha oficial preenchida pela comissão.
        </div>
      </div>
    </div>
  );
}
