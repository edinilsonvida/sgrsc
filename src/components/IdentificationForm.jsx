import { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import Tooltip from './Tooltip';

const OBRIGATORIOS = {
  nome:             'Nome completo',
  siape:            'SIAPE',
  nivelPretendido:  'Nível de RSC pretendido',
  email:            'E-mail',
  celular:          'Celular',
  dataLimite:       'Última data dos documentos',
};

const TIPS = {
  nome:             'Informe o nome completo conforme consta no SIAPE e nos documentos oficiais do servidor.',
  siape:            'Matrícula SIAPE de 7 dígitos. Será exibida na capa do memorial e na declaração.',
  nivelPretendido:  'Selecione o nível de RSC ao qual você está se candidatando. A pontuação mínima exigida varia por nível (RSC I, II ou III).',
  email:            'E-mail institucional (@ifsc.edu.br) para contato. Será registrado na capa do memorial.',
  celular:          'Número de celular com DDD para contato da CPPD durante a análise do processo.',
  dataLimite:       'Data limite dos documentos comprobatórios — geralmente a data de protocolo do processo. Comprovantes emitidos após esta data não serão aceitos.',
  memorialTexto:    'Texto livre de apresentação da trajetória profissional, formações e experiências. Aparece em página separada no PDF. Se não preenchido, a página é omitida.',
  rt:               'Caso possua Retribuição por Titulação ativa, selecione o título correspondente. Exigirá informação da portaria e da data de concessão.',
  portariaRt:       'Número e ano da portaria que concedeu a RT (ex.: Portaria Nº 123/2023). Obrigatório quando RT ≠ Nenhuma.',
  dataRt:           'Data de publicação ou vigência da portaria de concessão da RT. Obrigatória quando RT ≠ Nenhuma.',
  declaranteNome:   'Nome do servidor que irá conferir os originais e assinar a declaração de "Confere com o Original". Se não preenchido, a página da declaração é omitida do PDF.',
  declaranteSiape:  'SIAPE do servidor declarante que atestará a autenticidade dos documentos.',
  cidade:           'Cidade onde a declaração será lavrada (ex.: Florianópolis). Aparece na linha de data e assinatura.',
};

const errStyle  = { color: '#e52207', fontSize: '0.82rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 };
const borderErr = { borderColor: '#e52207' };

export default function IdentificationForm({ dados, onChange, mostrarErros }) {
  const dtpRtRef  = useRef(null);
  const dtpLimRef = useRef(null);
  const [tocado, setTocado] = useState({});

  const tocar = (f) => setTocado(prev => ({ ...prev, [f]: true }));

  const erros = {};
  Object.keys(OBRIGATORIOS).forEach(f => { if (!dados[f]) erros[f] = 'Campo obrigatório.'; });
  const rtObrigatorio = dados.rt && dados.rt !== 'Nenhuma';
  if (rtObrigatorio) {
    if (!dados.portariaRt?.trim()) erros.portariaRt = 'Campo obrigatório.';
    if (!dados.dataRt)             erros.dataRt     = 'Campo obrigatório.';
  }

  const exibir = (f) => (tocado[f] || mostrarErros) && erros[f];

  useEffect(() => {
    if (!dtpRtRef.current || !dtpLimRef.current) return;
    const cfg = { dateFormat: 'd/m/Y', locale: Portuguese, allowInput: true, disableMobile: true };
    const fpRt  = flatpickr(dtpRtRef.current,  { ...cfg, onChange: (_, ds) => onChange('dataRt', ds), onClose: () => tocar('dataRt') });
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

  const field = (id, label, children, required = false, tip = null) => (
    <div className={`br-input${exibir(id) ? ' danger' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="text-danger"> *</span>}
        {tip && <Tooltip text={tip} />}
      </label>
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
                {...bind('nome')} />, true, TIPS.nome)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('siape', 'SIAPE',
              <input id="siape" type="text" placeholder="0000000"
                inputMode="numeric" pattern="[0-9]*"
                value={dados.siape} onChange={e => onChange('siape', e.target.value.replace(/\D/g, ''))}
                {...bind('siape')} />, true, TIPS.siape)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('nivelPretendido', 'Nível de RSC pretendido',
              <select id="nivelPretendido" value={dados.nivelPretendido}
                onChange={e => onChange('nivelPretendido', e.target.value)}
                {...bind('nivelPretendido')}>
                <option value="">Selecione</option>
                <option>RSC I</option><option>RSC II</option><option>RSC III</option>
              </select>, true, TIPS.nivelPretendido)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('email', 'E-mail',
              <input id="email" type="email" placeholder="servidor@ifsc.edu.br"
                value={dados.email} onChange={e => onChange('email', e.target.value)}
                {...bind('email')} />, true, TIPS.email)}
          </div>
          <div className="col-sm-6 mb-3">
            {field('celular', 'Celular',
              <input id="celular" type="text" placeholder="(00) 00000-0000"
                value={dados.celular} onChange={e => onChange('celular', e.target.value)}
                {...bind('celular')} />, true, TIPS.celular)}
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
              </select>, false, TIPS.rt)}
          </div>
          <div className="col-sm-4 mb-3">
            {field('portariaRt', 'Número da portaria de RT',
              <input id="portariaRt" type="text" placeholder="Portaria Nº XXX/XXXX"
                value={dados.portariaRt} onChange={e => onChange('portariaRt', e.target.value)}
                {...bind('portariaRt')} />, rtObrigatorio, TIPS.portariaRt)}
          </div>
          <div className="col-sm-4 mb-3">
            <div className={`br-input has-icon${exibir('dataRt') ? ' danger' : ''}`}>
              <label htmlFor="dataRt">
                Data de concessão da RT
                {rtObrigatorio && <span className="text-danger"> *</span>}
                <Tooltip text={TIPS.dataRt} />
              </label>
              <input id="dataRt" ref={dtpRtRef} type="text" placeholder="dd/mm/aaaa"
                defaultValue={dados.dataRt} autoComplete="off"
                style={exibir('dataRt') ? borderErr : undefined} />
              <button className="br-button circle small" type="button" aria-label="Abrir calendário"
                onClick={() => dtpRtRef.current?._flatpickr?.open()}>
                <i className="fas fa-calendar-alt" />
              </button>
              <Err f="dataRt" />
            </div>
          </div>

          <div className="col-sm-12 mt-4 mb-2">
            <div className="text-weight-semi-bold text-up-01 text-primary-default" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Outras informações</div>
          </div>

          <div className="col-sm-6 mb-3">
            <div className={`br-input has-icon${exibir('dataLimite') ? ' danger' : ''}`}>
              <label htmlFor="dataLimite">
                Última data dos documentos (limite)<span className="text-danger"> *</span>
                <Tooltip text={TIPS.dataLimite} />
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
              <label htmlFor="memorialTexto">
                Memorial descritivo sintético (aparecerá em página separada após a capa)
                <Tooltip text={TIPS.memorialTexto} />
              </label>
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
                value={dados.declaranteNome} onChange={e => onChange('declaranteNome', e.target.value)} />,
              false, TIPS.declaranteNome)}
          </div>
          <div className="col-sm-3 mb-3">
            {field('declaranteSiape', 'SIAPE do declarante',
              <input id="declaranteSiape" type="text" placeholder="0000000"
                inputMode="numeric" pattern="[0-9]*"
                value={dados.declaranteSiape} onChange={e => onChange('declaranteSiape', e.target.value.replace(/\D/g, ''))} />,
              false, TIPS.declaranteSiape)}
          </div>
          <div className="col-sm-4 mb-3">
            {field('cidade', 'Cidade do declarante',
              <input id="cidade" type="text" placeholder="Nome da cidade"
                value={dados.cidade} onChange={e => onChange('cidade', e.target.value)} />,
              false, TIPS.cidade)}
          </div>
        </div>
      </div>
    </div>
  );
}
