
import React, { useState } from 'react';
import { Ruler, Scale, ArrowRight, Activity } from 'lucide-react';
import { useUser } from '../IaFunctions/UserContext';
import './UserOnboarding.css';

const UserOnboarding: React.FC = () => {
  const { setPhysicalData } = useUser();
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [error, setError] = useState('');

  const handleOnlyNumbers = (val: string, setter: (v: string) => void) => {
    // Aceita apenas números e ponto/vírgula
    const cleaned = val.replace(/[^0-9.,]/g, '').replace(',', '.');
    setter(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peso || !altura) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    const p = parseFloat(peso);
    const a = parseFloat(altura);

    if (isNaN(p) || isNaN(a)) {
      setError('Insira valores numéricos válidos.');
      return;
    }

    // Fix: Added empty array for comorbidades as required by the context type
    setPhysicalData(peso, altura, []);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card animate-scale-up">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <Activity size={32} className="text-brand-primary" />
          </div>
          <h1 className="onboarding-title">Bem-vindo ao SmartCal</h1>
          <p className="onboarding-subtitle">Para começar, precisamos de alguns dados básicos.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="input-group">
            <label htmlFor="peso">Peso Atual (kg)</label>
            <div className="input-wrapper">
              <Scale size={20} className="input-icon" />
              <input 
                id="peso"
                type="text" 
                inputMode="decimal"
                value={peso}
                onChange={(e) => handleOnlyNumbers(e.target.value, setPeso)}
                placeholder="Ex: 75.5"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="altura">Altura (m)</label>
            <div className="input-wrapper">
              <Ruler size={20} className="input-icon" />
              <input 
                id="altura"
                type="text" 
                inputMode="decimal"
                value={altura}
                onChange={(e) => handleOnlyNumbers(e.target.value, setAltura)}
                placeholder="Ex: 1.75"
                required
              />
            </div>
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <button type="submit" className="onboarding-submit">
            <span>Começar Minha Jornada</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserOnboarding;
