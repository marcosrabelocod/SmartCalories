import React, { useState, useCallback } from 'react';
import CalorieHeader from './CalorieHeader';
import Refeicao from './Refeicao';
import AddMealSeparator from './AddMealSeparator';
import SearchPopup from './SearchPopup';
import SuggestionPopup from './SuggestionPopup';
import { useUser } from '../IaFunctions/UserContext';
import { FoodItem } from '../types';
import { Utensils } from 'lucide-react';
import './CaloriasPage.css';

const INITIAL_CAL_TOTAL = 3000;

// Helper to create dates relative to today
const createDate = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const CaloriasPage: React.FC = () => {
  // Access User Context to update history
  const { addFoodToHistory } = useUser();

  // State 1: Calories
  const [totalCalories] = useState<number>(INITIAL_CAL_TOTAL);
  
  // Initial state with Breakfast, Lunch, and Dinner starting with empty foods array
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>([
    {
      id: 'init-1',
      category: 'Café da Manhã',
      foods: [],
      timestamp: createDate(8, 30)
    },
    {
      id: 'init-2',
      category: 'Almoço',
      foods: [],
      timestamp: createDate(12, 45)
    },
    {
      id: 'init-3',
      category: 'Jantar',
      foods: [],
      timestamp: createDate(19, 30)
    }
  ]);

  // State 2: Water (Initialized to 0)
  const [waterTotal] = useState<number>(2000);
  const [waterCurrent, setWaterCurrent] = useState<number>(0);

  // Derived state for total current calories
  const currentCalories = foodHistory.reduce((acc, meal) => {
    const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
    return acc + mealCalories;
  }, 0);
  
  const remainingCalories = Math.max(0, totalCalories - currentCalories);

  const handleAddWater = (amount: number) => {
    setWaterCurrent(prev => Math.min(prev + amount, waterTotal + 1000));
  };

  const handleAddFoodFromSearch = (newItemData: { name: string, calories: number }, targetMealId: string) => {
    const targetItem = foodHistory.find(item => item.id === targetMealId);
    if (targetItem) {
      addFoodToHistory(newItemData.name, targetItem.category);
    }

    setFoodHistory(prev => prev.map(meal => {
      if (meal.id === targetMealId) {
        const newSubItem = {
          id: crypto.randomUUID(),
          name: newItemData.name,
          calories: newItemData.calories
        };
        return { ...meal, foods: [...meal.foods, newSubItem] };
      }
      return meal;
    }));
  };

  const handleDeleteMeal = useCallback((id: string) => {
    setFoodHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleRemoveSubFood = useCallback((mealId: string, foodId: string) => {
    setFoodHistory(prev => prev.map(meal => {
      if (meal.id === mealId) {
        return { ...meal, foods: meal.foods.filter(f => f.id !== foodId) };
      }
      return meal;
    }));
  }, []);

  const handleTimeUpdate = useCallback((id: string, newTime: Date) => {
    setFoodHistory(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, timestamp: newTime } : item);
      return updated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    });
  }, []);

  const handleCategoryUpdate = useCallback((id: string, newCategory: string) => {
    setFoodHistory(prev => prev.map(item => item.id === id ? { ...item, category: newCategory } : item));
  }, []);

  const handleAddMealBlock = (index: number) => {
    const currentItem = foodHistory[index];
    const nextItem = foodHistory[index + 1];
    let newTime = new Date();
    
    if (nextItem) {
      const midTime = (currentItem.timestamp.getTime() + nextItem.timestamp.getTime()) / 2;
      newTime = new Date(midTime);
    } else {
      newTime = new Date(currentItem.timestamp.getTime() + (2.5 * 60 * 60 * 1000));
    }

    const newMealBlock: FoodItem = {
      id: crypto.randomUUID(),
      category: 'Lanche',
      foods: [],
      timestamp: newTime
    };

    setFoodHistory(prev => [...prev, newMealBlock].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  };

  return (
    <>
      <CalorieHeader 
        caloriesCurrent={currentCalories} 
        caloriesTotal={totalCalories}
        waterCurrent={waterCurrent}
        waterTotal={waterTotal}
        onAddWater={handleAddWater}
      />

      <main className="main-content">
        <section className="history-section">
          <div className="history-header">
            <Utensils size={16} />
            <h2 className="history-title">Linha do Tempo</h2>
          </div>
          
          <div className="history-list">
            {foodHistory.length === 0 ? (
              <div className="empty-history">
                <p>Nenhum registro ainda.</p>
              </div>
            ) : (
              foodHistory.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Refeicao 
                    id={item.id}
                    categoria={item.category}
                    foods={item.foods}
                    horario={item.timestamp}
                    remainingCalories={remainingCalories}
                    onDeleteMeal={handleDeleteMeal}
                    onTimeChange={handleTimeUpdate}
                    onCategoryChange={handleCategoryUpdate}
                    onRemoveFood={(foodId) => handleRemoveSubFood(item.id, foodId)}
                  />
                  <AddMealSeparator onClick={() => handleAddMealBlock(index)} />
                </React.Fragment>
              ))
            )}
          </div>
        </section>
      </main>

      <SearchPopup onAddFood={handleAddFoodFromSearch} />
      <SuggestionPopup onAddFood={handleAddFoodFromSearch} />
    </>
  );
};

export default CaloriasPage;