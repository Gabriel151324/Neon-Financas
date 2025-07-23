import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  completedAt?: string;
}

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  getCompletedGoals: () => Goal[];
  getActiveGoals: () => Goal[];
  getGoalProgress: (goal: Goal) => number;
  isGoalCompleted: (goal: Goal) => boolean;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('neon-finances-goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      } catch (error) {
        console.error('Error loading goals from localStorage:', error);
      }
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('neon-finances-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completedAt: goal.currentAmount >= goal.targetAmount ? new Date().toISOString() : undefined
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoal = (id: string, goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { 
        ...g, 
        ...goal,
        completedAt: goal.currentAmount >= goal.targetAmount ? new Date().toISOString() : undefined
      } : g
    ));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    setGoals(prev => prev.map(g => 
      g.id === id ? { 
        ...g, 
        currentAmount: amount,
        completedAt: amount >= goal.targetAmount ? new Date().toISOString() : undefined
      } : g
    ));
  };

  const getCompletedGoals = () => {
    return goals.filter(g => g.completedAt);
  };

  const getActiveGoals = () => {
    return goals.filter(g => !g.completedAt);
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const isGoalCompleted = (goal: Goal) => {
    return goal.currentAmount >= goal.targetAmount;
  };

  return (
    <GoalsContext.Provider value={{
      goals,
      addGoal,
      deleteGoal,
      updateGoal,
      updateGoalProgress,
      getCompletedGoals,
      getActiveGoals,
      getGoalProgress,
      isGoalCompleted
    }}>
      {children}
    </GoalsContext.Provider>
  );
};