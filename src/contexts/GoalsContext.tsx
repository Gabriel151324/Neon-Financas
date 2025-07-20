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

  useEffect(() => {
    const saved = localStorage.getItem('neon-finances-goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('neon-finances-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoal = (id: string, goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals(prev => 
      prev.map(g => {
        if (g.id === id) {
          const updatedGoal = { ...g, ...goal };
          // Check if goal is now completed
          if (updatedGoal.currentAmount >= updatedGoal.targetAmount && !g.completedAt) {
            updatedGoal.completedAt = new Date().toISOString();
          } else if (updatedGoal.currentAmount < updatedGoal.targetAmount && g.completedAt) {
            delete updatedGoal.completedAt;
          }
          return updatedGoal;
        }
        return g;
      })
    );
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(prev => 
      prev.map(g => {
        if (g.id === id) {
          const updatedGoal = { ...g, currentAmount: amount };
          // Check if goal is now completed
          if (updatedGoal.currentAmount >= updatedGoal.targetAmount && !g.completedAt) {
            updatedGoal.completedAt = new Date().toISOString();
          } else if (updatedGoal.currentAmount < updatedGoal.targetAmount && g.completedAt) {
            delete updatedGoal.completedAt;
          }
          return updatedGoal;
        }
        return g;
      })
    );
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