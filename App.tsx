import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/Sections/BottomNav';
import CaloriasPage from './components/CaloriasPage';
import ExerciciosPage from './components/exercicios/ExerciciosPage';
import ComprasPage from './components/Compras/ComprasPage';
import DespensaPage from './components/despensa/DespensaPage';
import PerfilPage from './components/Perfil/PerfilPage';
import TokenCounter from './components/TokenCounter';
import UserOnboarding from './components/Onboarding/UserOnboarding';
import UndoToast from './components/Onboarding/UndoToast';
import { SearchProvider } from './IaFunctions/SearchContext';
import { SuggestionProvider } from './IaFunctions/SuggestionContext';
import { UserProvider, useUser } from './IaFunctions/UserContext';
import { ExerciseProvider } from './IaFunctions/ExerciseContext';
import { TokenProvider } from './IaFunctions/TokenContext';
import { ToastProvider } from './IaFunctions/ToastContext';
import './App.css';

const MainApp: React.FC = () => {
  const { isSetupComplete } = useUser();

  if (!isSetupComplete) {
    return <UserOnboarding />;
  }

  return (
    <HashRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CaloriasPage />} />
          <Route path="/exercicios" element={<ExerciciosPage />} />
          <Route path="/supermercado" element={<ComprasPage />} />
          <Route path="/despensa" element={<DespensaPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
        <TokenCounter />
        <UndoToast />
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <TokenProvider>
      <UserProvider>
        <ExerciseProvider>
          <ToastProvider>
            <SearchProvider>
              <SuggestionProvider>
                <MainApp />
              </SuggestionProvider>
            </SearchProvider>
          </ToastProvider>
        </ExerciseProvider>
      </UserProvider>
    </TokenProvider>
  );
};

export default App;