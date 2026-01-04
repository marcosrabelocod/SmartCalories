import React, { useMemo } from 'react';
import { Activity, Settings2 } from 'lucide-react';
import { useExercise } from '../../IaFunctions/ExerciseContext';
import './ExerciseHeader.css';

const ExerciseHeader: React.FC = () => {
  const { burnedCalories, targetBurn, resetSetup } = useExercise();

  const percentage = useMemo(() => {
    const pct = (burnedCalories / targetBurn) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }, [burnedCalories, targetBurn]);

  return (
    <header className="ex-header-container">
      <div className="ex-header-content">
        
        <div className="ex-top-row">
          <div className="ex-icon-wrapper">
            <div className="ex-icon-box">
              <Activity size={18} className="text-white fill-white" />
            </div>
            <h1 className="ex-title">Gasto Calórico</h1>
          </div>
          
          <button 
            onClick={resetSetup}
            className="ex-settings-btn"
            aria-label="Reconfigurar"
          >
            <Settings2 size={18} />
          </button>
        </div>

        <div className="ex-stats-row">
          <span className="ex-current">{burnedCalories}</span>
          <span className="ex-target"> / {targetBurn} kcal</span>
        </div>

        <div className="ex-progress-bg">
          <div 
            className="ex-progress-fill"
            style={{ width: `${percentage}%` }}
          >
            <div className="ex-shine"></div>
            <div className="ex-particle"></div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default ExerciseHeader;