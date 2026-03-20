
import React, { useState } from 'react';
import { Lightbulb, X, Loader2, Check, RefreshCw } from 'lucide-react';
import { useSuggestion } from '../IaFunctions/SuggestionContext';
import { useGemini } from '../services/geminiService';
import { SubFoodItem, FoodAnalysisResult } from '../types';
import './SuggestionPopup.css';

interface Props {
  onAddFood: (item: Omit<SubFoodItem, 'id'>, mealId: string) => void;
}

const SuggestionPopup: React.FC<Props> = ({ onAddFood }) => {
  const { isOpen, closeSuggestion, activeMealId, activeMealType, remainingCalories } = useSuggestion();
  const { suggestFoodFromIngredients } = useGemini();
  const [preference, setPreference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State to hold the pending suggestion before confirming
  const [suggestedFood, setSuggestedFood] = useState<FoodAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setPreference('');
    setSuggestedFood(null);
    setError(null);
    closeSuggestion();
  };

  const fetchSuggestion = async () => {
    if (!activeMealId) return;

    setIsLoading(true);
    setError(null);
    setSuggestedFood(null); 

    try {
      // Busca itens da despensa para o Chef IA
      const pantrySaved = localStorage.getItem('smartcal_pantry');
      const pantryItems = pantrySaved ? JSON.parse(pantrySaved) : [];

      const result = await suggestFoodFromIngredients(preference, activeMealType, remainingCalories, pantryItems);
      
      if (result) {
        setSuggestedFood(result);
      } else {
        setError("Não consegui sugerir algo agora. Tente novamente.");
      }
    } catch (err) {
      setError("Erro de conexão com a IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuggestion();
  };

  const handleConfirm = () => {
    if (suggestedFood && activeMealId) {
      onAddFood({
        name: suggestedFood.foodName,
        calories: suggestedFood.calories
      }, activeMealId);
      handleClose();
    }
  };

  return (
    <div className="suggestion-backdrop">
      <div className="suggestion-card">
        <div className="suggestion-header">
          <div className="suggestion-title-box">
            <Lightbulb size={18} className="text-warning-accent" fill="currentColor" />
            <h3>Chef IA: {activeMealType}</h3>
          </div>
          <button onClick={handleClose} className="suggestion-close-btn">
            <X size={24} />
          </button>
        </div>

        {suggestedFood && !isLoading ? (
          <div className="suggestion-result-container">
            <div className="suggestion-result-info">
              <h2 className="result-food-name">{suggestedFood.foodName}</h2>
              <span className="result-calories">+{suggestedFood.calories} kcal</span>
            </div>
            
            <div className="suggestion-actions">
              <button 
                onClick={fetchSuggestion} 
                className="action-btn retry-btn"
                title="Tentar outra sugestão"
              >
                <RefreshCw size={24} />
              </button>
              
              <button 
                onClick={handleConfirm} 
                className="action-btn confirm-btn"
                title="Confirmar e Adicionar"
              >
                <Check size={24} />
              </button>
            </div>
            <p className="suggestion-hint">
              Sugestão baseada na sua despensa e saúde.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="suggestion-form">
            <div className="suggestion-input-wrapper">
              <input
                type="text"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                placeholder="Alguma preferência? (Opcional)"
                className="suggestion-input"
                autoFocus
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="suggestion-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Lightbulb size={20} className="fill-white" />
                )}
              </button>
            </div>
            {error && <p className="suggestion-error">{error}</p>}
            
            {!error && (
              <p className="suggestion-hint">
                A IA analisará sua <b>despensa</b> e <b>saúde</b> para sugerir o prato ideal.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SuggestionPopup;
