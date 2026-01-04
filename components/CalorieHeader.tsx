import React, { useState } from 'react';
import { CalorieHeaderProps } from '../types';
import Calorias from './Sections/Calorias';
import Hidratacao from './Sections/Hidratacao';
import WaterModal from './WaterModal';
import './CalorieHeader.css';

const CalorieHeader: React.FC<CalorieHeaderProps> = ({ 
  caloriesCurrent, 
  caloriesTotal, 
  waterCurrent, 
  waterTotal,
  onAddWater
}) => {
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);

  return (
    <>
      <header className="header-container">
        <div className="header-content">
          
          <Calorias 
            current={caloriesCurrent} 
            total={caloriesTotal} 
          />

          <Hidratacao 
            current={waterCurrent} 
            total={waterTotal} 
            onOpenModal={() => setIsWaterModalOpen(true)} 
          />

        </div>
      </header>

      <WaterModal 
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        onAddWater={onAddWater}
      />
    </>
  );
};

export default CalorieHeader;