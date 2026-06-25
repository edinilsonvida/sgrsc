import { useState, useRef, useCallback } from 'react';
import Header           from './components/Header';
import Footer           from './components/Footer';
import LibErrorBanner   from './components/LibErrorBanner';
import AlertBanner      from './components/AlertBanner';
import HowToUse         from './components/HowToUse';
import IdentificationForm from './components/IdentificationForm';
import ItemAdder        from './components/ItemAdder';
import ItemList         from './components/ItemList';
import ScorePanel       from './components/ScorePanel';
import Toast            from './components/Toast';
import MessageModal     from './components/MessageModal';
import { getCriterio }  from './lib/engine';
import { generatePdf }  from './lib/pdfGenerator';
import { generateExcel } from './lib/excelGenerator';

const DADOS_INICIAL = {
  nome: '', siape: '', nivelPretendido: '', email: '', celular: '',
  rt: 'Nenhuma', portariaRt: '', dataRt: '', dataLimite: '',
  memorialTexto: '', declaranteNome: '', declaranteSiape: '', cidade: ''
};

function sortItems(items) {
  return [...items].sort((a, b) => {
    const dA = a.data ? new Date(a.data).getTime() : 0;
    const dB = b.data ? new Date(b.data).getTime() : 0;
    if (dA !== dB) return dB - dA;
    const cA = getCriterio(a.codigo);
    const cB = getCriterio(b.codigo);
    const sA = cA ? `${cA.nivel}-${cA.diretriz}-${String(cA.codigo).padStart(3,'0')}` : 'ZZZ';
    const sB = cB ? `${cB.nivel}-${cB.diretriz}-${String(cB.codigo).padStart(3,'0')}` : 'ZZZ';
    return sA.localeCompare(sB);
  });
}

