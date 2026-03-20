import React, { useState } from 'react';
import { Trash2, Plus, Minus, Check, X } from 'lucide-react';
import { PantryItem } from './DespensaPage';

interface Props {
  item: PantryItem;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const MEASURED_UNITS = ['g', 'kg', 'L', 'ml'];

const DespensaItem: React.FC<Props> = ({ item, onRemove, onUpdateQty }) => {
  const [adjustMode, setAdjustMode] = useState<'add' | 'sub' | null>(null);
  const [adjustValue, setAdjustValue] = useState('');

  const isMeasured = MEASURED_UNITS.includes(item.unit);

  const handleActionClick = (mode: 'add' | 'sub') => {
    if (isMeasured) {
      setAdjustMode(mode);
      setAdjustValue('');
    } else {
      onUpdateQty(item.id, mode === 'add' ? 1 : -1);
    }
  };

  const handleConfirmAdjust = () => {
    const val = parseFloat(adjustValue);
    if (!isNaN(val) && val > 0) {
      onUpdateQty(item.id, adjustMode === 'add' ? val : -val);
    }
    setAdjustMode(null);
    setAdjustValue('');
  };

  const handleCancelAdjust = () => {
    setAdjustMode(null);
    setAdjustValue('');
  };

  return (
    <div className="pantry-item-card">
      <div className="pantry-item-main">
        <div className="pantry-item-info">
          <h4 className="pantry-item-name">{item.name}</h4>
          <div className="qty-display">
            <span className="qty-val">{item.quantity}</span>
            <span className="qty-unit">{item.unit}</span>
          </div>
        </div>

        <div className="pantry-item-controls">
          {adjustMode ? (
            <div className="adjust-input-group animate-fade-in">
              <input 
                type="number" 
                value={adjustValue}
                onChange={(e) => setAdjustValue(e.target.value)}
                placeholder={adjustMode === 'add' ? "+ Qtd" : "- Qtd"}
                className="adjust-input"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmAdjust()}
              />
              <button className="adjust-confirm-btn" onClick={handleConfirmAdjust}>
                <Check size={14} />
              </button>
              <button className="adjust-cancel-btn" onClick={handleCancelAdjust}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="qty-actions">
              <button className="qty-btn" onClick={() => handleActionClick('sub')}>
                <Minus size={14} />
              </button>
              <button className="qty-btn plus" onClick={() => handleActionClick('add')}>
                <Plus size={14} />
              </button>
            </div>
          )}
          
          {!adjustMode && (
            <button className="pantry-remove-btn" onClick={() => onRemove(item.id)}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DespensaItem;