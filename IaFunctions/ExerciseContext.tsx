import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ExerciseItem } from '../types';

export type ExerciseGoal = 'perder_peso' | 'ganhar_massa' | 'manter_equilibrado' | null;
export type ExerciseFocus = 'superiores' | 'inferiores' | 'full_body' | null;

interface ExerciseContextType {
  isSetup: boolean;
  goal: ExerciseGoal;
  focus: ExerciseFocus;
  burnedCalories: number;
  targetBurn: number;
  workoutPlan: ExerciseItem[];
  updateGoal: (goal: ExerciseGoal) => void;
  updateFocus: (focus: ExerciseFocus) => void;
  completeSetup: () => void;
  addBurnedCalories: (amount: number) => void;
  resetSetup: () => void;
  setWorkoutPlan: (plan: ExerciseItem[]) => void;
  markExerciseComplete: (id: string, percentage?: number) => void;
  replaceExerciseInPlan: (oldId: string, newExercise: ExerciseItem) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

const STORAGE_KEY = 'smartcal_exercise_data';

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSetup, setIsSetup] = useState(false);
  const [goal, setGoal] = useState<ExerciseGoal>(null);
  const [focus, setFocus] = useState<ExerciseFocus>(null);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [targetBurn, setTargetBurn] = useState(500);
  const [workoutPlan, setWorkoutPlanState] = useState<ExerciseItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setIsSetup(data.isSetup || false);
      setGoal(data.goal || null);
      setFocus(data.focus || null);
      setBurnedCalories(data.burnedCalories || 0);
      setTargetBurn(data.targetBurn || 500);
      setWorkoutPlanState(data.workoutPlan || []);
    }
  }, []);

  useEffect(() => {
    const data = { isSetup, goal, focus, burnedCalories, targetBurn, workoutPlan };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [isSetup, goal, focus, burnedCalories, targetBurn, workoutPlan]);

  useEffect(() => {
    if (goal === 'perder_peso') setTargetBurn(800);
    else if (goal === 'ganhar_massa') setTargetBurn(400);
    else setTargetBurn(500);
  }, [goal]);

  const updateGoal = (newGoal: ExerciseGoal) => setGoal(newGoal);
  const updateFocus = (newFocus: ExerciseFocus) => setFocus(newFocus);
  
  const completeSetup = () => {
    if (goal && focus) {
      setIsSetup(true);
    }
  };

  const addBurnedCalories = (amount: number) => {
    setBurnedCalories(prev => prev + amount);
  };

  const resetSetup = () => {
    setIsSetup(false);
    setGoal(null);
    setFocus(null);
    setBurnedCalories(0);
    setWorkoutPlanState([]);
  };

  const setWorkoutPlan = (plan: ExerciseItem[]) => {
    setWorkoutPlanState(plan);
  };

  const markExerciseComplete = (id: string, percentage: number = 100) => {
    setWorkoutPlanState(prev => prev.map(ex => {
      if (ex.id === id && !ex.completed) {
        const actualCalories = Math.round((ex.caloriesEstimate * percentage) / 100);
        addBurnedCalories(actualCalories);
        return { ...ex, completed: true, completionPercentage: percentage };
      }
      return ex;
    }));
  };

  const replaceExerciseInPlan = (oldId: string, newExercise: ExerciseItem) => {
    setWorkoutPlanState(prev => prev.map(ex => 
      ex.id === oldId ? newExercise : ex
    ));
  };

  return (
    <ExerciseContext.Provider value={{
      isSetup,
      goal,
      focus,
      burnedCalories,
      targetBurn,
      workoutPlan,
      updateGoal,
      updateFocus,
      completeSetup,
      addBurnedCalories,
      resetSetup,
      setWorkoutPlan,
      markExerciseComplete,
      replaceExerciseInPlan
    }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within a ExerciseProvider');
  }
  return context;
};