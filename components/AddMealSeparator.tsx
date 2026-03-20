import React from 'react';
import { Plus } from 'lucide-react';
import './AddMealSeparator.css';

interface Props {
  onClick: () => void;
}

const AddMealSeparator: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="separator-wrapper">
      {/* Timeline Graphic Column */}
      <div className="separator-timeline">
        <div className="separator-line"></div>
      </div>
      
      {/* Button Section */}
      <div className="separator-content">
        <button 
          onClick={onClick}
          className="separator-btn-highlighted"
          aria-label="Adicionar refeição"
        >
          <Plus size={18} strokeWidth={3} />
          <span>adicionar refeição</span>
        </button>
      </div>
    </div>
  );
};

export default AddMealSeparator;