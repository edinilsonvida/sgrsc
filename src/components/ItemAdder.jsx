import { useState, useEffect } from 'react';
import { getDiretrizes, filtrarItens } from '../lib/engine';

export default function ItemAdder({ onAdd }) {
  const [nivel, setNivel]     = useState('');
  const [diretriz, setDir]    = useState('');
  const [criterio, setCrit]   = useState('');
  const [diretrizes, setDirs] = useState([]);
  const [itens, setItens]     = useState([]);
  const [erro, setErro]       = useState('');

  useEffect(() => {
    setDirs(getDiretrizes(nivel));
    setDir('');
    setCrit('');
    setErro('');
  }, [nivel]);

  useEffect(() => {
    setItens(filtrarItens(nivel, diretriz));
    setCrit('');
    setErro('');
  }, [nivel, diretriz]);

  const handleAdd = () => {
    if (!criterio) {
      setErro('Selecione um critério antes de adicionar à lista.');
      return;
    }
    setErro('');
    onAdd(criterio);
    setCrit('');
  };

  return (
    <div className="mb-4" style={{ background: '#f4f7fb', borderRadius: 10, border: '1px solid #dce6f5', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(90deg, #e8f0fe, #f0f5ff)', borderBottom: '2px solid #c7d7f8', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="fas fa-plus-circle" style={{ color: '#1351b4', fontSize: '1rem' }} />
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0B3A75', letterSpacing: '0.2px' }}>Adicionar novo comprovante</span>
      </div>

      <div className="p-3">
        <div className="row">
          <div className="col-sm-6 mb-3">
            <div className="br-input">
              <label>Filtrar por nível</label>
              <select value={nivel} onChange={e => setNivel(e.target.value)}>
                <option value="">Todos os níveis</option>
                <option>RSC I</option><option>RSC II</option><option>RSC III</option>
              </select>
            </div>
          </div>
          <div className="col-sm-6 mb-3">
            <div className="br-input">
              <label>Filtrar por diretriz</label>
              <select value={diretriz} onChange={e => setDir(e.target.value)}>
                <option value="">Todas as diretrizes</option>
                {diretrizes.map(d => <option key={d} value={d}>Diretriz {d}</option>)}
              </select>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className={`br-input${erro ? ' danger' : ''}`}>
              <label>Selecione o critério <span className="text-danger">*</span></label>
              <select
                value={criterio}
                onChange={e => { setCrit(e.target.value); if (e.target.value) setErro(''); }}
                style={erro ? { borderColor: '#e52207' } : undefined}
              >
                <option value="">Selecione um critério</option>
                {itens.map(c => (
                  <option key={c.codigo} value={c.codigo}>
                    {c.nivel} - Diretriz {c.diretriz} - Critério {c.codigo} - {c.descricao.length > 300 ? c.descricao.substring(0, 300) + '...' : c.descricao}
                  </option>
                ))}
              </select>
              {erro && (
                <span style={{ color: '#e52207', fontSize: '0.82rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className="fas fa-exclamation-circle" />
                  {erro}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="button" className="br-button primary" onClick={handleAdd}>
            <i className="fas fa-plus mr-1" /> Adicionar à lista
          </button>
        </div>
      </div>
    </div>
  );
}
