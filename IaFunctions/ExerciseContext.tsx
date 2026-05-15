import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ExerciseItem } from '../types';

export type ExerciseGoal = 'perder_peso' | 'ganhar_massa' | 'manter_equilibrado' | null;
export type ExerciseFocus = 'superiores' | 'inferiores' | 'full_body' | null;
export type ExerciseType = 'calistenia' | 'academia' | null;

export interface DynamicActivity {
  id: string;
  name: string;
  duration: number;
  durationUnit: 'segundos' | 'minutos' | 'horas';
  time: string;
}

interface ExerciseContextType {
  isSetup: boolean;
  goal: ExerciseGoal;
  focus: ExerciseFocus;
  workoutType: ExerciseType;
  burnedCalories: number;
  targetBurn: number;
  workoutPlan: ExerciseItem[];
  dailyActivities: DynamicActivity[];
  updateGoal: (goal: ExerciseGoal) => void;
  updateFocus: (focus: ExerciseFocus) => void;
  updateWorkoutType: (type: ExerciseType) => void;
  completeSetup: () => void;
  addBurnedCalories: (amount: number) => void;
  resetSetup: () => void;
  setWorkoutPlan: (plan: ExerciseItem[]) => void;
  markExerciseComplete: (id: string, percentage?: number) => void;
  replaceExerciseInPlan: (oldId: string, newExercise: ExerciseItem) => void;
  addDailyActivity: (name: string, duration: number, durationUnit: 'segundos' | 'minutos' | 'horas', time: string) => void;
  removeDailyActivity: (id: string) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSetup, setIsSetup] = useState(false);
  const [goal, setGoal] = useState<ExerciseGoal>(null);
  const [focus, setFocus] = useState<ExerciseFocus>(null);
  const [workoutType, setWorkoutType] = useState<ExerciseType>(null);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [targetBurn, setTargetBurn] = useState(500);
  const [workoutPlan, setWorkoutPlanState] = useState<ExerciseItem[]>([]);
  const [dailyActivities, setDailyActivities] = useState<DynamicActivity[]>([]);

  // Lógica de definição da meta calórica baseada no objetivo selecionado
  useEffect(() => {
    if (goal === 'perder_peso') setTargetBurn(800);
    else if (goal === 'ganhar_massa') setTargetBurn(400);
    else setTargetBurn(500);
  }, [goal]);

  const updateGoal = (newGoal: ExerciseGoal) => setGoal(newGoal);
  const updateFocus = (newFocus: ExerciseFocus) => setFocus(newFocus);
  const updateWorkoutType = (newType: ExerciseType) => setWorkoutType(newType);
  
  const completeSetup = () => {
    if (goal && focus && workoutType) {
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
    setWorkoutType(null);
    setBurnedCalories(0);
    setWorkoutPlanState([]);
    setDailyActivities([]);
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

  const addDailyActivity = (name: string, duration: number, durationUnit: 'segundos' | 'minutos' | 'horas', time: string) => {
    let durationMin = duration;
    if (durationUnit === 'segundos') durationMin = duration / 60;
    if (durationUnit === 'horas') durationMin = duration * 60;

    setDailyActivities(prev => [...prev, { id: crypto.randomUUID(), name, duration, durationUnit, time }]);
    // Rough estimate for manual activity: 5 kcal/min. In a real app we'd use METs.
    addBurnedCalories(Math.round(durationMin * 5)); 
  };

  const removeDailyActivity = (id: string) => {
    setDailyActivities(prev => {
      const activity = prev.find(a => a.id === id);
      if (activity) {
         let durationMin = activity.duration;
         if (activity.durationUnit === 'segundos') durationMin = activity.duration / 60;
         if (activity.durationUnit === 'horas') durationMin = activity.duration * 60;
         setBurnedCalories(c => Math.max(0, c - Math.round(durationMin * 5)));
      }
      return prev.filter(a => a.id !== id);
    });
  };

  return (
    <ExerciseContext.Provider value={{
      isSetup,
      goal,
      focus,
      workoutType,
      burnedCalories,
      targetBurn,
      workoutPlan,
      dailyActivities,
      updateGoal,
      updateFocus,
      updateWorkoutType,
      completeSetup,
      addBurnedCalories,
      resetSetup,
      setWorkoutPlan,
      markExerciseComplete,
      replaceExerciseInPlan,
      addDailyActivity,
      removeDailyActivity
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