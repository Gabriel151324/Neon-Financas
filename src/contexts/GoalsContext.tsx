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
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

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
  const { user } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setGoals([]);
      return;
      setGoals([]);
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
      return;
    }
    setGoals(data || []);
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
    if (!user) return;
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('goals')
      .insert([{ ...newGoal, user_id: user.id }]);

    if (error) {
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
    if (!user) return;

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting goal:', error);
      return;
    }
  const deleteGoal = async (id: string) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'goals', id));
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    }
  };

  const updateGoal = async (id: string, goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!user) return;

    const updatedGoal = { ...goal };
    
    // Check if goal is now completed
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      updatedGoal.completedAt = new Date().toISOString();
    } else {
      delete updatedGoal.completedAt;
    }

    const { error } = await supabase
      .from('goals')
      .update(updatedGoal)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating goal:', error);
      return;
    }

    setGoals(prev => 
      prev.map(g => {
        if (g.id === id) {
          const finalGoal = { ...g, ...updatedGoal };
          // Check if goal is now completed
          if (finalGoal.currentAmount >= finalGoal.targetAmount && !g.completedAt) {
            finalGoal.completedAt = new Date().toISOString();
          } else if (finalGoal.currentAmount < finalGoal.targetAmount && g.completedAt) {
            delete finalGoal.completedAt;
          }
          return finalGoal;
        }
        return g;
      })
    );
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    if (!user) return;

    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const updatedData = { currentAmount: amount };
    
    // Check if goal is now completed
    if (amount >= goal.targetAmount && !goal.completedAt) {
      updatedData.completedAt = new Date().toISOString();
    } else if (amount < goal.targetAmount && goal.completedAt) {
      delete updatedData.completedAt;
    }

    const { error } = await supabase
      .from('goals')
      .update(updatedData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
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