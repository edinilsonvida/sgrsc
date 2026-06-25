import { forwardRef } from 'react';

const Toast = forwardRef(function Toast(_, ref) {
  return <div ref={ref} className="toast-notification">Mensagem</div>;
});

export default Toast;
