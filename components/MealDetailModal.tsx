import React from 'react';
import { X, Trash2, Utensils } from 'lucide-react';
import { SubFoodItem } from '../types';
import './MealDetailModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  foods: SubFoodItem[];
  onRemoveFood: (foodId: string) => void;
}

const MealDetailModal: React.FC<Props> = ({ isOpen, onClose, title, foods, onRemoveFood }) => {
  if (!isOpen) return null;

  return (
    <div className="meal-modal-backdrop" onClick={onClose}>
      <div className="meal-modal-card" onClick={e => e.stopPropagation()}>
        
        <div className="meal-modal-header">
          <div className="meal-modal-title-box">
            <Utensils size={18} className="text-brand-primary" />
            <h3>{title}</h3>
          </div>
          <button onClick={onClose} className="meal-modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="meal-modal-content">
          {foods.length === 0 ? (
            <p className="meal-empty-text">Nenhum alimento registrado nesta refeição.</p>
          ) : (
            <div className="tags-container">
              {foods.map((food) => (
                <div key={food.id} className="food-tag">
                  <span className="food-tag-name">{food.name}</span>
                  <span className="food-tag-cal">{food.calories} kcal</span>
                  <button 
                    onClick={() => onRemoveFood(food.id)}
                    className="food-tag-remove"
                    aria-label={`Remover ${food.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="meal-modal-footer">
            <span className="total-label">Total:</span>
            <span className="total-value">
                {foods.reduce((acc, curr) => acc + curr.calories, 0)} kcal
            </span>
        </div>

      </div>
    </div>
  );
};

export default MealDetailModal;