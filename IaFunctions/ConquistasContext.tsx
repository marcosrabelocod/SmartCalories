import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Conquista {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const INITIAL_CONQUISTAS: Conquista[] = [
  { id: 'refeicoes_completas', title: 'Nutrição Impecável', description: 'Você registrou café da manhã, almoço e jantar hoje!', icon: 'star', unlocked: false },
  { id: 'treino_completo', title: 'Atleta do Dia', description: 'Você completou todo o seu plano de exercícios diário!', icon: 'star', unlocked: false },
  { id: 'cesta_completa', title: 'Despensa Abastecida', description: 'Você comprou todos os itens da cesta de compras!', icon: 'star', unlocked: false }
];

interface ConquistasContextType {
  conquistas: Conquista[];
  unlockConquista: (id: string) => void;
  showPopup: Conquista | null;
  closePopup: () => void;
}

const ConquistasContext = createContext<ConquistasContextType | undefined>(undefined);

export const ConquistasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conquistas, setConquistas] = useState<Conquista[]>(() => {
    const saved = localStorage.getItem('smartcal_conquistas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new achievements are added if initial array changes
        const merged = INITIAL_CONQUISTAS.map(initial => {
          const found = parsed.find((p: Conquista) => p.id === initial.id);
          return found ? { ...initial, unlocked: found.unlocked } : initial;
        });
        return merged;
      } catch (e) {
        return INITIAL_CONQUISTAS;
      }
    }
    return INITIAL_CONQUISTAS;
  });
  
  const [showPopup, setShowPopup] = useState<Conquista | null>(null);

  useEffect(() => {
    localStorage.setItem('smartcal_conquistas', JSON.stringify(conquistas));
  }, [conquistas]);

  const unlockConquista = (id: string) => {
    setConquistas(prev => {
      const alreadyUnlocked = prev.find(c => c.id === id)?.unlocked;
      if (alreadyUnlocked) return prev; // Já desbloqueada

      const novo = prev.map(c => c.id === id ? { ...c, unlocked: true } : c);
      const unlockedConquista = novo.find(c => c.id === id);
      if (unlockedConquista) {
        setShowPopup(unlockedConquista);
      }
      return novo;
    });
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  return (
    <ConquistasContext.Provider value={{ conquistas, unlockConquista, showPopup, closePopup }}>
      {children}
    </ConquistasContext.Provider>
  );
};

export const useConquistas = () => {
  const context = useContext(ConquistasContext);
  if (!context) throw new Error('useConquistas must be used within ConquistasProvider');
  return context;
};
