import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Goal } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoal: (id: string, goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateGoalProgress: (id: string, amount: number) => Promise<void>;
  getCompletedGoals: () => Goal[];
  getActiveGoals: () => Goal[];
  getGoalProgress: (goal: Goal) => number;
  isGoalCompleted: (goal: Goal) => boolean;
  loading: boolean;
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
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar metas do usuário
  const loadGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadGoals();
    } else {
      setGoals([]);
    }
  }, [user]);

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const goalData = {
        ...goal,
        user_id: user.id,
        completed_at: goal.current_amount >= goal.target_amount ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('goals')
        .insert([goalData])
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => [data, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    }
  };

  const updateGoal = async (id: string, goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const goalData = {
        ...goal,
        completed_at: goal.current_amount >= goal.target_amount ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? data : g));
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
    }
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal || !user) return;

    try {
      const goalData = {
        current_amount: amount,
        completed_at: amount >= goal.target_amount ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? data : g));
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
    }
  };

  const getCompletedGoals = () => {
    return goals.filter(g => g.completed_at);
  };

  const getActiveGoals = () => {
    return goals.filter(g => !g.completed_at);
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100);
  };

  const isGoalCompleted = (goal: Goal) => {
    return Number(goal.current_amount) >= Number(goal.target_amount);
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
      isGoalCompleted,
      loading
    }}>
      {children}
    </GoalsContext.Provider>
  );
};

// Manter compatibilidade com o tipo existente
export type { Goal };