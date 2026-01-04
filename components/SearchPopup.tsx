import React, { useState } from 'react';
import { Search, X, Loader2, Sparkles } from 'lucide-react';
import { useSearch } from '../IaFunctions/SearchContext';
import { useGemini } from '../services/geminiService';
import { SubFoodItem } from '../types';
import './SearchPopup.css';

interface Props {
  onAddFood: (item: Omit<SubFoodItem, 'id'>, mealId: string) => void;
}

const SearchPopup: React.FC<Props> = ({ onAddFood }) => {
  const { isOpen, closeSearch, activeMealId } = useSearch();
  const { analyzeFoodText } = useGemini();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !activeMealId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeFoodText(query);
      
      if (result) {
        onAddFood({
          name: result.foodName,
          calories: result.calories
        }, activeMealId);
        
        setQuery('');
        closeSearch();
      } else {
        setError("Não entendi. Tente '1 banana' ou 'arroz 100g'");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-backdrop">
      <div className="search-card">
        <div className="search-header">
          <div className="search-title-box">
            <Sparkles size={18} className="text-brand-accent" />
            <h3>Adicionar Alimento</h3>
          </div>
          <button onClick={closeSearch} className="search-close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: 1 maçã, fatia de bolo..."
              className="search-input"
              autoFocus
            />
            <button 
              type="submit" 
              className="search-submit-btn"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
            </button>
          </div>
          {error && <p className="search-error">{error}</p>}
        </form>
        
        <p className="search-hint">
          A IA irá estimar as calorias automaticamente.
        </p>
      </div>
    </div>
  );
};

export default SearchPopup;