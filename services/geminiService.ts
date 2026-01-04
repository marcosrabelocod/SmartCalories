import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult, ExerciseItem } from "../types";
import { useUser } from "../IaFunctions/UserContext";

// Initialize AI instance outside the hook to avoid recreating it
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to handle potential Markdown code blocks in response
const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
};

export const useGemini = () => {
  const { userData } = useUser();

  const analyzeFoodText = async (text: string): Promise<FoodAnalysisResult | null> => {
    try {
      const userContextString = JSON.stringify(userData);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the following text and determine if it describes food. If it does, estimate the calories. Input: "${text}"
        
        User Data & Context:
        ${userContextString}
        
        Instructions:
        1. If the input is specific (e.g. "1 apple"), ignore the user context and analyze normally.
        2. If the input is vague or refers to a habit (e.g. "my usual snack", "pre-workout"), use the "registro_consumo_recente" or "engenharia_nutricional" data to infer the food item.
        3. Return valid JSON matching the schema.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { 
                type: Type.STRING,
                description: "A concise name of the food item identified."
              },
              calories: { 
                type: Type.NUMBER, 
                description: "Estimated total calories for the described portion."
              },
              isFood: {
                type: Type.BOOLEAN,
                description: "True if the text describes edible food/drink."
              },
              confidence: {
                type: Type.NUMBER,
                description: "Confidence score between 0 and 1."
              }
            },
            required: ["foodName", "calories", "isFood"]
          }
        }
      });

      const cleanText = cleanJsonString(response.text || "{}");
      const result = JSON.parse(cleanText);

      if (!result.isFood) {
        return null;
      }

      return {
        foodName: result.foodName,
        calories: result.calories,
        confidence: result.confidence || 0.8
      };

    } catch (error) {
      console.error("Error analyzing food with Gemini:", error);
      return null;
    }
  };

  const suggestFoodFromIngredients = async (ingredients: string, mealType: string, remainingCalories: number): Promise<FoodAnalysisResult | null> => {
    try {
      const userContextString = JSON.stringify(userData);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `I have these ingredients: "${ingredients}". Suggest a single creative dish suitable for "${mealType}". 
        I have ${remainingCalories} calories left for the day.
        
        User Data & Nutritional Engineering Profile:
        ${userContextString}
        
        Instructions:
        1. Consider the user's "TipoFisico" (${userData.atributos.TipoFisico}) and "objetivo_obra".
        2. Prioritize "materiais_preferenciais" if they align with the ingredients provided.
        3. Ensure the suggestion fits the "estrategia" (e.g., avoiding catabolism).
        4. Return the name of the dish and estimated calories.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { 
                type: Type.STRING,
                description: "The name of the suggested dish."
              },
              calories: { 
                type: Type.NUMBER, 
                description: "Estimated calories for a standard serving."
              }
            },
            required: ["foodName", "calories"]
          }
        }
      });

      const cleanText = cleanJsonString(response.text || "{}");
      const result = JSON.parse(cleanText);

      return {
        foodName: result.foodName,
        calories: result.calories,
        confidence: 1
      };

    } catch (error) {
      console.error("Error suggesting food with Gemini:", error);
      return null;
    }
  };

  const generateWorkoutPlan = async (goal: string, focus: string): Promise<ExerciseItem[]> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Crie uma rotina de treino personalizada em PORTUGUÊS DO BRASIL.
        Objetivo: ${goal}. 
        Foco do Treino: ${focus}.
        Atributos do Usuário: Peso ${userData.atributos.Peso}kg, Tipo Físico ${userData.atributos.TipoFisico}.

        Instruções obrigatórias:
        1. Todos os campos de texto DEVEM estar em Português do Brasil.
        2. O campo 'instructions' deve ser uma explicação passo a passo de como realizar o exercício.
        3. O campo 'purpose' deve descrever qual músculo é trabalhado ou qual o benefício principal.
        
        Retorne uma lista JSON de 4 a 6 exercícios.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Nome do exercício em Português" },
                series: { type: Type.INTEGER, description: "Quantidade de séries" },
                reps: { type: Type.STRING, description: "Repetições (ex: '12 a 15' ou '30 seg')" },
                instructions: { type: Type.STRING, description: "Instruções detalhadas de como fazer o exercício" },
                purpose: { type: Type.STRING, description: "Para que serve este exercício / Músculo alvo" },
                caloriesEstimate: { type: Type.INTEGER, description: "Estimativa de calorias gastas" }
              },
              required: ["name", "series", "reps", "instructions", "purpose", "caloriesEstimate"]
            }
          }
        }
      });

      const cleanText = cleanJsonString(response.text || "[]");
      const result = JSON.parse(cleanText);
      
      return result.map((item: any) => ({
        ...item,
        id: crypto.randomUUID(),
        completed: false
      }));

    } catch (error) {
      console.error("Error generating workout:", error);
      return [];
    }
  };

  const suggestReplacementExercise = async (currentExerciseName: string, goal: string, focus: string): Promise<ExerciseItem | null> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Sugira um exercício substituto para "${currentExerciseName}" em PORTUGUÊS DO BRASIL.
        O novo exercício deve manter o objetivo de: ${goal} e o foco em: ${focus}.
        Retorne as informações completas em JSON, com todos os textos em Português.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nome do exercício substituto" },
              series: { type: Type.INTEGER },
              reps: { type: Type.STRING },
              instructions: { type: Type.STRING, description: "Como fazer" },
              purpose: { type: Type.STRING, description: "Para que serve" },
              caloriesEstimate: { type: Type.INTEGER }
            },
            required: ["name", "series", "reps", "instructions", "purpose", "caloriesEstimate"]
          }
        }
      });

      const cleanText = cleanJsonString(response.text || "{}");
      const result = JSON.parse(cleanText);

      return {
        ...result,
        id: crypto.randomUUID(),
        completed: false
      };
    } catch (error) {
      console.error("Error replacing exercise:", error);
      return null;
    }
  };

  return { analyzeFoodText, suggestFoodFromIngredients, generateWorkoutPlan, suggestReplacementExercise };
};