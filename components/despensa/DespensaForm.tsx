import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { PantryItem } from './DespensaPage';

interface Props {
  onAdd: (item: Omit<PantryItem, 'id'>) => void;
}

const UNITS = ['un', 'kg', 'g', 'L', 'ml', 'pct'];

const DespensaForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('un');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      quantity: parseFloat(quantity) || 0,
      unit,
      category: 'Geral' // Simplificado para entrada rápida
    });

    setName('');
    setQuantity('1');
  };

  return (
    <div className="pantry-quick-add-bar">
      <form onSubmit={handleSubmit} className="quick-add-form">
        <div className="input-group-pantry name-field">
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="Nome do produto..."
            required
          />
        </div>

        <div className="input-group-pantry unit-field">
          <select value={unit} onChange={e => setUnit(e.target.value)}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="input-group-pantry qty-field">
          <input 
            type="number" 
            value={quantity} 
            onChange={e => setQuantity(e.target.value)}
            min="0"
            step="0.1"
            placeholder="Qtd"
            required
          />
        </div>

        <button type="submit" className="pantry-submit-btn" disabled={!name.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default DespensaForm;