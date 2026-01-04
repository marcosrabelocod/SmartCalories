import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SuggestionContextType {
  isOpen: boolean;
  activeMealId: string | null;
  activeMealType: string;
  remainingCalories: number;
  openSuggestion: (mealId: string, mealType: string, remainingCalories: number) => void;
  closeSuggestion: () => void;
}

const SuggestionContext = createContext<SuggestionContextType | undefined>(undefined);

export const SuggestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [activeMealType, setActiveMealType] = useState<string>('');
  const [remainingCalories, setRemainingCalories] = useState<number>(0);

  const openSuggestion = (mealId: string, mealType: string, remainingCalories: number) => {
    setActiveMealId(mealId);
    setActiveMealType(mealType);
    setRemainingCalories(remainingCalories);
    setIsOpen(true);
  };

  const closeSuggestion = () => {
    setIsOpen(false);
    setActiveMealId(null);
    setActiveMealType('');
  };

  return (
    <SuggestionContext.Provider value={{ isOpen, activeMealId, activeMealType, remainingCalories, openSuggestion, closeSuggestion }}>
      {children}
    </SuggestionContext.Provider>
  );
};

export const useSuggestion = () => {
  const context = useContext(SuggestionContext);
  if (!context) {
    throw new Error('useSuggestion must be used within a SuggestionProvider');
  }
  return context;
};