import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ShoppingItem } from './ComprasPage';

interface Props {
  onAdd: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
}

const UNITS = ['un', 'kg', 'g', 'L', 'ml', 'pct'];

const ComprasQuickAdd: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('un');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      quantity: parseFloat(quantity) || 0,
      unit
    });

    setName('');
    setQuantity('1');
  };

  return (
    <div className="shop-input-container">
      <div className="shop-input-wrapper">
        <form onSubmit={handleSubmit} className="shop-quick-form">
          <div className="shop-field name-field">
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="O que comprar?"
              required
            />
          </div>

          <div className="shop-field unit-field">
            <select value={unit} onChange={e => setUnit(e.target.value)}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="shop-field qty-field">
            <input 
              type="number" 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)}
              min="0"
              step="0.1"
              required
            />
          </div>

          <button type="submit" className="shop-add-btn" disabled={!name.trim()}>
            <Plus size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComprasQuickAdd;