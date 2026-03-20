import React, { useState, useMemo } from 'react';
import { Ruler, Scale, ArrowRight, Activity, ShieldAlert, User, Calendar, Plus, X } from 'lucide-react';
import { useUser } from '../../IaFunctions/UserContext';
import { useToast } from '../../IaFunctions/ToastContext';
import './UserOnboarding.css';

const UserOnboarding: React.FC = () => {
  const { setPhysicalData, resetUserSetup } = useUser();
  const { showToast } = useToast();
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('170'); // Default 1.70m
  const [genero, setGenero] = useState('Masculino');
  const [dataNascimento, setDataNascimento] = useState('');
  const [selectedComorbidades, setSelectedComorbidades] = useState<string[]>([]);
  const [customComorbidade, setCustomComorbidade] = useState('');
  const [error, setError] = useState('');

  const alturaOptions = useMemo(() => {
    const options = [];
    for (let i = 130; i <= 215; i++) {
      options.push(i);
    }
    return options;
  }, []);

  const toggleComorbidade = (item: string) => {
    setSelectedComorbidades(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const addCustomComorbidade = () => {
    const trimmed = customComorbidade.trim();
    if (!trimmed) return;
    
    if (!selectedComorbidades.includes(trimmed)) {
      setSelectedComorbidades(prev => [...prev, trimmed]);
    }
    setCustomComorbidade('');
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomComorbidade();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peso || !altura || !dataNascimento) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const p = parseFloat(peso.replace(',', '.'));
    if (isNaN(p) || p <= 0) {
      setError('Insira um peso válido.');
      return;
    }

    const birthDate = new Date(dataNascimento);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      setError('Insira uma data de nascimento válida.');
      return;
    }

    const alturaMetros = (parseInt(altura) / 100).toFixed(2);
    setPhysicalData(p.toString(), alturaMetros, genero, dataNascimento, selectedComorbidades);
    
    // Dispara o Toast ao finalizar com mensagem clara para o usuário
    showToast("Deseja refazer o formulário de perfil?", resetUserSetup);
  };


  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card animate-scale-up">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <Activity size={32} className="text-brand-primary" />
          </div>
          <h1 className="onboarding-title">Sua Bio-Ficha</h1>
          <p className="onboarding-subtitle">Personalize sua experiência SmartCal.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="onboarding-row">
            <div className="input-group">
              <label>Peso (kg)</label>
              <div className="input-wrapper">
                <Scale size={18} className="input-icon" />
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value.replace(/[^0-9.,]/g, ''))}
                  placeholder="75.0"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Altura (cm)</label>
              <div className="input-wrapper">
                <Ruler size={18} className="input-icon" />
                <select 
                  value={altura} 
                  onChange={(e) => setAltura(e.target.value)}
                  className="onboarding-select"
                >
                  {alturaOptions.map(val => (
                    <option key={val} value={val}>{val} cm</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Data de Nascimento</label>
            <div className="input-wrapper">
              <Calendar size={18} className="input-icon" />
              <input 
                type="date" 
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Gênero</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <select 
                value={genero} 
                onChange={(e) => setGenero(e.target.value)}
                className="onboarding-select"
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="comorbidades-section">
            <label className="section-label">
              <ShieldAlert size={14} />
              Condições e Alergias
            </label>
            
            <div className="custom-comorbidade-input">
              <input 
                type="text"
                value={customComorbidade}
                onChange={(e) => setCustomComorbidade(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="Adicionar outra condição..."
              />
              <button type="button" onClick={addCustomComorbidade} className="add-custom-btn">
                <Plus size={18} />
              </button>
            </div>

            <div className="tags-grid">
              {selectedComorbidades.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleComorbidade(item)}
                  className="health-tag active custom-tag"
                >
                  {item}
                  <X size={12} className="ml-1" />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <button type="submit" className="onboarding-submit">
            <span>Configurar Perfil</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserOnboarding;