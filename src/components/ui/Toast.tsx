import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({
  isVisible,
  message,
  type = 'success',
  duration = 3000,
  onClose
}: ToastProps) {
  const [isHiding, setIsHiding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      setIsHiding(false);

      // Limpar timers anteriores
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

      timerRef.current = setTimeout(() => {
        setIsHiding(true);
        closeTimerRef.current = setTimeout(() => {
          onClose();
        }, 300); // Tempo da animação de saída
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsHiding(true);
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]} ${isHiding ? styles.hide : styles.show}`}>
      <div className={styles.toastContent}>
        <div className={styles.toastIcon}>
          <CheckCircle size={20} />
        </div>
        <div className={styles.toastMessage}>
          {message}
        </div>
        <button
          className={styles.toastClose}
          onClick={handleClose}
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default Toast;