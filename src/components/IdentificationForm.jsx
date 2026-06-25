import { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';

const OBRIGATORIOS = {
  nome:             'Nome completo',
  siape:            'SIAPE',
  nivelPretendido:  'Nível de RSC pretendido',
  email:            'E-mail',
  celular:          'Celular',
  dataLimite:       'Última data dos documentos',
};

const errStyle  = { color: '#e52207', fontSize: '0.82rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 };
const borderErr = { borderColor: '#e52207' };

export default function IdentificationForm({ dados, onChange, mostrarErros }) {
  const dtpRtRef  = useRef(null);
  const dtpLimRef = useRef(null);
  const [tocado, setTocado] = useState({});

  const tocar = (f) => setTocado(prev => ({ ...prev, [f]: true }));

  // Compute current errors for all required fields
  const erros = {};
  Object.keys(OBRIGATORIOS).forEach(f => { if (!dados[f]) erros[f] = 'Campo obrigatório.'; });

  // Show error only when field was touched OR parent forced validation
  const exibir = (f) => (tocado[f] || mostrarErros) && erros[f];

  useEffect(() => {
    if (!dtpRtRef.current || !dtpLimRef.current) return;
    const cfg = { dateFormat: 'd/m/Y', locale: Portuguese, allowInput: true, disableMobile: true };
    const fpRt  = flatpickr(dtpRtRef.current,  { ...cfg, onChange: (_, ds) => onChange('dataRt', ds) });
    const fpLim = flatpickr(dtpLimRef.current, {
      ...cfg,
      onChange: (_, ds) => onChange('dataLimite', ds),
      onClose:  ()       => tocar('dataLimite'),
    });
    return () => { fpRt.destroy(); fpLim.destroy(); };
  }, []);

  const Err = ({ f }) => exibir(f) ? (
    <span style={errStyle}>
      <i className="fas fa-exclamation-circle" /> {erros[f]}
    </span>
  ) : null;

  const field = (id, label, children, required = false) => (
    <div className={`br-input${exibir(id) ? ' danger' : ''}`}>
      <label htmlFor={id}>{label}{required && <span className="text-danger"> *</span>}</label>
      {children}
      {required && <Err f={id} />}
    </div>
  );

  const bind = (id) => ({
    onBlur: () => tocar(id),
    style:  exibir(id) ? borderErr : undefined,
  });

  return (
    <div className="br-card mb-4" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(11,58,117,0.10)' }}>
      <div className="card-header" style={{ background: 'linear-gradient(90deg, #0B3A75, #1351b4)', borderBottom: '3px solid #1C7C3B', padding: '14px 20px' }}>
        <div className="d-flex align-items-center">
          <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-user" style={{ color: '#fff', fontSize: '0.95rem' }} />
          </div>
          <div className="ml-3">
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.2px' }}>Identificação do servidor</div>
            <div style={{ color: '#a8c4f0', fontSize: '0.78rem', marginTop: 1 }}>Preencha seus dados pessoais e funcionais</div>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="row">
          <div className="col-sm-6 mb-3">
            {field('nome', 'Nome completo',
              <input id="nome" type="text" placeholder="Seu nome"
                value={dados.nome} onChange={e => onChange('nome', e.target.value)}
                {...bind('nome')} />, true)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('siape', 'SIAPE',
              <input id="siape" type="text" placeholder="0000000"
                value={dados.siape} onChange={e => onChange('siape', e.target.value)}
                {...bind('siape')} />, true)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('nivelPretendido', 'Nível de RSC pretendido',
              <select id="nivelPretendido" value={dados.nivelPretendido}
                onChange={e => onChange('nivelPretendido', e.target.value)}
                {...bind('nivelPretendido')}>
                <option value="">Selecione</option>
                <option>RSC I</option><option>RSC II</option><option>RSC III</option>
              </select>, true)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('email', 'E-mail',
              <input id="email" type="email" placeholder="servidor@ifsc.edu.br"
                value={dados.email} onChange={e => onChange('email', e.target.value)}
                {...bind('email')} />, true)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('celular', 'Celular',
              <input id="celular" type="text" placeholder="(00) 00000-0000"
                value={dados.celular} onChange={e => onChange('celular', e.target.value)}
                {...bind('celular')} />, true)}
          </div>

          <div className="col-sm-12 mt-4 mb-2">
            <div className="text-weight-semi-bold text-up-01 text-primary-default" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Retribuição por Titulação (RT)</div>
          </div>

          <div className="col-sm-4 mb-3">
            {field('rt', 'Retribuição por Titulação (RT)',
              <select id="rt" value={dados.rt} onChange={e => onChange('rt', e.target.value)}>
                <option value="Nenhuma">Nenhuma</option>
                <option value="Aperfeiçoamento">Aperfeiçoamento</option>
                <option value="Especialização">Especialização</option>
                <option value="Mestrado">Mestrado</option>
              </select>)}
          </div>
          <div className="col-sm-4 mb-3">
            {field('portariaRt', 'Número da portaria de RT',
              <input id="portariaRt" type="text" placeholder="Portaria Nº XXX/XXXX"
                value={dados.portariaRt} onChange={e => onChange('portariaRt', e.target.value)} />)}
          </div>
          <div className="col-sm-4 mb-3">
            <div className="br-input has-icon">
              <label htmlFor="dataRt">Data de concessão da RT</label>
              <input id="dataRt" ref={dtpRtRef} type="text" placeholder="dd/mm/aaaa"
                defaultValue={dados.dataRt} autoComplete="off" />
              <button className="br-button circle small" type="button" aria-label="Abrir calendário"
                onClick={() => dtpRtRef.current?._flatpickr?.open()}>
                <i className="fas fa-calendar-alt" />
              </button>
            </div>
          </div>

          <div className="col-sm-12 mt-4 mb-2">
            <div className="text-weight-semi-bold text-up-01 text-primary-default" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Outras informações</div>
          </div>

          <div className="col-sm-6 mb-3">
            <div className={`br-input has-icon${exibir('dataLimite') ? ' danger' : ''}`}>
              <label htmlFor="dataLimite">
                Última data dos documentos (limite)<span className="text-danger"> *</span>
              </label>
              <input id="dataLimite" ref={dtpLimRef} type="text" placeholder="dd/mm/aaaa"
                defaultValue={dados.dataLimite} autoComplete="off"
                style={exibir('dataLimite') ? borderErr : undefined} />
              <button className="br-button circle small" type="button" aria-label="Abrir calendário"
                onClick={() => dtpLimRef.current?._flatpickr?.open()}>
                <i className="fas fa-calendar-alt" />
              </button>
              <Err f="dataLimite" />
            </div>
          </div>

          <div className="col-12 mt-4 mb-3">
            <div className="br-input mt-3">
              <label htmlFor="memorialTexto">Memorial descritivo sintético (aparecerá em página separada após a capa)</label>
              <textarea id="memorialTexto" rows="5" placeholder="Digite aqui o texto do memorial..."
                value={dados.memorialTexto} onChange={e => onChange('memorialTexto', e.target.value)} />
            </div>
          </div>

          <div className="col-sm-12 mt-4 mb-2">
            <div className="text-weight-semi-bold text-up-01 text-primary-default" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Dados do declarante e local</div>
          </div>

          <div className="col-sm-5 mb-3">
            {field('declaranteNome', 'Nome do servidor declarante',
              <input id="declaranteNome" type="text" placeholder="Nome de quem irá assinar a declaração"
                value={dados.declaranteNome} onChange={e => onChange('declaranteNome', e.target.value)} />)}
          </div>
          <div className="col-sm-3 mb-3">
            {field('declaranteSiape', 'SIAPE do declarante',
              <input id="declaranteSiape" type="text" placeholder="0000000"
                value={dados.declaranteSiape} onChange={e => onChange('declaranteSiape', e.target.value)} />)}
          </div>
          <div className="col-sm-4 mb-3">
            {field('cidade', 'Cidade do declarante',
              <input id="cidade" type="text" placeholder="Nome da cidade"
                value={dados.cidade} onChange={e => onChange('cidade', e.target.value)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
