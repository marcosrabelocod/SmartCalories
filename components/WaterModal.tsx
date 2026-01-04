import React, { useState } from 'react';
import { Droplet, X } from 'lucide-react';
import './WaterModal.css';

interface WaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWater: (amount: number) => void;
}

const WaterModal: React.FC<WaterModalProps> = ({ isOpen, onClose, onAddWater }) => {
  const [customWaterAmount, setCustomWaterAmount] = useState('');

  if (!isOpen) return null;

  const handleCustomWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customWaterAmount);
    if (amount > 0) {
      onAddWater(amount);
      setCustomWaterAmount('');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon-box">
              <Droplet size={20} className="fill-blue-400" />
            </div>
            <h3 className="modal-title">Registrar Água</h3>
          </div>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-grid">
          {[100, 250, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                onAddWater(amount);
                onClose();
              }}
              className="quick-add-btn group"
            >
              <span className="quick-add-value">+{amount}</span>
              <span className="quick-add-unit">ml</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomWaterSubmit}>
          <label className="custom-input-label">Outra quantidade (ml)</label>
          <div className="custom-input-row">
            <input 
              type="number" 
              value={customWaterAmount}
              onChange={(e) => setCustomWaterAmount(e.target.value)}
              placeholder="Ex: 300"
              className="custom-input"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!customWaterAmount}
              className="custom-submit-btn"
            >
              Adicionar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default WaterModal;