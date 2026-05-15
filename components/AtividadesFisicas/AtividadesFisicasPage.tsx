import React, { useEffect, useState } from 'react';
import { useExercise } from '../../IaFunctions/ExerciseContext';
import { useGemini } from '../../services/geminiService';
import { useToast } from '../../IaFunctions/ToastContext';
import { useConquistas } from '../../IaFunctions/ConquistasContext';
import ExerciseOnboarding from './SerieTreino/ExerciseOnboarding';
import ExerciseHeader from './SerieTreino/ExerciseHeader';
import ExerciseCard from './SerieTreino/ExerciseCard';
import AtividadeTimeline from './Diario/AtividadeTimeline';
import { Dumbbell, Plus, Loader2, Timer } from 'lucide-react';
import './AtividadesFisicasTabs.css';

const AtividadesFisicasPage: React.FC = () => {
  const { 
    isSetup, 
    addBurnedCalories, 
    workoutPlan, 
    setWorkoutPlan, 
    markExerciseComplete, 
    replaceExerciseInPlan,
    resetSetup,
    goal,
    focus,
    workoutType
  } = useExercise();
  
  const { unlockConquista } = useConquistas();
  const { generateWorkoutPlan, suggestReplacementExercise } = useGemini();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'atividade_fisica' | 'treino'>('atividade_fisica');

  useEffect(() => {
    if (workoutPlan.length > 0 && workoutPlan.every(e => e.completed)) {
      unlockConquista('treino_completo');
    }
  }, [workoutPlan, unlockConquista]);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (activeTab === 'atividade_fisica') return;
      
      if (isSetup && workoutPlan.length === 0 && goal && focus && !isLoading) {
        setIsLoading(true);
        const newPlan = await generateWorkoutPlan(goal, focus, workoutType || 'academia');
        if (newPlan.length > 0) {
          setWorkoutPlan(newPlan);
        }
        setIsLoading(false);
      }
    };

    fetchWorkout();
  }, [isSetup, workoutPlan.length, goal, focus, workoutType, activeTab]);

  const handleReplaceExercise = async (id: string, currentName: string) => {
    if (!goal || !focus || !workoutType) return;
    
    const newExercise = await suggestReplacementExercise(currentName, goal, focus, workoutType);
    if (newExercise) {
      replaceExerciseInPlan(id, newExercise);
    }
  };

  return (
    <>
      <ExerciseHeader />
      
      <div className={`folder-tabs-wrapper ${activeTab === 'atividade_fisica' ? 'active-left' : 'active-right'}`}>
        <button 
          className={`folder-tab ${activeTab === 'atividade_fisica' ? 'active' : ''}`}
          onClick={() => setActiveTab('atividade_fisica')}
        >
          <Timer size={18} />
          <span>Atividade Física</span>
        </button>
        <button 
          className={`folder-tab ${activeTab === 'treino' ? 'active' : ''}`}
          onClick={() => setActiveTab('treino')}
        >
          <Dumbbell size={18} />
          <span>Série de Treino</span>
        </button>
      </div>

      <main className="main-content folder-content-area">
        {activeTab === 'atividade_fisica' ? (
          <AtividadeTimeline />
        ) : (
          !isSetup ? (
            <div className="flex flex-col justify-center animate-fade-in mt-4">
              <div className="flex flex-col items-center gap-2 mb-6">
                 <div className="p-3 bg-brand-accent/20 rounded-full text-brand-accent">
                     <Dumbbell size={32} />
                 </div>
                 <h1 className="text-2xl font-bold text-white">Configurar Treino</h1>
              </div>
              <ExerciseOnboarding />
            </div>
          ) : isLoading && workoutPlan.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[30vh] text-center gap-4 animate-fade-in mt-8">
               <Loader2 size={40} className="text-brand-accent animate-spin" />
               <p className="text-slate-400">Criando seu treino personalizado...</p>
            </div>
          ) : workoutPlan.length > 0 ? (
             <div className="flex flex-col gap-2 animate-fade-in pb-20 mt-2">
                <div className="flex justify-between items-center mb-2 px-1">
                   <h2 className="text-lg font-semibold text-white">Sua Série de Hoje</h2>
                   <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      {workoutPlan.filter(e => e.completed).length}/{workoutPlan.length}
                   </span>
                </div>
                
                {workoutPlan.map(exercise => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise}
                    onComplete={markExerciseComplete}
                    onReplace={handleReplaceExercise}
                  />
                ))}

                {workoutPlan.every(e => e.completed) && (
                  <div className="mt-6 p-4 bg-brand-success/10 border border-brand-success/30 rounded-xl text-center">
                      <h3 className="text-brand-success font-bold text-lg mb-1">Treino Concluído!</h3>
                      <p className="text-slate-300 text-sm">Ótimo trabalho hoje.</p>
                  </div>
                )}
             </div>
          ) : (
             <div className="flex flex-col gap-4 animate-fade-in mt-4">
                <div className="bg-brand-card p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 text-center min-h-[30vh]">
                     <div className="p-4 bg-brand-card border border-dashed border-slate-600 rounded-full text-slate-500">
                        <Dumbbell size={32} />
                     </div>
                     <div>
                        <h3 className="text-white font-semibold">Sem exercícios</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Não foi possível gerar o treino. Tente reconfigurar.
                        </p>
                     </div>
                     
                     <button 
                        onClick={() => addBurnedCalories(50)} 
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-lg transition-colors border border-brand-primary/20"
                     >
                        <Plus size={16} />
                        Simular Atividade (+50kcal)
                     </button>
                </div>
             </div>
          )
        )}
      </main>
    </>
  );
};

export default AtividadesFisicasPage;