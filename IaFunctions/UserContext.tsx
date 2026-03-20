import React, { createContext, useContext, useState, ReactNode } from 'react';
import initialData from './Data/userData';

type UserData = typeof initialData & {
  atributos: {
    genero: string;
    dataNascimento: string;
  };
  saude: {
    comorbidades: string[];
  }
};

interface UserContextType {
  userData: UserData;
  isSetupComplete: boolean;
  setPhysicalData: (peso: string, altura: string, genero: string, dataNascimento: string, comorbidades: string[]) => void;
  updateUserData: (newData: Partial<UserData>) => void;
  resetUserSetup: () => void;
  addFoodToHistory: (foodName: string, uiCategory: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const CATEGORY_MAP: Record<string, string> = {
  'Café da Manhã': 'cafeDaManha',
  'Almoço': 'Almoço',
  'Jantar': 'Jantar',
  'Lanche': 'Lanche'
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    ...initialData,
    atributos: {
      ...initialData.atributos,
      genero: '',
      dataNascimento: ''
    },
    saude: { comorbidades: [] }
  });

  const setPhysicalData = (peso: string, altura: string, genero: string, dataNascimento: string, comorbidades: string[]) => {
    setUserData(prev => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        Peso: peso,
        Altura: altura,
        genero: genero,
        dataNascimento: dataNascimento
      },
      saude: {
        comorbidades: comorbidades
      }
    }));
    setIsSetupComplete(true);
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const resetUserSetup = () => {
    setIsSetupComplete(false);
  };

  const addFoodToHistory = (foodName: string, uiCategory: string) => {
    if (!foodName) return;
    const jsonKey = CATEGORY_MAP[uiCategory];
    
    setUserData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const history = newData.engenharia_nutricional.registro_consumo_recente;
      if (jsonKey && history[jsonKey]) {
        history[jsonKey].unshift(foodName);
        if (history[jsonKey].length > 30) history[jsonKey].pop();
      }
      return newData;
    });
  };

  return (
    <UserContext.Provider value={{ userData, isSetupComplete, setPhysicalData, updateUserData, resetUserSetup, addFoodToHistory }}>
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