import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { useToast } from '../../IaFunctions/ToastContext';
import './UndoToast.css';

const UndoToast: React.FC = () => {
  const { isVisible, message, undoAction } = useToast();

  if (!isVisible) return null;

  return (
    <div className="undo-toast-container animate-slide-up">
      <div className="undo-toast-content">
        <span className="undo-toast-message">{message}</span>
        <button className="undo-toast-button" onClick={undoAction}>
          <RefreshCcw size={14} />
          <span>Refazer</span>
        </button>
      </div>
    </div>
  );
};

export default UndoToast;