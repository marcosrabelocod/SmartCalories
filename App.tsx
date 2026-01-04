import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/Sections/BottomNav';
import CaloriasPage from './components/CaloriasPage';
import ExerciciosPage from './components/exercicios/ExerciciosPage';
import SupermercadoPage from './components/SupermercadoPage';
import DespensaPage from './components/DespensaPage';
import { SearchProvider } from './IaFunctions/SearchContext';
import { SuggestionProvider } from './IaFunctions/SuggestionContext';
import { UserProvider } from './IaFunctions/UserContext';
import { ExerciseProvider } from './IaFunctions/ExerciseContext';
import './App.css';

const App: React.FC = () => {
  return (
    <UserProvider>
      <ExerciseProvider>
        <SearchProvider>
          <SuggestionProvider>
            <HashRouter>
              <div className="app-container">
                
                <Routes>
                  {/* Rota Raiz: CaloriasPage */}
                  <Route path="/" element={<CaloriasPage />} />
                  
                  {/* Outras Rotas */}
                  <Route path="/exercicios" element={<ExerciciosPage />} />
                  <Route path="/supermercado" element={<SupermercadoPage />} />
                  <Route path="/despensa" element={<DespensaPage />} />
                  
                  {/* Redirecionamento padrão */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <BottomNav />
                
              </div>
            </HashRouter>
          </SuggestionProvider>
        </SearchProvider>
      </ExerciseProvider>
    </UserProvider>
  );
};

export default App;