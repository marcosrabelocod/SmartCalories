import React from 'react';
import { ShoppingCart } from 'lucide-react';

const SupermercadoPage: React.FC = () => {
  return (
    <main className="main-content flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-brand-card p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-4 w-full animate-fade-in">
        <div className="p-4 bg-brand-primary/20 rounded-full text-brand-primary">
            <ShoppingCart size={48} />
        </div>
        <h2 className="text-xl font-bold text-white">Lista de Compras</h2>
        <p className="text-slate-400">
          Gerencie sua lista de supermercado baseada na sua dieta.
        </p>
      </div>
    </main>
  );
};

export default SupermercadoPage;