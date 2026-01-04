import initialData from './Data/userData';

const STORAGE_KEY = 'smartcal_user_data';

// Mapping UI categories to JSON keys
const CATEGORY_MAP: Record<string, string> = {
  'Café da Manhã': 'cafeDaManha',
  'Almoço': 'Almoço',
  'Jantar': 'Jantar',
  'Lanche': 'Lanche'
};

// Retrieve data: Priority LocalStorage > Static TS Data
export const getLatestUserData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading from local storage", e);
  }
  return initialData;
};

export const addFoodToHistory = (foodName: string, uiCategory: string) => {
  if (!foodName) return;

  const currentData = getLatestUserData();
  const jsonKey = CATEGORY_MAP[uiCategory];

  // If category matches a key in our data structure
  if (jsonKey && currentData.engenharia_nutricional.registro_consumo_recente[jsonKey]) {
    const list = currentData.engenharia_nutricional.registro_consumo_recente[jsonKey];

    // Add new item to the beginning
    list.unshift(foodName);

    // Limit to 30 items: remove the last one if size exceeds 30
    if (list.length > 30) {
      list.pop(); 
    }

    // Save back to persistence
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      console.log(`Added "${foodName}" to history category "${jsonKey}"`);
    } catch (e) {
      console.error("Error saving to local storage", e);
    }
  } else {
    console.warn(`Category mapping not found for: ${uiCategory}`);
  }
};