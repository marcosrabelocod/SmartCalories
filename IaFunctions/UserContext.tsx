import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initialData from './Data/userData';

// Define the shape of UserData based on the TS file structure
type UserData = typeof initialData;

interface UserContextType {
  userData: UserData;
  addFoodToHistory: (foodName: string, uiCategory: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'smartcal_user_data';

// Mapping UI categories to JSON keys
const CATEGORY_MAP: Record<string, string> = {
  'Café da Manhã': 'cafeDaManha',
  'Almoço': 'Almoço',
  'Jantar': 'Jantar',
  'Lanche': 'Lanche'
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or default TS file
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading from local storage", e);
    }
    return initialData;
  });

  // Persist to LocalStorage whenever userData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error("Error saving to local storage", e);
    }
  }, [userData]);

  const addFoodToHistory = (foodName: string, uiCategory: string) => {
    if (!foodName) return;

    const jsonKey = CATEGORY_MAP[uiCategory];
    
    // Check if category exists in structure
    // We use 'any' casting briefly here because dynamic key access on the specific UserData type can be tricky in TS without index signatures
    const currentHistory = (userData.engenharia_nutricional.registro_consumo_recente as any)[jsonKey];

    if (jsonKey && Array.isArray(currentHistory)) {
      setUserData(prev => {
        // Deep clone to avoid mutation
        const newData = JSON.parse(JSON.stringify(prev));
        const list = newData.engenharia_nutricional.registro_consumo_recente[jsonKey];

        // Add to beginning
        list.unshift(foodName);

        // Cap at 30 items
        if (list.length > 30) {
          list.pop();
        }

        console.log(`[UserContext] Added "${foodName}" to "${jsonKey}". New count: ${list.length}`);
        return newData;
      });
    } else {
      console.warn(`Category mapping not found or invalid for: ${uiCategory}`);
    }
  };

  return (
    <UserContext.Provider value={{ userData, addFoodToHistory }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
