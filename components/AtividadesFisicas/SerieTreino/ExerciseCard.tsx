import React, { useState } from 'react';
import { Check, RefreshCw, ChevronDown, Info, Flame, Target, XCircle, CheckCircle2 } from 'lucide-react';
import { ExerciseItem } from '../../../types';
import './ExerciseCard.css';

interface Props {
  exercise: ExerciseItem;
  onComplete: (id: string, percentage?: number) => void;
  onReplace: (id: string, currentName: string) => void;
}

const ExerciseCard: React.FC<Props> = ({ exercise, onComplete, onReplace }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [showPartial, setShowPartial] = useState(false);
  const [partialValue, setPartialValue] = useState(50);

  const handleReplace = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReplacing(true);
    await onReplace(exercise.id, exercise.name);
    setIsReplacing(false);
  };

  const handlePartialSubmit = () => {
    onComplete(exercise.id, partialValue);
    setShowPartial(false);
  };

  return (
    <div className={`exercise-card ${exercise.completed ? 'completed' : ''}`}>
      
      <div className="ec-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="ec-title-section">
          <h3 className="ec-name">{exercise.name}</h3>
          <div className="ec-badges">
            <span className="ec-badge">{exercise.series} séries</span>
            <span className="ec-badge">{exercise.reps}</span>
            {exercise.completed && exercise.completionPercentage && exercise.completionPercentage < 100 && (
              <span className="ec-badge partial-badge">{exercise.completionPercentage}% concluído</span>
            )}
          </div>
        </div>
        <div className="ec-chevron">
          {exercise.completed ? (
             <Check size={20} className={exercise.completionPercentage === 100 ? "text-brand-success" : "text-brand-warning"} />
          ) : (
             <ChevronDown size={20} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {(isExpanded || !exercise.completed) && (
        <div className="ec-details animate-slide-down">
          
          <div className="ec-info-grid">
            <div className="ec-info-item">
              <Target size={14} className="text-brand-accent" />
              <span>{exercise.purpose}</span>
            </div>
            <div className="ec-info-item">
              <Flame size={14} className="text-brand-warning" />
              <span>~{exercise.caloriesEstimate} kcal</span>
            </div>
          </div>

          <div className="ec-instructions">
            <Info size={14} className="ec-inst-icon" />
            <p>{exercise.instructions}</p>
          </div>

          <div className="ec-actions">
            {!exercise.completed && !showPartial && (
              <div className="ec-action-group">
                <button 
                  onClick={handleReplace} 
                  className="ec-btn-secondary"
                  disabled={isReplacing}
                >
                  <RefreshCw size={16} className={isReplacing ? 'animate-spin' : ''} />
                  Trocar
                </button>

                <button 
                  onClick={() => setShowPartial(true)} 
                  className="ec-btn-danger"
                >
                  <XCircle size={16} />
                  Incompleto
                </button>
                
                <button 
                  onClick={() => onComplete(exercise.id)} 
                  className="ec-btn-complete"
                >
                  <Check size={16} />
                  Concluir
                </button>
              </div>
            )}

            {showPartial && (
              <div className="ec-partial-container animate-fade-in">
                <div className="ec-partial-header">
                  <span>Quanto você conseguiu fazer?</span>
                  <span className="ec-partial-val">{partialValue}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={partialValue} 
                  onChange={(e) => setPartialValue(parseInt(e.target.value))}
                  className="ec-range"
                />
                <div className="ec-partial-footer">
                   <button onClick={() => setShowPartial(false)} className="ec-btn-text">Cancelar</button>
                   <button onClick={handlePartialSubmit} className="ec-btn-confirm-partial">Confirmar</button>
                </div>
              </div>
            )}

             {exercise.completed && (
                 <div className="ec-completed-msg">
                    <CheckCircle2 size={16} />
                    <span>Exercício Finalizado</span>
                 </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;