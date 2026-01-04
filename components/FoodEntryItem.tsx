import React from 'react';
import { FoodItem } from '../types';
import { Trash2 } from 'lucide-react';
import './FoodEntryItem.css';

interface Props {
  item: FoodItem;
  onDelete: (id: string) => void;
}

const FoodEntryItem: React.FC<Props> = ({ item, onDelete }) => {
  const totalCalories = item.foods.reduce((acc, f) => acc + f.calories, 0);
  const names = item.foods.map(f => f.name).join(', ') || 'Sem itens';

  return (
    <div className="food-item-card group">
      <div className="food-info">
        <span className="food-name">{names}</span>
        <span className="food-time">
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="food-actions">
        <span className="food-calories">+{totalCalories} kcal</span>
        <button 
          onClick={() => onDelete(item.id)}
          className="delete-btn"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default FoodEntryItem;