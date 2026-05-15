import React, { useState, useEffect } from 'react';
import ComprasHeader from './ComprasHeader';
import ComprasItem from './ComprasItem';
import ComprasQuickAdd from './ComprasQuickAdd';
import ComprasOnboarding from './ComprasOnboarding';
import { ShoppingBasket, Wand2, PackagePlus } from 'lucide-react';
import { useToast } from '../../IaFunctions/ToastContext';
import { useGemini } from '../../services/geminiService';
import { useConquistas } from '../../IaFunctions/ConquistasContext';
import './Compras.css';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

const ComprasPage: React.FC = () => {
  const { showToast } = useToast();
  const { generateShoppingList } = useGemini();
  const { unlockConquista } = useConquistas();
  
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('smartcal_shopping_list');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showWizard, setShowWizard] = useState(items.length === 0);

  useEffect(() => {
    localStorage.setItem('smartcal_shopping_list', JSON.stringify(items));
    
    if (items.length > 0 && items.every(i => i.checked)) {
      unlockConquista('cesta_completa');
    }
  }, [items, unlockConquista]);

  const handleGenerateAIList = async (budget: number, duration: string, goal: string) => {
    const pantrySaved = localStorage.getItem('smartcal_pantry');
    const pantryItems = pantrySaved ? JSON.parse(pantrySaved) : [];

    const aiItems = await generateShoppingList(budget, duration, goal, pantryItems);
    
    if (aiItems && aiItems.length > 0) {
      const formattedItems = aiItems.map((item: any) => ({
        ...item,
        id: crypto.randomUUID(),
        checked: false
      }));
      setItems(formattedItems);
      setShowWizard(false);
      showToast("Lista otimizada com base na sua despensa e saúde!", () => setItems([]));
    } else {
      showToast("Não foi possível gerar a lista. Verifique os dados e tente novamente.", () => {});
    }
  };

  const transferCheckedToPantry = () => {
    const checkedItems = items.filter(i => i.checked);
    if (checkedItems.length === 0) return;

    const pantrySaved = localStorage.getItem('smartcal_pantry');
    const currentPantry = pantrySaved ? JSON.parse(pantrySaved) : [];

    const itemsToMove = checkedItems.map(item => ({
      id: crypto.randomUUID(),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: 'Comprado'
    }));

    const updatedPantry = [...itemsToMove, ...currentPantry];
    localStorage.setItem('smartcal_pantry', JSON.stringify(updatedPantry));

    const remainingItems = items.filter(i => !i.checked);
    setItems(remainingItems);

    showToast(`${checkedItems.length} itens movidos para a despensa!`, () => {});
  };

  const addItem = (newItem: Omit<ShoppingItem, 'id' | 'checked'>) => {
    const itemWithId = { ...newItem, id: crypto.randomUUID(), checked: false };
    setItems(prev => [itemWithId, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  if (showWizard) {
    return <ComprasOnboarding onGenerate={handleGenerateAIList} />;
  }

  const hasCheckedItems = items.some(i => i.checked);

  return (
    <div className="shopping-screen">
      <ComprasHeader />
      
      <main className="shopping-main">
        <div className="shopping-content-width">
          <div className="shopping-controls-row">
            {hasCheckedItems && (
              <button 
                className="move-to-pantry-btn animate-fade-in"
                onClick={transferCheckedToPantry}
              >
                <PackagePlus size={16} /> Guardar na Despensa
              </button>
            )}
            <button 
              className="ai-wizard-btn" 
              onClick={() => setShowWizard(true)}
            >
              <Wand2 size={16} /> Assistente IA
            </button>
          </div>

          {items.length === 0 ? (
             <div className="shopping-empty-state">
                <ShoppingBasket size={48} className="opacity-20 mb-4" />
                <h3>Lista Vazia</h3>
                <p>Adicione itens abaixo.</p>
             </div>
          ) : (
            <div className="shopping-list-flow">
              {items.map(item => (
                <ComprasItem 
                  key={item.id} 
                  item={item} 
                  onRemove={removeItem} 
                  onToggle={toggleItem}
                  onUpdateQty={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ComprasQuickAdd onAdd={addItem} />
    </div>
  );
};

export default ComprasPage;