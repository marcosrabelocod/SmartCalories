
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenUsage {
  totalInput: number;
  totalOutput: number;
  lastInput: number;
  lastOutput: number;
}

interface TokenContextType {
  tokens: TokenUsage;
  addTokens: (input: number, output: number) => void;
  resetTokens: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<TokenUsage>({ 
    totalInput: 0, 
    totalOutput: 0, 
    lastInput: 0, 
    lastOutput: 0 
  });

  const addTokens = (input: number, output: number) => {
    setTokens(prev => ({
      totalInput: prev.totalInput + input,
      totalOutput: prev.totalOutput + output,
      lastInput: input,
      lastOutput: output
    }));
  };

  const resetTokens = () => setTokens({ 
    totalInput: 0, 
    totalOutput: 0, 
    lastInput: 0, 
    lastOutput: 0 
  });

  return (
    <TokenContext.Provider value={{ tokens, addTokens, resetTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};
