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
        <button 
          onClick={onClick}
          className="separator-btn"
          aria-label="Adicionar lanche"
          title="Adicionar Lanche"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
      
      {/* Empty space to match the card layout to the right */}
      <div className="separator-spacer"></div>
    </div>
  );
};

export default AddMealSeparator;