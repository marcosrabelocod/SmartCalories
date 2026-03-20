import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';
import { PantryItem } from './DespensaPage';

interface Props {
  onAdd: (item: Omit<PantryItem, 'id'>) => void;
}

const UNITS = ['un', 'kg', 'g', 'L', 'ml', 'pct'];

const DespensaQuickAdd: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('un');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      quantity: parseFloat(quantity) || 0,
      unit,
      category: 'Geral'
    });

    setName('');
    setQuantity('1');
  };

  return (
    <div className="pantry-input-container">
      <div className="pantry-input-wrapper">
        <form onSubmit={handleSubmit} className="pantry-quick-form">
          <div className="pantry-field name-field">
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Novo alimento..."
              required
            />
          </div>

          <div className="pantry-field unit-field">
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="pantry-field qty-field">
            <input 
              type="number" 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)}
              min="0"
              step="0.1"
              required
            />
          </div>

          <button type="submit" className="pantry-add-btn" disabled={!name.trim()}>
            <Plus size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DespensaQuickAdd;