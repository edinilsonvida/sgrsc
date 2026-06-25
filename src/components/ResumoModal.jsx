import { forwardRef, useImperativeHandle, useRef } from 'react';
import { getCriterio } from '../lib/engine';

const ResumoModal = forwardRef(function ResumoModal(_, ref) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show(items) {
      if (contentRef.current) {
        if (items.length === 0) {
          contentRef.current.innerHTML = '<p>Nenhum item cadastrado.</p>';
        } else {
          let html = '<ul style="list-style:none;padding:0;">';
          items.forEach((item, i) => {
            const crit = getCriterio(item.codigo);
            const t = crit ? `Diretriz ${crit.diretriz} - Critério ${crit.codigo}` : 'Não selecionado';
            html += `<li style="padding:8px;border-bottom:1px solid #eee;">
              <strong>Item ${i + 1}: ${t}</strong><br/>
              Qtd: ${item.quantidade || 0} ${crit ? crit.unidade : ''}<br/>
              Anexos: ${item.files?.length || 0}
            </li>`;
          });
          html += '</ul>';
          contentRef.current.innerHTML = html;
        }
      }
      dialogRef.current?.showModal();
    }
  }));

  return (
    <dialog ref={dialogRef} style={{ width: '80%', maxWidth: 800, maxHeight: '80vh' }}>
      <div className="br-modal-header">
        <div className="br-modal-title" title="Resumo dos itens">Resumo dos itens</div>
      </div>
      <div className="br-modal-body" ref={contentRef} style={{ maxHeight: '60vh', overflowY: 'auto' }} />
      <div className="br-modal-footer justify-content-end">
        <button type="button" className="br-button secondary" onClick={() => dialogRef.current?.close()}>Fechar</button>
      </div>
    </dialog>
  );
});

export default ResumoModal;
