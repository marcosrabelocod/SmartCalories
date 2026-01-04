import React from 'react';
import { Utensils, Dumbbell, ClipboardList, Archive } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Refeição', icon: Utensils },
    { path: '/exercicios', label: 'Treino', icon: Dumbbell },
    { path: '/supermercado', label: 'Compras', icon: ClipboardList },
    { path: '/despensa', label: 'Despensa', icon: Archive },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button 
              key={item.path}
              className={`nav-btn ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              <Icon size={22} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;