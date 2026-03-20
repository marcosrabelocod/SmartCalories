import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface ToastContextType {
  showToast: (message: string, onUndo: () => void) => void;
  isVisible: boolean;
  message: string;
  undoAction: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [undoAction, setUndoAction] = useState<() => void>(() => {});
  const timerRef = useRef<number | null>(null);

  const showToast = (msg: string, onUndo: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setMessage(msg);
    setUndoAction(() => onUndo);
    setIsVisible(true);

    // Tempo aumentado para 5 segundos
    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast, isVisible, message, undoAction }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};