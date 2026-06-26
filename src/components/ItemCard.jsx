import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import { getCriterio, calcularPontosItem, getQuantidadeMaxima } from '../lib/engine';

function isoToDisplay(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : iso;
}

function displayToIso(s) {
  if (!s || s.includes('-')) return s;
  const p = s.split('/');
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : s;
}

export default function ItemCard({ item, index, onUpdate, onRemove, onDuplicate, onToggle, onFileAdd, onFileRemove, showToast, mostrarErros }) {
  const crit   = getCriterio(item.codigo);
  const isOpen = !!item.isOpen;
  const num    = index + 1;
  const pts    = calcularPontosItem(item);
  const dtpRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !dtpRef.current) return;
    const fp = flatpickr(dtpRef.current, {
      dateFormat: 'd/m/Y', locale: Portuguese, allowInput: true, disableMobile: true,
      onChange: (_, ds) => onUpdate(item.id, 'data', displayToIso(ds))
    });
    const btn = dtpRef.current.closest('[data-dtp]')?.querySelector('[data-cal]');
    if (btn) btn.onclick = e => { e.preventDefault(); fp.open(); };
    return () => fp.destroy();
  }, [isOpen, item.id]);

  const hdrBg    = isOpen ? 'linear-gradient(90deg,#0B3A75,#1351b4)' : '#f4f7fb';
  const hdrColor = isOpen ? '#fff' : '#1a2e50';
  const subColor = isOpen ? 'rgba(255,255,255,0.65)' : '#5a70a0';
  const chevron  = isOpen ? 'fa-chevron-up' : 'fa-chevron-down';
  const chipBg   = isOpen ? 'rgba(255,255,255,0.18)' : '#1351b4';
  const btnBase  = isOpen
    ? { border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: '#fff' }
    : { border: '1px solid #c7d7f8', background: '#e8f0fe', color: '#1351b4' };
  const btnDel   = isOpen
    ? { border: '1px solid rgba(220,60,60,0.4)', background: 'rgba(220,60,60,0.2)', color: '#ffb3b3' }
    : { border: '1px solid #f5c6c0', background: '#fdecea', color: '#c0392b' };

  const headerTitle = crit
    ? `Diretriz ${crit.diretriz} — Critério ${crit.codigo}`
    : 'Critério não selecionado';
  const headerDesc  = crit
    ? (crit.descricao.length > 90 ? crit.descricao.substring(0, 90) + '...' : crit.descricao)
    : '';

  const handleQtd = v => {
    const qmax = getQuantidadeMaxima(item.codigo);
    let val = parseFloat(v);
    if (qmax !== null && val > qmax) {
      val = qmax;
      showToast(`Atenção: O limite máximo para este critério é de ${qmax} ${crit?.unidade || ''}(s).`);
    }
    onUpdate(item.id, 'quantidade', isNaN(val) ? v : String(val));
  };

  const errDesc = mostrarErros && !item.docDescricao?.trim();
  const errData = mostrarErros && !item.data;
  const errQtd  = mostrarErros && (!item.quantidade || parseFloat(item.quantidade) <= 0);
  const hasErr  = errDesc || errData || errQtd;

  const errStyle = { borderColor: '#e74c3c', boxShadow: '0 0 0 2px rgba(231,76,60,0.12)' };
  const errMsg   = <span style={{ fontSize: '0.72rem', color: '#e74c3c', marginTop: 3, display: 'block' }}>Campo obrigatório</span>;

  return (
    <div className="accordion-item">
      {/* Header */}
      <div
        onClick={() => onToggle(item.id)}
        style={{ cursor: 'pointer', background: hdrBg, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, userSelect: 'none' }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 26, height: 26, background: chipBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{num}</div>
          {hasErr && !isOpen && (
            <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: '#e74c3c', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: '0.52rem', fontWeight: 900, lineHeight: 1 }}>!</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.87rem', color: hdrColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{headerTitle}</div>
          {!isOpen && <div style={{ fontSize: '0.74rem', color: subColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{headerDesc}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {crit && item.quantidade && (
            <span style={{ background: '#e8f0fe', color: '#1351b4', border: '1px solid #c7d7f8', borderRadius: 20, padding: '2px 10px', fontSize: '0.74rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {pts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pontos
            </span>
          )}
          <button type="button" onClick={() => onDuplicate(item.id)} title="Duplicar item"
            style={{ ...btnBase, borderRadius: 6, padding: '5px 9px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1 }}>
            <i className="fas fa-copy" />
          </button>
          <button type="button" onClick={() => onRemove(item.id)} title="Excluir item"
            style={{ ...btnDel, borderRadius: 6, padding: '5px 9px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: 1 }}>
            <i className="fas fa-trash" />
          </button>
        </div>
        <div style={{ flexShrink: 0, width: 24, height: 24, background: isOpen ? 'rgba(255,255,255,0.12)' : '#e8f0fe', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className={`fas ${chevron}`} style={{ color: isOpen ? '#fff' : '#1351b4', fontSize: '0.72rem' }} />
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: '18px 16px', background: '#fff' }}>
          {crit && <p style={{ fontSize: '0.83rem', color: '#6b7f99', marginBottom: 14, lineHeight: 1.5, borderLeft: '3px solid #c7d7f8', paddingLeft: 10 }}>{crit.descricao}</p>}
          <div className="row">
            <div className="col-12 mb-3">
              <div className="br-input">
                <label>Descrição do documento <span style={{ color: '#c0392b' }}>*</span></label>
                <input type="text" value={item.docDescricao || ''} onChange={e => onUpdate(item.id, 'docDescricao', e.target.value)} placeholder="Descreva o documento comprobatório"
                  style={errDesc ? errStyle : undefined} />
                {errDesc && errMsg}
              </div>
            </div>

            <div className="col-sm-4 mb-3">
              <div data-dtp="1" className="br-input has-icon">
                <label htmlFor={`dataItem_${item.id}`}>Data <span style={{ color: '#c0392b' }}>*</span></label>
                <input id={`dataItem_${item.id}`} ref={dtpRef} type="text" placeholder="dd/mm/aaaa" defaultValue={isoToDisplay(item.data)} autoComplete="off"
                  style={errData ? errStyle : undefined} />
                <button data-cal="1" className="br-button circle small" type="button" aria-label="Abrir calendário">
                  <i className="fas fa-calendar-alt" />
                </button>
                {errData && errMsg}
              </div>
            </div>

            <div className="col-sm-4 mb-3">
              <div className="br-input">
                <label>Unidade</label>
                <input type="text" value={crit ? crit.unidade : ''} disabled />
              </div>
            </div>

            <div className="col-sm-4 mb-3">
              <div className="br-input">
                <label>Quantidade <span style={{ color: '#c0392b' }}>*</span></label>
                <input type="number" step="0.01" min="0" max={crit?.quantidadeMaxima}
                  value={item.quantidade || ''} onChange={e => handleQtd(e.target.value)} placeholder="0"
                  style={errQtd ? errStyle : undefined} />
                {errQtd && errMsg}
                {crit && (
                  <div style={{ fontSize: '0.72rem', color: '#6b7f99', marginTop: 4 }}>
                    Fator: {crit.fator.toLocaleString('pt-BR')} pontos/unidade | <strong>Limite: {crit.quantidadeMaxima} {crit.unidade}(s)</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 mb-3">
              <div className="br-input">
                <label>Observação <span style={{ fontSize: '0.78rem', color: '#8a9ab5' }}>(opcional)</span></label>
                <textarea rows="2" value={item.observacao || ''} onChange={e => onUpdate(item.id, 'observacao', e.target.value)} placeholder="Anotações adicionais..." />
              </div>
            </div>
          </div>

          {/* Anexos */}
          <div style={{ background: '#f4f7fb', borderRadius: 8, padding: '12px 14px', border: `1px solid ${item.files?.length > 0 ? '#dce6f5' : '#e74c3c'}`, marginTop: 4 }}>
            <div style={{ fontWeight: 600, fontSize: '0.83rem', color: '#1a2e50', marginBottom: 8 }}>
              <i className="fas fa-paperclip" style={{ color: '#1351b4', marginRight: 6 }} />Arquivos anexados <span style={{ color: '#c0392b' }}>*</span>
            </div>

            {(!item.files || item.files.length === 0) && (
              <div style={{ fontSize: '0.8rem', color: '#8a9ab5', fontStyle: 'italic', marginBottom: 8 }}>
                Nenhum arquivo anexado. Lembre-se de anexar o PDF comprobatório.
              </div>
            )}
            {item.files?.map((f, fi) => (
              <div key={fi} className="file-row">
                <i className="fas fa-file-pdf" style={{ color: '#c0392b', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.82rem', color: '#1a2e50', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                <span style={{ fontSize: '0.73rem', color: '#8a9ab5', whiteSpace: 'nowrap', marginLeft: 8 }}>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                <button type="button" onClick={() => onFileRemove(item.id, fi)} style={{ border: 'none', background: 'none', color: '#c0392b', cursor: 'pointer', padding: '2px 6px', borderRadius: 4 }}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}

            <input type="file" id={`fileInput_${item.id}`} multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
              onChange={e => onFileAdd(item.id, Array.from(e.target.files))} />
            <button type="button" onClick={() => document.getElementById(`fileInput_${item.id}`).click()}
              style={{ marginTop: 10, border: '1px dashed #1351b4', background: '#e8f0fe', color: '#1351b4', borderRadius: 6, padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', width: '100%', display: 'block' }}>
              <i className="fas fa-plus" style={{ marginRight: 4 }} /> Adicionar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
