import React, { useState, useEffect } from 'react';
import DespensaHeader from './DespensaHeader';
import DespensaItem from './DespensaItem';
import DespensaQuickAdd from './DespensaQuickAdd';
import { PackageOpen } from 'lucide-react';
import { useToast } from '../../IaFunctions/ToastContext';
import './Despensa.css';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

const DespensaPage: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('smartcal_pantry');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('smartcal_pantry', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<PantryItem, 'id'>) => {
    const itemWithId = { ...newItem, id: crypto.randomUUID() };
    setItems(prev => [itemWithId, ...prev]);
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find(i => i.id === id);
    if (itemToRemove) {
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`${itemToRemove.name} removido!`, () => {});
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => {
      const itemIndex = prev.findIndex(item => item.id === id);
      if (itemIndex === -1) return prev;

      const currentItem = prev[itemIndex];
      const newQty = Math.max(0, currentItem.quantity + delta);

      if (newQty === 0) {
        return prev.filter(item => item.id !== id);
      }

      const newItems = [...prev];
      newItems[itemIndex] = { ...currentItem, quantity: newQty };
      return newItems;
    });
  };

  return (
    <div className="pantry-screen">
      <DespensaHeader />
      
      <main className="pantry-main">
        <div className="pantry-content-width">
          {items.length === 0 ? (
            <div className="pantry-empty-state">
              <PackageOpen size={48} className="opacity-20 mb-4" />
              <h3>Sua despensa está vazia</h3>
              <p>Adicione itens abaixo.</p>
            </div>
          ) : (
            <div className="pantry-list-flow">
              {items.map(item => (
                <DespensaItem 
                  key={item.id} 
                  item={item} 
                  onRemove={removeItem} 
                  onUpdateQty={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <DespensaQuickAdd onAdd={addItem} />
    </div>
  );
};

export default DespensaPage;