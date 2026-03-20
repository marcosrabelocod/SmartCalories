import React from 'react';
import { Archive } from 'lucide-react';

const DespensaPage: React.FC = () => {
  return (
    <main className="main-content flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-brand-card p-6 rounded-2xl border border-black/5 flex flex-col items-center gap-4 w-full animate-fade-in shadow-sm">
        <div className="p-4 bg-brand-warning/10 rounded-full text-brand-warning">
            <Archive size={48} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Minha Despensa</h2>
        <p className="text-slate-600">
          Controle o que você tem em estoque e receba alertas de validade.
        </p>
      </div>
    </main>
  );
};

export default DespensaPage;