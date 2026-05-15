import React, { useState } from 'react';
import { 
  TrendingDown, TrendingUp, Activity, ArrowLeft, 
  BicepsFlexed, Footprints, PersonStanding, Check, 
  Target, Dumbbell, ShieldCheck, Timer
} from 'lucide-react';
import { useExercise, ExerciseGoal, ExerciseFocus, ExerciseType } from '../../../IaFunctions/ExerciseContext';
import { useToast } from '../../../IaFunctions/ToastContext';
import './ExerciseOnboarding.css';

const ExerciseOnboarding: React.FC = () => {
  const { updateGoal, updateFocus, updateWorkoutType, completeSetup, resetSetup, goal, focus, workoutType } = useExercise();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);

  const handleTypeSelect = (selectedType: ExerciseType) => {
    updateWorkoutType(selectedType);
    setStep(2);
  };

  const handleGoalSelect = (selectedGoal: ExerciseGoal) => {
    updateGoal(selectedGoal);
    setStep(3);
  };

  const handleFocusSelect = (selectedFocus: ExerciseFocus) => {
    updateFocus(selectedFocus);
    setStep(4); // Agora vai para a tela de confirmação
  };

  const handleConfirmFinal = () => {
    completeSetup();
    showToast("Deseja refazer o formulário de treino?", resetSetup);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    if (step === 4) setStep(3);
  };

  const goalLabels = {
    perder_peso: { label: 'Perder Peso', icon: TrendingDown, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ganhar_massa: { label: 'Ganhar Massa', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    manter_equilibrado: { label: 'Equilibrado', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' }
  };

  const focusLabels = {
    superiores: { label: 'Superiores', icon: BicepsFlexed, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    inferiores: { label: 'Inferiores', icon: Footprints, color: 'text-red-400', bg: 'bg-red-500/10' },
    full_body: { label: 'Corpo Todo', icon: PersonStanding, color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
  };

  const typeLabels = {
    academia: { label: 'Academia', icon: Dumbbell, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
    calistenia: { label: 'Calistenia', icon: PersonStanding, color: 'text-amber-400', bg: 'bg-amber-500/10' }
  };

  const GoalIcon = goal ? goalLabels[goal].icon : Target;
  const FocusIcon = focus ? focusLabels[focus].icon : Dumbbell;
  const TypeIcon = workoutType ? typeLabels[workoutType].icon : Activity;

  return (
    <div className="onboarding-container animate-fade-in">
      
      <div className="step-indicator">
        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
        <div className="step-line"></div>
        <div className={`step-dot ${step >= 4 ? 'active' : ''}`}></div>
      </div>

      <div className="onboarding-content">

        {step === 1 && (
          <div className="step-wrapper">
            <h2 className="step-title">Qual é o seu estilo de treino?</h2>
            <p className="step-subtitle">Escolha como você prefere se exercitar.</p>
            
            <div className="cards-grid">
              <button 
                className={`selection-card ${workoutType === 'academia' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('academia')}
              >
                <div className="card-icon-box bg-zinc-500/20 text-zinc-400">
                  <Dumbbell size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Academia</span>
                  <span className="card-desc">Treinos usando aparelhos e pesos</span>
                </div>
              </button>

              <button 
                className={`selection-card ${workoutType === 'calistenia' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('calistenia')}
              >
                <div className="card-icon-box bg-amber-500/20 text-amber-400">
                  <PersonStanding size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Calistenia</span>
                  <span className="card-desc">Treinos com o peso do próprio corpo</span>
                </div>
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="step-wrapper">
            <h2 className="step-title">Qual seu objetivo principal?</h2>
            <p className="step-subtitle">Toque em uma opção para continuar.</p>
            
            <div className="cards-grid">
              <button 
                className={`selection-card ${goal === 'perder_peso' ? 'selected' : ''}`}
                onClick={() => handleGoalSelect('perder_peso')}
              >
                <div className="card-icon-box bg-blue-500/20 text-blue-400">
                  <TrendingDown size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Perder Peso</span>
                  <span className="card-desc">Foco em queima calórica</span>
                </div>
              </button>

              <button 
                className={`selection-card ${goal === 'ganhar_massa' ? 'selected' : ''}`}
                onClick={() => handleGoalSelect('ganhar_massa')}
              >
                <div className="card-icon-box bg-orange-500/20 text-orange-400">
                  <TrendingUp size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Ganhar Massa</span>
                  <span className="card-desc">Foco em hipertrofia</span>
                </div>
              </button>

              <button 
                className={`selection-card ${goal === 'manter_equilibrado' ? 'selected' : ''}`}
                onClick={() => handleGoalSelect('manter_equilibrado')}
              >
                <div className="card-icon-box bg-green-500/20 text-green-400">
                  <Activity size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Equilibrado</span>
                  <span className="card-desc">Saúde e bem-estar</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-wrapper animate-slide-left">
            <h2 className="step-title">Qual o foco do treino?</h2>
            <p className="step-subtitle">Selecione para avançar.</p>
            
            <div className="cards-grid">
              <button 
                className={`selection-card ${focus === 'superiores' ? 'selected' : ''}`}
                onClick={() => handleFocusSelect('superiores')}
              >
                <div className="card-icon-box bg-purple-500/20 text-purple-400">
                  <BicepsFlexed size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Superiores</span>
                  <span className="card-desc">Braços, Peito e Costas</span>
                </div>
              </button>

              <button 
                className={`selection-card ${focus === 'inferiores' ? 'selected' : ''}`}
                onClick={() => handleFocusSelect('inferiores')}
              >
                <div className="card-icon-box bg-red-500/20 text-red-400">
                  <Footprints size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Inferiores</span>
                  <span className="card-desc">Pernas e Glúteos</span>
                </div>
              </button>

              <button 
                className={`selection-card ${focus === 'full_body' ? 'selected' : ''}`}
                onClick={() => handleFocusSelect('full_body')}
              >
                <div className="card-icon-box bg-cyan-500/20 text-cyan-400">
                  <PersonStanding size={32} />
                </div>
                <div className="card-text">
                  <span className="card-label">Corpo Todo</span>
                  <span className="card-desc">Treino funcional completo</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 4 && goal && focus && workoutType && (
          <div className="step-wrapper animate-scale-up-light">
            <h2 className="step-title">Confirmar Configuração</h2>
            <p className="step-subtitle">Revise suas escolhas antes de gerar o treino.</p>
            
            <div className="review-container">
              <div className="review-item">
                <div className={`review-icon ${typeLabels[workoutType].bg}`}>
                  <TypeIcon className={typeLabels[workoutType].color} size={24} />
                </div>
                <div className="review-info">
                  <span className="review-label">Estilo</span>
                  <span className="review-value">{typeLabels[workoutType].label}</span>
                </div>
              </div>

              <div className="review-item">
                <div className={`review-icon ${goalLabels[goal].bg}`}>
                  <GoalIcon className={goalLabels[goal].color} size={24} />
                </div>
                <div className="review-info">
                  <span className="review-label">Objetivo</span>
                  <span className="review-value">{goalLabels[goal].label}</span>
                </div>
              </div>

              <div className="review-item">
                <div className={`review-icon ${focusLabels[focus].bg}`}>
                  <FocusIcon className={focusLabels[focus].color} size={24} />
                </div>
                <div className="review-info">
                  <span className="review-label">Foco do Treino</span>
                  <span className="review-value">{focusLabels[focus].label}</span>
                </div>
              </div>

              <div className="review-footer-msg">
                <ShieldCheck size={14} className="text-brand-success" />
                <span>Nossa IA criará a série ideal para você.</span>
              </div>
            </div>

            <button onClick={handleConfirmFinal} className="confirm-setup-btn">
              <Check size={20} />
              <span>Confirmar e Gerar Treino</span>
            </button>
          </div>
        )}

      </div>

      <div className="onboarding-footer-minimal">
        {step > 1 && (
          <button onClick={handleBack} className="nav-btn-back-only">
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseOnboarding;