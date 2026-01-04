import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isOpen: boolean;
  activeMealId: string | null;
  openSearch: (mealId: string) => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);

  const openSearch = (mealId: string) => {
    setActiveMealId(mealId);
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setActiveMealId(null);
  };

  return (
    <SearchContext.Provider value={{ isOpen, activeMealId, openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};