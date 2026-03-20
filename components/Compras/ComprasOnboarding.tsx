import React, { useState } from 'react';
import { Wallet, Calendar, Target, ArrowRight, ArrowLeft, Loader2, TrendingUp, TrendingDown, Activity, Coffee, Sun, Moon, Cookie } from 'lucide-react';
import { useExercise } from '../../IaFunctions/ExerciseContext';
import './ComprasOnboarding.css';

interface Props {
  onGenerate: (budget: number, duration: string, goal: string) => Promise<void>;
}

const MEAL_TYPES = [
  { id: 'café da manhã', label: 'Café da Manhã', icon: Coffee },
  { id: 'almoço', label: 'Almoço', icon: Sun },
  { id: 'jantar', label: 'Jantar', icon: Moon },
  { id: 'lanche', label: 'Lanche', icon: Cookie }
];

const ComprasOnboarding: React.FC<Props> = ({ onGenerate }) => {
  const { goal: exerciseGoal, updateGoal } = useExercise();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('Semanal');
  const [specificMeal, setSpecificMeal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (duration === 'Refeição Única') {
        setStep(1.5);
      } else {
        setStep(2);
      }
    } else if (step === 1.5 && specificMeal) {
      setStep(2);
    } else if (step === 2 && budget) {
      goToGoalStep();
    }
  };

  const goToGoalStep = () => {
    if (!exerciseGoal) {
      setStep(3);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (step === 1.5) setStep(1);
    else if (step === 2) {
      duration === 'Refeição Única' ? setStep(1.5) : setStep(1);
    }
    else if (step === 3) setStep(2);
  };

  const handleFinalSubmit = async (finalGoal?: any) => {
    const activeGoal = finalGoal || exerciseGoal || 'manter_equilibrado';
    const finalDurationText = duration === 'Refeição Única' ? `Uma refeição (${specificMeal})` : duration;
    
    setLoading(true);
    await onGenerate(parseFloat(budget), finalDurationText, activeGoal);
    setLoading(false);
  };

  const handleGoalSelect = (selectedGoal: any) => {
    updateGoal(selectedGoal);
    handleFinalSubmit(selectedGoal);
  };

  const handleMealSelect = (meal: string) => {
    setSpecificMeal(meal);
  };

  return (
    <div className="shop-onboarding-container">
      <div className="shop-onboarding-card">
        <div className="shop-onboarding-header">
          <div className="step-dots">
            <div className={`dot ${step >= 1 ? 'active' : ''}`}></div>
            {duration === 'Refeição Única' && <div className={`dot ${step >= 1.5 ? 'active' : ''}`}></div>}
            <div className={`dot ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`dot ${step >= 3 ? 'active' : ''}`}></div>
          </div>
          <h2 className="shop-onboarding-title">Assistente de Compras</h2>
          <p className="shop-onboarding-subtitle">Vamos criar a lista perfeita para você.</p>
        </div>

        <div className="shop-onboarding-steps">
          {step === 1 && (
            <div className="onboarding-step animate-fade-in">
              <label className="input-label"><Calendar size={16} /> Para quanto tempo?</label>
              <div className="duration-grid">
                {['Refeição Única', 'Semanal', 'Mensal'].map(d => (
                  <button 
                    key={d} 
                    className={`duration-btn ${duration === d ? 'active' : ''}`}
                    onClick={() => setDuration(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="onboarding-footer-btns">
                <button 
                  className="onboarding-next-btn full-width" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Próximo <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
          )}

          {step === 1.5 && (
            <div className="onboarding-step animate-fade-in">
              <label className="input-label"><Calendar size={16} /> Qual refeição deseja planejar?</label>
              <div className="meal-selection-grid">
                {MEAL_TYPES.map(meal => (
                  <button 
                    key={meal.id} 
                    className={`meal-type-card ${specificMeal === meal.id ? 'active' : ''}`}
                    onClick={() => handleMealSelect(meal.id)}
                  >
                    <meal.icon size={24} />
                    <span>{meal.label}</span>
                  </button>
                ))}
              </div>
              <div className="onboarding-footer-btns split">
                <button className="onboarding-back-btn" onClick={handleBack} disabled={loading}>
                  <ArrowLeft size={18} />
                </button>
                <button 
                  className="onboarding-next-btn flex-1" 
                  onClick={handleNext}
                  disabled={!specificMeal || loading}
                >
                  Próximo <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step animate-fade-in">
              <label className="input-label"><Wallet size={16} /> Qual seu orçamento?</label>
              <div className="budget-input-wrapper">
                <span className="currency-prefix">R$</span>
                <input 
                  type="number" 
                  value={budget} 
                  onChange={e => setBudget(e.target.value)}
                  placeholder="Ex: 200"
                  className="budget-input"
                  autoFocus
                />
              </div>
              <div className="onboarding-footer-btns split">
                <button className="onboarding-back-btn" onClick={handleBack} disabled={loading}>
                  <ArrowLeft size={18} />
                </button>
                <button 
                  className="onboarding-next-btn flex-1" 
                  disabled={!budget || loading}
                  onClick={handleNext}
                >
                  Próximo <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step animate-fade-in">
              <label className="input-label"><Target size={16} /> Qual seu foco atual?</label>
              <div className="goal-options-grid">
                <button className="goal-card" onClick={() => handleGoalSelect('perder_peso')}>
                  <TrendingDown className="text-blue-400" />
                  <span>Perder Peso</span>
                </button>
                <button className="goal-card" onClick={() => handleGoalSelect('ganhar_massa')}>
                  <TrendingUp className="text-orange-400" />
                  <span>Ganhar Massa</span>
                </button>
                <button className="goal-card" onClick={() => handleGoalSelect('manter_equilibrado')}>
                  <Activity className="text-green-400" />
                  <span>Saudável</span>
                </button>
              </div>
              <div className="onboarding-footer-btns">
                <button className="onboarding-back-btn text-link" onClick={handleBack} disabled={loading}>
                  <ArrowLeft size={16} /> Voltar
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="onboarding-loading-overlay">
              <Loader2 className="animate-spin text-brand-primary" size={48} />
              <p>IA organizando seu carrinho...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprasOnboarding;