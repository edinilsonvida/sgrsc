const STEPS = [
  { icon: 'fa-user',         label: 'Passo 1', desc: 'Preencha a identificação do servidor', green: false },
  { icon: 'fa-filter',       label: 'Passo 2', desc: 'Filtre por nível e diretriz',           green: false },
  { icon: 'fa-list-ul',      label: 'Passo 3', desc: 'Selecione o critério e clique em "Adicionar"', green: false },
  { icon: 'fa-hashtag',      label: 'Passo 4', desc: 'Informe a quantidade e anexe o PDF comprobatório', green: false },
  { icon: 'fa-redo',         label: 'Passo 5', desc: 'Repita os passos 2–4 para cada comprovante', green: false },
  { icon: 'fa-file-download',label: 'Passo 6', desc: 'Gere a planilha (ODS) e o PDF final',   green: true },
];

export default function HowToUse() {
  return (
    <div className="br-card mb-4" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)', border: '1px solid #c7d7f8' }}>
      <div className="card-content py-4">
        <p className="text-center text-weight-bold text-primary-default text-up-01 mb-4">
          <i className="fas fa-route mr-2" />Como utilizar o sistema
        </p>
        <div className="d-flex flex-wrap justify-content-center align-items-start" style={{ gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.label} className="d-flex align-items-start">
              <div className="text-center px-2" style={{ flex: 1, minWidth: 100, maxWidth: 140 }}>
                <div className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                  style={{ width: 52, height: 52, borderRadius: '50%', background: step.green ? '#168821' : '#1351b4', color: '#fff', fontSize: '1.3rem' }}>
                  <i className={`fas ${step.icon}`} />
                </div>
                <div className="text-weight-bold text-down-01 mb-1" style={{ color: step.green ? '#168821' : '#1351b4' }}>{step.label}</div>
                <div style={{ fontSize: '0.8rem', color: '#444', lineHeight: 1.3 }}>{step.desc}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="d-none d-sm-flex align-items-center" style={{ color: '#1351b4', fontSize: '1.2rem', paddingTop: 14 }}>
                  <i className="fas fa-chevron-right" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
