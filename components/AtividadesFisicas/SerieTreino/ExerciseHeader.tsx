import React, { useMemo, useState, useEffect } from 'react';
import { Activity, Settings2, Zap, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useExercise } from '../../../IaFunctions/ExerciseContext';
import './ExerciseHeader.css';

const ExerciseHeader: React.FC = () => {
  const { burnedCalories, targetBurn, resetSetup, workoutPlan } = useExercise();
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  const percentage = useMemo(() => {
    const pct = (burnedCalories / targetBurn) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }, [burnedCalories, targetBurn]);

  const isWorkoutComplete = useMemo(() => {
    return workoutPlan.length > 0 && workoutPlan.every(ex => ex.completed);
  }, [workoutPlan]);

  useEffect(() => {
    if (isWorkoutComplete && !hasShownPopup) {
      setShowCongratsPopup(true);
      setHasShownPopup(true);
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setShowCongratsPopup(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isWorkoutComplete, hasShownPopup]);

  return (
    <>
      <header className="ex-header-container">
        <div className="ex-header-content">
          
          <div className="ex-top-row">
            <div className="ex-icon-wrapper">
              <div className="ex-icon-box">
                <Activity size={18} className="text-white fill-white" />
              </div>
              <h1 className="ex-title">Gasto Calórico</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center p-2 rounded-full transition-colors ${isWorkoutComplete ? 'bg-yellow-500/10' : 'bg-slate-800/50'}`}>
                <Zap 
                  size={18} 
                  className={`transition-colors ${isWorkoutComplete ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`} 
                />
              </div>
              
              <button 
                onClick={resetSetup}
                className="ex-settings-btn"
                aria-label="Reconfigurar"
              >
                <Settings2 size={18} />
              </button>
            </div>
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

      <AnimatePresence>
        {showCongratsPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-indigo-900 border border-indigo-500/30 p-6 rounded-2xl shadow-xl w-full max-w-sm relative text-center"
            >
              <button 
                onClick={() => setShowCongratsPopup(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
              
              <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} className="text-yellow-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Parabéns!</h2>
              <p className="text-indigo-200">
                Você completou todas as séries do seu treino de hoje. Continue com esse foco incrível!
              </p>
              
              <button 
                onClick={() => setShowCongratsPopup(false)}
                className="mt-6 w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-xl transition-colors"
              >
                Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExerciseHeader;