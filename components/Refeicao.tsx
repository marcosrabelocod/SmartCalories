import React, { useState, useMemo } from 'react';
import { Trash2, Search, Lightbulb, ChevronDown } from 'lucide-react';
import { useSearch } from '../IaFunctions/SearchContext';
import { useSuggestion } from '../IaFunctions/SuggestionContext';
import CategoryModal from './CategoryModal';
import MealDetailModal from './MealDetailModal';
import { SubFoodItem } from '../types';
import './Refeicao.css';

interface RefeicaoProps {
  id: string;
  categoria: string;
  foods: SubFoodItem[];
  horario: Date;
  remainingCalories: number;
  onDeleteMeal: (id: string) => void;
  onTimeChange: (id: string, newTime: Date) => void;
  onCategoryChange: (id: string, newCategory: string) => void;
  onRemoveFood: (foodId: string) => void;
}

const Refeicao: React.FC<RefeicaoProps> = ({ 
  id, 
  categoria, 
  foods, 
  horario, 
  remainingCalories, 
  onDeleteMeal, 
  onTimeChange,
  onCategoryChange,
  onRemoveFood
}) => {
  const { openSearch } = useSearch();
  const { openSuggestion } = useSuggestion();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate total calories for this meal
  const totalCalories = useMemo(() => {
    return foods.reduce((acc, item) => acc + item.calories, 0);
  }, [foods]);

  // Generate a summary string (e.g., "Apple, Banana...")
  const foodSummary = useMemo(() => {
    if (foods.length === 0) return 'Adicionar alimentos';
    const names = foods.map(f => f.name).join(', ');
    return names.length > 35 ? names.substring(0, 35) + '...' : names;
  }, [foods]);

  // Format Date to "HH:MM" for the input value
  const timeString = horario.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(horario);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onTimeChange(id, newDate);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open if foods exist, or focus on empty state if desired.
    // For now, allow opening to see "Empty" state or to manage.
    if (!isDeleting) {
      setIsDetailModalOpen(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    
    // Aguarda a animação terminar (500ms) antes de remover do estado global
    setTimeout(() => {
      onDeleteMeal(id);
    }, 500);
  };

  return (
    <>
      <div className={`refeicao-wrapper ${isDeleting ? 'slide-exit' : ''}`}>
        {/* Timeline Graphic Section */}
        <div className="timeline-graphic">
          <div className="timeline-vertical-line"></div>
          <div className="timeline-branch">
            <div className="timeline-dot"></div>
          </div>
        </div>

        {/* Content Card Section - Click opens details */}
        <div 
          className="refeicao-card group cursor-pointer"
          onClick={handleCardClick}
        >
          
          {/* Top Row: Time (Left) & Calories (Right) */}
          <div className="refeicao-header-row">
            <input 
              type="time" 
              className="refeicao-time-input"
              value={timeString}
              onChange={handleTimeInput}
              onClick={(e) => e.stopPropagation()} // Prevent modal open
              aria-label="Editar horário"
            />
            <span className="refeicao-calories">+{totalCalories} kcal</span>
          </div>

          {/* Bottom Row: Name/Summary (Left) & Actions (Right) */}
          <div className="refeicao-body-row">
            <div className="refeicao-info">
              <span className={`refeicao-title ${foods.length === 0 ? 'text-slate-500 font-normal italic' : ''}`}>
                {foodSummary}
              </span>
              
              {/* Category Button (Triggers Modal) */}
              <button 
                className="refeicao-category-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsCategoryModalOpen(true);
                }}
              >
                {categoria}
                <ChevronDown size={12} className="category-chevron" />
              </button>
            </div>
            
            <div className="refeicao-actions">
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    openSearch(id);
                }}
                className="refeicao-action-btn search-btn"
                aria-label="Adicionar alimento"
                title="Adicionar item"
              >
                <Search size={16} />
              </button>

              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    openSuggestion(id, categoria, remainingCalories);
                }}
                className="refeicao-action-btn suggestion-btn"
                aria-label="Sugestão da IA"
                title="Ver sugestão"
              >
                <Lightbulb size={16} />
              </button>
              
              <button 
                onClick={handleDeleteClick}
                className="refeicao-action-btn delete-food-btn"
                aria-label="Excluir refeição inteira"
                title="Excluir refeição"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={(newCategory) => onCategoryChange(id, newCategory)}
        currentCategory={categoria}
      />

      <MealDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={categoria}
        foods={foods}
        onRemoveFood={onRemoveFood}
      />
    </>
  );
};

export default Refeicao;