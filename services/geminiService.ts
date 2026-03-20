
import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult, ExerciseItem } from "../types";
import { useUser } from "../IaFunctions/UserContext";
import { useTokens } from "../IaFunctions/TokenContext";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
};

export const useGemini = () => {
  const { userData } = useUser();
  const { addTokens } = useTokens();

  const trackUsage = (metadata: any) => {
    if (metadata) {
      addTokens(metadata.promptTokenCount || 0, metadata.candidatesTokenCount || 0);
    }
  };

  const analyzeFoodText = async (text: string): Promise<FoodAnalysisResult | null> => {
    try {
      const userContextString = JSON.stringify(userData);
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following text and determine if it describes food. If it does, estimate the calories. Input: "${text}"
        User Data & Context: ${userContextString}
        Instructions: Return valid JSON matching the schema.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              isFood: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER }
            },
            required: ["foodName", "calories", "isFood"]
          }
        }
      });
      trackUsage(response.usageMetadata);
      const result = JSON.parse(cleanJsonString(response.text || "{}"));
      if (!result.isFood) return null;
      return { foodName: result.foodName, calories: result.calories, confidence: result.confidence || 0.8 };
    } catch (error) { return null; }
  };

  const generateShoppingList = async (budget: number, duration: string, goal: string, pantryItems: any[] = []) => {
    try {
      const userContextString = JSON.stringify(userData);
      const pantryString = pantryItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(", ");
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Como um Nutricionista IA e Personal Shopper, crie uma lista de compras otimizada.
        
        CONTEXTO DO USUÁRIO:
        - Objetivo: ${goal}
        - Perfil: ${userContextString}
        - Comorbidades/Restrições: ${userData.saude.comorbidades.join(", ") || "Nenhuma"}
        
        INVENTÁRIO ATUAL (DESPENSA):
        - Itens já disponíveis: ${pantryString || "Vazia"}
        
        REQUISITO DA COMPRA:
        - Duração/Tipo: ${duration}
        - Orçamento Máximo: R$ ${budget}

        DIRETRIZES CRÍTICAS:
        1. PRIORIDADE: Se a compra for para uma refeição específica, escolha uma receita que utilize o máximo de itens já presentes na DESPENSA para economizar o orçamento.
        2. RESTRIÇÕES: Não inclua itens que agravem as comorbidades do usuário (ex: se tiver intolerância a lactose, sugira alternativas sem lactose).
        3. FOCO: Mantenha a dieta alinhada ao objetivo de ${goal}.
        4. OBTENÇÃO: Liste apenas o que precisa ser COMPRADO para completar o plano, não liste o que já está na despensa.
        
        Retorne um array JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unit: { type: Type.STRING }
              },
              required: ["name", "quantity", "unit"]
            }
          }
        }
      });

      trackUsage(response.usageMetadata);
      return JSON.parse(cleanJsonString(response.text || "[]"));
    } catch (error) {
      console.error("Error generating shopping list:", error);
      return [];
    }
  };

  const suggestFoodFromIngredients = async (preference: string, mealType: string, remainingCalories: number, pantryItems: any[] = []): Promise<FoodAnalysisResult | null> => {
    try {
      const pantryString = pantryItems.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(", ");
      const userContextString = JSON.stringify(userData.atributos);
      const comorbidades = userData.saude.comorbidades.join(", ") || "Nenhuma";
      
      const prompt = `Você é um Chef Nutricionista IA. Sugira um prato para o ${mealType}.
      
      DADOS DO USUÁRIO:
      - Perfil Físico: ${userContextString}
      - Comorbidades/Alergias: ${comorbidades}
      
      CONTEXTO DA REFEIÇÃO:
      - Itens na Despensa: ${pantryString || "Nenhum item registrado"}
      - Calorias Restantes na Meta: ${remainingCalories} kcal
      - Preferência do Usuário: ${preference || "Nenhuma (escolha o melhor com base na despensa)"}
      
      REGRAS:
      1. Priorize usar ingredientes que o usuário já tem na despensa.
      2. NUNCA sugira algo que contenha ingredientes das comorbidades citadas.
      3. Tente se aproximar das calorias restantes, considerando o perfil físico (idade, gênero, peso, altura).
      
      Retorne JSON com foodName e calories.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING },
              calories: { type: Type.NUMBER }
            },
            required: ["foodName", "calories"]
          }
        }
      });
      trackUsage(response.usageMetadata);
      return JSON.parse(cleanJsonString(response.text || "{}"));
    } catch (error) { return null; }
  };

  const generateWorkoutPlan = async (goal: string, focus: string): Promise<ExerciseItem[]> => {
    try {
      const userContextString = JSON.stringify(userData.atributos);
      const comorbidades = userData.saude.comorbidades.join(", ") || "Nenhuma";
      
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Como um Personal Trainer IA, crie um plano de treino personalizado.
        
        PERFIL DO USUÁRIO:
        - Dados Físicos: ${userContextString}
        - Condições de Saúde: ${comorbidades}
        
        OBJETIVOS:
        - Objetivo Geral: ${goal}
        - Foco do Treino: ${focus}
        
        INSTRUÇÕES:
        Crie um plano de exercícios seguro e eficaz considerando a idade, gênero e peso do usuário.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                series: { type: Type.INTEGER },
                reps: { type: Type.STRING },
                instructions: { type: Type.STRING },
                purpose: { type: Type.STRING },
                caloriesEstimate: { type: Type.INTEGER }
              },
              required: ["name", "series", "reps", "instructions", "purpose", "caloriesEstimate"]
            }
          }
        }
      });
      trackUsage(response.usageMetadata);
      const result = JSON.parse(cleanJsonString(response.text || "[]"));
      return result.map((item: any) => ({ ...item, id: crypto.randomUUID(), completed: false }));
    } catch (error) { return []; }
  };

  const suggestReplacementExercise = async (currentExerciseName: string, goal: string, focus: string): Promise<ExerciseItem | null> => {
    try {
      const userContextString = JSON.stringify(userData.atributos);
      const comorbidades = userData.saude.comorbidades.join(", ") || "Nenhuma";

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Como um Personal Trainer IA, sugira um exercício substituto para "${currentExerciseName}".
        
        PERFIL DO USUÁRIO:
        - Dados Físicos: ${userContextString}
        - Condições de Saúde: ${comorbidades}
        
        OBJETIVOS:
        - Objetivo Geral: ${goal}
        - Foco do Treino: ${focus}
        
        INSTRUÇÕES:
        O substituto deve ser adequado para a idade, gênero e peso do usuário, mantendo o foco em ${focus}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              series: { type: Type.INTEGER },
              reps: { type: Type.STRING },
              instructions: { type: Type.STRING },
              purpose: { type: Type.STRING },
              caloriesEstimate: { type: Type.INTEGER }
            },
            required: ["name", "series", "reps", "instructions", "purpose", "caloriesEstimate"]
          }
        }
      });
      trackUsage(response.usageMetadata);
      const result = JSON.parse(cleanJsonString(response.text || "{}"));
      return { ...result, id: crypto.randomUUID(), completed: false };
    } catch (error) { return null; }
  };

  return { analyzeFoodText, suggestFoodFromIngredients, generateWorkoutPlan, suggestReplacementExercise, generateShoppingList };
};
