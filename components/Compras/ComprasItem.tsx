import React, { useState } from 'react';
import { Trash2, Plus, Minus, Check, X, Square, CheckSquare } from 'lucide-react';
import { ShoppingItem } from './ComprasPage';

interface Props {
  item: ShoppingItem;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const MEASURED_UNITS = ['g', 'kg', 'L', 'ml'];

const ComprasItem: React.FC<Props> = ({ item, onRemove, onToggle, onUpdateQty }) => {
  const [adjustMode, setAdjustMode] = useState<'add' | 'sub' | null>(null);
  const [adjustValue, setAdjustValue] = useState('');

  const isMeasured = MEASURED_UNITS.includes(item.unit);

  const handleActionClick = (e: React.MouseEvent, mode: 'add' | 'sub') => {
    e.stopPropagation();
    if (isMeasured) {
      setAdjustMode(mode);
      setAdjustValue('');
    } else {
      onUpdateQty(item.id, mode === 'add' ? 1 : -1);
    }
  };

  const handleConfirmAdjust = (e: React.MouseEvent) => {
    e.stopPropagation();
    const val = parseFloat(adjustValue);
    if (!isNaN(val) && val > 0) {
      onUpdateQty(item.id, adjustMode === 'add' ? val : -val);
    }
    setAdjustMode(null);
  };

  const handleCancelAdjust = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdjustMode(null);
  };

  return (
    <div className={`shop-item-card ${item.checked ? 'checked' : ''}`} onClick={() => onToggle(item.id)}>
      <div className="shop-item-main">
        <div className="shop-item-check-area">
          {item.checked ? 
            <CheckSquare size={22} className="text-brand-primary" /> : 
            <Square size={22} className="text-slate-600" />
          }
        </div>

        <div className="shop-item-info">
          <h4 className="shop-item-name">{item.name}</h4>
          <div className="shop-qty-display">
            <span className="shop-qty-val">{item.quantity}</span>
            <span className="shop-qty-unit">{item.unit}</span>
          </div>
        </div>

        <div className="shop-item-controls">
          {adjustMode ? (
            <div className="shop-adjust-group" onClick={e => e.stopPropagation()}>
              <input 
                type="number" 
                value={adjustValue}
                onChange={(e) => setAdjustValue(e.target.value)}
                placeholder={adjustMode === 'add' ? "+" : "-"}
                className="shop-adjust-input"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmAdjust(e as any)}
              />
              <button className="shop-adjust-confirm" onClick={handleConfirmAdjust}>
                <Check size={14} />
              </button>
              <button className="shop-adjust-cancel" onClick={handleCancelAdjust}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="shop-qty-actions">
              <button className="shop-qty-btn" onClick={(e) => handleActionClick(e, 'sub')}>
                <Minus size={14} />
              </button>
              <button className="shop-qty-btn plus" onClick={(e) => handleActionClick(e, 'add')}>
                <Plus size={14} />
              </button>
            </div>
          )}
          
          {!adjustMode && (
            <button className="shop-remove-btn" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprasItem;