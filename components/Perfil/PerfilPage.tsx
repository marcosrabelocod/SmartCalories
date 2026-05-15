import React, { useState, useEffect } from 'react';
import { useUser } from '../../IaFunctions/UserContext';
import { User, Weight, Ruler, Calendar, Activity, Save, CheckCircle, BarChart2, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';
import ConquistasList from './Conquistas/ConquistasList';
import './PerfilPage.css';

// Mock data for charts (1 month)
const generateMockData = (baseValue: number, variance: number, days: number = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      value: Math.round(baseValue + (Math.random() - 0.5) * variance)
    });
  }
  return data;
};

// ... existing code ...
const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const PerfilPage: React.FC = () => {
  const { userData, updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState<'graficos' | 'conquistas'>('graficos');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    peso: userData.atributos.Peso,
    altura: userData.atributos.Altura,
    genero: userData.atributos.genero,
    dataNascimento: userData.atributos.dataNascimento,
    comorbidades: userData.saude.comorbidades.join(', ')
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data for charts
  const consumptionData = generateMockData(2200, 400);
  const burnData = generateMockData(400, 200);
  const weightData = generateMockData(parseFloat(userData.atributos.Peso) || 75, 2);

  const handleSave = () => {
    updateUserData({
      atributos: {
        ...userData.atributos,
        Peso: formData.peso,
        Altura: formData.altura,
        genero: formData.genero,
        dataNascimento: formData.dataNascimento
      },
      saude: {
        comorbidades: formData.comorbidades.split(',').map(s => s.trim()).filter(s => s !== '')
      }
    });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <h1 className="perfil-title">Meu Perfil</h1>
        <button 
          className={`edit-toggle ${isEditing ? 'active' : ''}`}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? <Save size={20} /> : <User size={20} />}
          <span>{isEditing ? 'Salvar' : 'Editar'}</span>
        </button>
      </header>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="success-toast"
        >
          <CheckCircle size={18} />
          <span>Dados atualizados com sucesso!</span>
        </motion.div>
      )}

      <div className="perfil-tabs">
        <button 
          className={`perfil-tab ${activeTab === 'graficos' ? 'active' : ''}`}
          onClick={() => setActiveTab('graficos')}
        >
          <BarChart2 size={18} />
          Gráficos
        </button>
        <button 
          className={`perfil-tab ${activeTab === 'conquistas' ? 'active' : ''}`}
          onClick={() => setActiveTab('conquistas')}
        >
          <Award size={18} />
          Conquistas
        </button>
      </div>

      <main className="perfil-content">
        <section className="user-info-card">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">
                <Weight size={16} />
                <span>Peso (kg)</span>
              </div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.peso} 
                  onChange={e => setFormData({...formData, peso: e.target.value})}
                  className="info-input"
                />
              ) : (
                <div className="info-value">{userData.atributos.Peso} kg</div>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <Ruler size={16} />
                <span>Altura (cm)</span>
              </div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.altura} 
                  onChange={e => setFormData({...formData, altura: e.target.value})}
                  className="info-input"
                />
              ) : (
                <div className="info-value">{userData.atributos.Altura} cm</div>
              )}
            </div>

            <div className="info-item full-width">
              <div className="info-label">
                <Calendar size={16} />
                <span>{isEditing ? 'Data de Nascimento' : 'Idade'}</span>
              </div>
              {isEditing ? (
                <input 
                  type="date" 
                  value={formData.dataNascimento} 
                  onChange={e => setFormData({...formData, dataNascimento: e.target.value})}
                  className="info-input"
                />
              ) : (
                <div className="info-value">{calculateAge(userData.atributos.dataNascimento)} anos</div>
              )}
            </div>

            <div className="info-item full-width">
              <div className="info-label">
                <User size={16} />
                <span>Gênero</span>
              </div>
              {isEditing ? (
                <select 
                  value={formData.genero} 
                  onChange={e => setFormData({...formData, genero: e.target.value})}
                  className="info-input"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              ) : (
                <div className="info-value">{userData.atributos.genero}</div>
              )}
            </div>
          </div>

          <div className="info-item full-width">
            <div className="info-label">
              <Activity size={16} />
              <span>Comorbidades / Condições</span>
            </div>
            {isEditing ? (
              <textarea 
                value={formData.comorbidades} 
                onChange={e => setFormData({...formData, comorbidades: e.target.value})}
                className="info-input text-area"
                placeholder="Ex: Diabetes, Hipertensão (separados por vírgula)"
              />
            ) : (
              <div className="info-value tags">
                {userData.saude.comorbidades.length > 0 ? (
                  userData.saude.comorbidades.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))
                ) : (
                  <span className="no-tags">Nenhuma informada</span>
                )}
              </div>
            )}
          </div>
        </section>

        {activeTab === 'graficos' ? (
          <section className="charts-section">
            <div className="chart-card">
              <h3 className="chart-title">Consumo de Calorias (30 dias)</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={consumptionData}>
                    <defs>
                      <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} interval={6} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorCons)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Queima de Calorias (30 dias)</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={burnData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} interval={6} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Evolução do Peso (30 dias)</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} interval={6} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        ) : (
          <section className="conquistas-section">
            <ConquistasList />
          </section>
        )}
      </main>
    </div>
  );
};

export default PerfilPage;
