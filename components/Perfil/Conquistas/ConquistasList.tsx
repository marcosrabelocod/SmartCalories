import React from 'react';
import { useConquistas } from '../../../IaFunctions/ConquistasContext';
import { Star } from 'lucide-react';
import './Conquistas.css';

const ConquistasList: React.FC = () => {
  const { conquistas } = useConquistas();

  return (
    <div className="conquistas-grid">
      {conquistas.map(conquista => (
        <div 
          key={conquista.id} 
          className={`conquista-card ${conquista.unlocked ? 'unlocked' : 'locked'}`}
        >
          <div className="conquista-icon-container">
            <Star 
              size={36} 
              className={conquista.unlocked ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'} 
            />
          </div>
          <h4 className="conquista-title">{conquista.title}</h4>
          <p className="conquista-legend">{conquista.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ConquistasList;
