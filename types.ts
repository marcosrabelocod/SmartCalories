export interface SubFoodItem {
  id: string;
  name: string;
  calories: number;
}

export interface FoodItem {
  id: string;
  timestamp: Date;
  category: string;
  foods: SubFoodItem[];
}

export interface CalorieHeaderProps {
  caloriesCurrent: number;
  caloriesTotal: number;
  waterCurrent: number;
  waterTotal: number;
  onAddWater: (amount: number) => void;
}

export interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  confidence: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  series: number;
  reps: string;
  instructions: string;
  purpose: string;
  caloriesEstimate: number;
  completed: boolean;
  completionPercentage?: number;
}