'use client';

import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';

export interface ToastHandle {
  show: (msg: string) => void;
}

const Toast = forwardRef<ToastHandle>((_, ref) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show(msg: string) {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    },
  }));

  return (
    <div id="toast" className={visible ? 'show' : ''}>
      {message}
    </div>
  );
});

Toast.displayName = 'Toast';
export default Toast;
