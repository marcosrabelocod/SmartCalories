import React, { useMemo } from 'react';
import { Droplet, Plus } from 'lucide-react';
import './Hidratacao.css';

interface HidratacaoProps {
  current: number;
  total: number;
  onOpenModal: () => void;
}

const Hidratacao: React.FC<HidratacaoProps> = ({ current, total, onOpenModal }) => {
  const waterPercentage = useMemo(() => {
    const pct = (current / total) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }, [current, total]);

  return (
    <div>
      <div className="hydro-header">
        <div className="hydro-icon-wrapper">
          <div className="hydro-icon-box">
            <Droplet size={16} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="hydro-title">Hidratação</h1>
          </div>
        </div>
        <div className="hydro-stats">
          <span className="hydro-current">
            {current}
          </span>
          <span className="hydro-total"> / {total}ml</span>
        </div>
      </div>

      <div className="hydro-controls">
         <div className="hydro-bar-wrapper">
          <div 
            className="hydro-bar-fill"
            style={{ width: `${waterPercentage}%` }}
          >
            <div className="hydro-shine"></div>
          </div>
        </div>
        
        {/* Button Div next to the bar */}
        <div>
           <button 
            onClick={onOpenModal}
            className="hydro-add-btn"
            aria-label="Add water"
           >
            <Plus size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Hidratacao;