export default function App() {
  const [dados, setDados]   = useState(DADOS_INICIAL);
  const [items, setItems]   = useState([]);
  const [nextId, setNextId] = useState(1);
  const [generating, setGenerating]   = useState(false);
  const [mostrarErros, setMostrarErros] = useState(false);

  const CAMPOS_OBRIGATORIOS = ['nome', 'siape', 'nivelPretendido', 'email', 'celular', 'dataLimite'];
  const dadosValidos = () => CAMPOS_OBRIGATORIOS.every(f => dados[f]?.trim?.() || dados[f]);

  const toastRef = useRef(null);
  const msgRef   = useRef(null);

  const showToast = useCallback(msg => {
    const el = toastRef.current;
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3500);
  }, []);

  const showMsg = useCallback((msg, confirm = false) => msgRef.current?.show(msg, confirm), []);

  const handleDadosChange = (field, value) => setDados(prev => ({ ...prev, [field]: value }));

  const handleAdd = codigoStr => {
    if (!codigoStr) { showMsg('Por favor, selecione um critério antes de adicionar.'); return; }
    setItems(prev => {
      const closed = prev.map(i => ({ ...i, isOpen: false }));
      const id = nextId;
      setNextId(n => n + 1);
      return [...closed, { id, codigo: codigoStr, docDescricao: '', data: '', quantidade: '', observacao: '', files: [], isOpen: true }];
    });
  };

  const handleUpdate = (id, field, value) => {
    setItems(prev => prev.map(i => i.id !== id ? i : { ...i, [field]: value }));
  };

  const handleRemove = async id => {
    const ok = await showMsg('Tem certeza que deseja remover este item?', true);
    if (!ok) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleDuplicate = id => {
    setItems(prev => {
      const src = prev.find(i => i.id === id);
      if (!src) return prev;
      const newId = nextId;
      setNextId(n => n + 1);
      const copy = { ...src, id: newId, files: [...src.files], isOpen: true };
      const closed = prev.map(i => ({ ...i, isOpen: false }));
      const idx = closed.findIndex(i => i.id === id);
      closed.splice(idx + 1, 0, copy);
      return closed;
    });
    showToast('Item duplicado com sucesso!');
  };

  const handleToggle = id => {
    setItems(prev => prev.map(i => i.id !== id ? i : { ...i, isOpen: !i.isOpen }));
  };

  const handleFileAdd = (id, newFiles) => {
    setItems(prev => prev.map(i => i.id !== id ? i : { ...i, files: [...(i.files || []), ...newFiles] }));
  };

  const handleFileRemove = (id, fi) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const files = [...i.files];
      files.splice(fi, 1);
      return { ...i, files };
    }));
  };

  const validarAntes = () => {
    if (!dadosValidos()) {
      setMostrarErros(true);
      showMsg('Preencha todos os campos obrigatórios (marcados com *) antes de gerar.');
      return false;
    }
    if (items.length === 0) {
      showMsg('Adicione pelo menos um comprovante antes de gerar.');
      return false;
    }
    const semAnexo = items.filter(i => !i.files || i.files.length === 0);
    if (semAnexo.length > 0) {
      showMsg(`${semAnexo.length} item(ns) sem documento anexado. Todos os comprovantes devem ter pelo menos um arquivo anexado.`);
      return false;
    }
    return true;
  };

  const handleGenerateExcel = async () => {
    if (generating) return;
    if (!validarAntes()) return;
    setGenerating(true);
    try {
      const sorted = sortItems(items);
      await generateExcel(sorted, dados);
      showToast('Formulário de avaliação XLSX gerado com sucesso!');
    } catch (err) {
      showMsg(err.message || 'Erro ao gerar planilha.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (generating) return;
    if (!validarAntes()) return;
    setGenerating(true);
    try {
      const sorted = sortItems(items);
      await generatePdf(sorted, dados, msg => showToast(msg));
      showToast('Arquivo PDF unificado gerado com sucesso!');
    } catch (err) {
      showMsg((err.message || 'Erro ao gerar o PDF.') + ' Verifique se os arquivos anexados são válidos.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <LibErrorBanner />
      <Header />

      <div className="container-lg mb-5 mt-4">
        <AlertBanner />
        <HowToUse />

        <div className="d-flex justify-content-end mb-4" style={{ gap: 10 }}>
          <button type="button" className="br-button secondary" onClick={handleGenerateExcel} disabled={generating}>
            <i className="fas fa-table mr-1" /> Gerar formulário avaliador (XLSX)
          </button>
          <button type="button" className="br-button primary" onClick={handleGeneratePdf} disabled={generating}>
            <i className="fas fa-download mr-1" /> {generating ? 'Gerando...' : 'Gerar memorial (PDF)'}
          </button>
        </div>

        <main>
          <IdentificationForm dados={dados} onChange={handleDadosChange} mostrarErros={mostrarErros} />

          <div className="br-card mb-4" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(11,58,117,0.10)' }}>
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #0B3A75, #1351b4)', borderBottom: '3px solid #1C7C3B', padding: '14px 20px' }}>
              <div className="d-flex align-items-center">
                <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fas fa-file-alt" style={{ color: '#fff', fontSize: '0.95rem' }} />
                </div>
                <div className="ml-3">
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Lançamentos de comprovantes</div>
                  <div style={{ color: '#a8c4f0', fontSize: '0.78rem', marginTop: 1 }}>Um lançamento por documento comprobatório</div>
                </div>
              </div>
            </div>

            <div className="card-content">
              <ItemAdder onAdd={handleAdd} />
              <ItemList
                items={items}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                onDuplicate={handleDuplicate}
                onToggle={handleToggle}
                onFileAdd={handleFileAdd}
                onFileRemove={handleFileRemove}
                showToast={showToast}
              />
              <ScorePanel items={items} nivelPretendido={dados.nivelPretendido} />
            </div>
          </div>
        </main>
      </div>

      <Footer />
      <Toast ref={toastRef} />
      <MessageModal ref={msgRef} />
    </>
  );
}
