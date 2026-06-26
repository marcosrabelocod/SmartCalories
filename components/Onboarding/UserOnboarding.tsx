import React, { useState, useMemo } from 'react';
import { Ruler, Scale, ArrowRight, Activity, ShieldAlert, User, Calendar, Plus, X, MapPin, Pill, DollarSign, ArrowLeft, Check } from 'lucide-react';
import { useUser } from '../../IaFunctions/UserContext';
import { useToast } from '../../IaFunctions/ToastContext';
import './UserOnboarding.css';

const consumosOptions = ['Suplementos alimentares', 'Álcool', 'Cigarro', 'Outros'];

const preSelectedComorbidades = ['Diabete', 'Artrose', 'Alergia a amendoim', 'Gravidez'];

const UserOnboarding: React.FC = () => {
  const { setPhysicalData, resetUserSetup } = useUser();
  const { showToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('170');
  const [genero, setGenero] = useState('Masculino');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cidade, setCidade] = useState('');
  
  const [selectedComorbidades, setSelectedComorbidades] = useState<string[]>([]);
  const [customComorbidade, setCustomComorbidade] = useState('');
  const [consumos, setConsumos] = useState<string[]>([]);
  
  const [medicamentos, setMedicamentos] = useState<string[]>([]);
  const [customMedicamento, setCustomMedicamento] = useState('');
  
  const [gastoAlimentacao, setGastoAlimentacao] = useState('');
  
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

  const toggleConsumo = (item: string) => {
    setConsumos(prev => 
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

  const addCustomMedicamento = () => {
    const trimmed = customMedicamento.trim();
    if (!trimmed) return;
    
    if (!medicamentos.includes(trimmed)) {
      setMedicamentos(prev => [...prev, trimmed]);
    }
    setCustomMedicamento('');
  };

  const handleMedicamentoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomMedicamento();
    }
  };

  const removeMedicamento = (item: string) => {
    setMedicamentos(prev => prev.filter(i => i !== item));
  };

  const handleNext = () => {
    if (!peso || !altura || !dataNascimento || !cidade) {
      setError('Por favor, preencha todos os campos obrigatórios da primeira página.');
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
    
    setError('');
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }

    const p = parseFloat(peso.replace(',', '.'));
    const alturaMetros = (parseInt(altura) / 100).toFixed(2);
    setPhysicalData(
      p.toString(), 
      alturaMetros, 
      genero, 
      dataNascimento, 
      cidade, 
      selectedComorbidades,
      consumos,
      medicamentos,
      gastoAlimentacao
    );
    
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
          <p className="onboarding-subtitle">Passo {step} de 2</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {step === 1 ? (
            <>
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

              <div className="input-group">
                <label>Cidade</label>
                <div className="input-wrapper">
                  <MapPin size={18} className="input-icon" />
                  <input 
                    type="text" 
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Sua cidade atual"
                    required
                  />
                </div>
              </div>

              {error && <p className="onboarding-error">{error}</p>}

              <button type="button" onClick={handleNext} className="onboarding-submit">
                <span>Próximo Passo</span>
                <ArrowRight size={20} />
              </button>
            </>
          ) : (
            <>
              <div className="comorbidades-section">
                <label className="section-label">
                  <ShieldAlert size={14} />
                  Comorbidades
                </label>

                <div className="tags-grid mb-3">
                  {preSelectedComorbidades.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleComorbidade(option)}
                      className={`health-tag ${selectedComorbidades.includes(option) ? 'active' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="custom-comorbidade-input">
                  <input 
                    type="text"
                    value={customComorbidade}
                    onChange={(e) => setCustomComorbidade(e.target.value)}
                    onKeyDown={handleCustomKeyDown}
                    placeholder="Adicionar condição..."
                  />
                  <button type="button" onClick={addCustomComorbidade} className="add-custom-btn">
                    <Plus size={18} />
                  </button>
                </div>

                <div className="tags-grid">
                  {selectedComorbidades.filter(item => !preSelectedComorbidades.includes(item)).map(item => (
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

              <div className="comorbidades-section">
                <label className="section-label">Você consome regularmente:</label>
                <div className="tags-grid consumption-grid">
                  {consumosOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleConsumo(option)}
                      className={`health-tag ${consumos.includes(option) ? 'active' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="comorbidades-section">
                <label className="section-label">Medicamentos controlados</label>
                
                <div className="custom-comorbidade-input">
                  <input 
                    type="text"
                    value={customMedicamento}
                    onChange={(e) => setCustomMedicamento(e.target.value)}
                    onKeyDown={handleMedicamentoKeyDown}
                    placeholder="Ex: Insulina, Losartana (Opcional)"
                  />
                  <button type="button" onClick={addCustomMedicamento} className="add-custom-btn">
                    <Plus size={18} />
                  </button>
                </div>

                <div className="tags-grid">
                  {medicamentos.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => removeMedicamento(item)}
                      className="health-tag active custom-tag"
                    >
                      {item}
                      <X size={12} className="ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Quanto gasta com alimentação por mês (sua parte)?</label>
                <div className="input-wrapper">
                  <DollarSign size={18} className="input-icon" />
                  <select 
                    value={gastoAlimentacao} 
                    onChange={(e) => setGastoAlimentacao(e.target.value)}
                    className="onboarding-select"
                  >
                    <option value="" disabled>Selecione uma faixa</option>
                    <option value="Ate 500">Até R$ 500</option>
                    <option value="500 a 1000">R$ 500 a R$ 1.000</option>
                    <option value="1000 a 1500">R$ 1.000 a R$ 1.500</option>
                    <option value="1500 a 2000">R$ 1.500 a R$ 2.000</option>
                    <option value="Mais de 2000">Mais de R$ 2.000</option>
                  </select>
                </div>
              </div>

              {error && <p className="onboarding-error">{error}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="onboarding-back-btn flex-1 flex justify-center items-center py-3 bg-slate-800 text-white rounded-xl font-medium">
                  <ArrowLeft size={20} className="mr-2" />
                  Voltar
                </button>
                <button type="submit" className="onboarding-submit flex-[2]">
                  <span>Configurar Perfil</span>
                  <Check size={20} className="ml-2" />
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserOnboarding;