import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import './Calorias.css';

interface CaloriasProps {
  current: number;
  total: number;
}

const Calorias: React.FC<CaloriasProps> = ({ current, total }) => {
  const calPercentage = useMemo(() => {
    const pct = (current / total) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }, [current, total]);

  const calColorClass = useMemo(() => {
    if (calPercentage < 50) return 'bg-brand-success'; 
    if (calPercentage < 85) return 'bg-brand-warning'; 
    return 'bg-brand-danger'; 
  }, [calPercentage]);

  const calRemaining = total - current;

  return (
    <div>
      <div className="cal-header">
        <div className="cal-icon-wrapper">
          <div className="cal-icon-box">
            <Flame size={16} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="cal-title">Calorias</h1>
          </div>
        </div>
        <div className="cal-stats">
          <span className={`cal-current ${calRemaining < 0 ? 'text-brand-danger' : 'text-brand-warning'}`}>
            {current}
          </span>
          <span className="cal-total"> / {total}</span>
        </div>
      </div>

      <div className="cal-bar-bg">
        <div 
          className={`cal-bar-fill ${calColorClass}`}
          style={{ width: `${calPercentage}%` }}
        >
          <div className="cal-shine"></div>
        </div>
      </div>
    </div>
  );
};

export default Calorias;