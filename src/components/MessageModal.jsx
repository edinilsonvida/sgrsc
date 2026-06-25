import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const MessageModal = forwardRef(function MessageModal(_, ref) {
  const resolveRef = useRef(null);
  const [open, setOpen]     = useState(false);
  const [title, setTitle]   = useState('Aviso');
  const [msg, setMsg]       = useState('');
  const [isConfirm, setIsC] = useState(false);

  useImperativeHandle(ref, () => ({
    show(message, confirm = false) {
      setTitle(confirm ? 'Confirmação' : 'Aviso');
      setMsg(message);
      setIsC(confirm);
      setOpen(true);
      return new Promise(r => { resolveRef.current = r; });
    }
  }));

  const close = result => {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, padding: '24px 28px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)', width: '90%', maxWidth: 480,
      }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0B3A75', marginBottom: 12 }}>{title}</div>
        <p style={{ margin: '0 0 20px', color: '#333', lineHeight: 1.5 }}>{msg}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {isConfirm && (
            <button type="button" className="br-button secondary" onClick={() => close(false)}>Cancelar</button>
          )}
          <button type="button" className="br-button primary" onClick={() => close(true)}>OK</button>
        </div>
      </div>
    </div>
  );
});

export default MessageModal;
