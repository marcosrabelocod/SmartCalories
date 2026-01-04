import React from 'react';
import { X, Check, Coffee, Sun, Moon, Cookie } from 'lucide-react';
import './CategoryModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
  currentCategory: string;
}

const MEAL_TYPES = [
  { label: 'Café da Manhã', icon: Coffee },
  { label: 'Almoço', icon: Sun },
  { label: 'Jantar', icon: Moon },
  { label: 'Lanche', icon: Cookie }
];

const CategoryModal: React.FC<Props> = ({ isOpen, onClose, onSelect, currentCategory }) => {
  if (!isOpen) return null;

  return (
    <div className="category-modal-backdrop" onClick={onClose}>
      <div className="category-modal-card" onClick={e => e.stopPropagation()}>
        <div className="category-modal-header">
          <h3 className="category-modal-title">Alterar Tipo de Refeição</h3>
          <button onClick={onClose} className="category-modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="category-list">
          {MEAL_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = type.label === currentCategory;
            return (
              <button 
                key={type.label} 
                className={`category-option ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelect(type.label);
                  onClose();
                }}
              >
                <div className="category-option-left">
                  <div className={`category-icon-box ${isActive ? 'active' : ''}`}>
                    <Icon size={18} />
                  </div>
                  <span className="category-label">{type.label}</span>
                </div>
                {isActive && <Check size={18} className="text-brand-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;