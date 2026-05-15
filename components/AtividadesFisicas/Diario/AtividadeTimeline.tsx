import React, { useState } from 'react';
import { useExercise } from '../../../IaFunctions/ExerciseContext';
import { Plus, Timer, Trash2, Activity } from 'lucide-react';
import './AtividadeTimeline.css';

const AtividadeTimeline: React.FC = () => {
  const { dailyActivities, addDailyActivity, removeDailyActivity } = useExercise();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState<'segundos' | 'minutos' | 'horas'>('minutos');
  
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };
  const [time, setTime] = useState(getCurrentTime());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !duration) return;
    addDailyActivity(name, parseInt(duration), durationUnit, time);
    setName('');
    setDuration('');
    setDurationUnit('minutos');
    setTime(getCurrentTime());
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-20">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg font-semibold text-white">Diário de Atividades</h2>
      </div>

      {dailyActivities.length === 0 ? (
        <div className="bg-brand-card p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-brand-card border border-dashed border-slate-600 rounded-full text-slate-500">
            <Activity size={32} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Nenhuma atividade hoje</h3>
            <p className="text-sm text-slate-400 mt-1">
              Registre suas corridas, pedaladas ou esportes abaixo.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 relative pl-4">
          <div className="absolute left-6 top-2 bottom-2 w-[2px] bg-slate-700/50"></div>
          
          {dailyActivities.map((activity) => (
            <div key={activity.id} className="relative flex items-center gap-4">
              <div className="absolute left-[-16px] w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
              
              <div className="bg-brand-card flex-1 rounded-xl p-4 border border-white/5 shadow-sm flex items-center justify-between ml-6">
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-lg">{activity.name}</span>
                  <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
                    <span className="flex items-center gap-1"><Timer size={14} /> {activity.duration} {activity.durationUnit}</span>
                    <span>• {activity.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeDailyActivity(activity.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleAdd} className="mt-4 bg-brand-card rounded-xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
        <h3 className="text-white font-medium text-sm">Registrar Nova Atividade</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="atividade-input w-full sm:w-auto"
            required
          />
          
          <div className="flex w-full sm:w-auto gap-2">
            <input 
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duração"
              className="atividade-input flex-1 min-w-[100px]"
              min="1"
              required
            />
            
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as 'segundos' | 'minutos' | 'horas')}
              className="atividade-input"
            >
              <option value="segundos">Segundos</option>
              <option value="minutos">Minutos</option>
              <option value="horas">Horas</option>
            </select>
          </div>
          
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome (ex: Corrida, Pilates)"
            className="atividade-input flex-1"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="atividade-submit"
        >
          <Plus size={18} />
          Adicionar Atividade
        </button>
      </form>
    </div>
  );
};

export default AtividadeTimeline;
