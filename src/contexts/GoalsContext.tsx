import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

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
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setGoals([]);
      return;
    }

    // Listen to real-time updates from Firestore
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const goalsData: Goal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        goalsData.push({
          id: doc.id,
          name: data.name,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          deadline: data.deadline,
          createdAt: data.createdAt.toDate().toISOString(),
          completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : undefined
        });
      });
      setGoals(goalsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      const goalData = {
        ...goal,
        userId: currentUser.uid,
        createdAt: new Date(),
        completedAt: goal.currentAmount >= goal.targetAmount ? new Date() : null
      };
      
      await addDoc(collection(db, 'goals'), goalData);
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'goals', id));
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    }
  };

  const updateGoal = async (id: string, goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      const updateData = {
        ...goal,
        completedAt: goal.currentAmount >= goal.targetAmount ? new Date() : null
      };
      
      await updateDoc(doc(db, 'goals', id), updateData);
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
    }
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    if (!currentUser) return;

    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    try {
      const updateData = {
        currentAmount: amount,
        completedAt: amount >= goal.targetAmount ? new Date() : null
      };
      
      await updateDoc(doc(db, 'goals', id), updateData);
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
    }
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