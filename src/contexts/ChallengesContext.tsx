import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Challenge } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ChallengesContextType {
  challenges: Challenge[];
  currentWeekChallenge: Challenge | null;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateChallengeStatus: (id: string, status: 'pending' | 'accepted' | 'completed') => Promise<void>;
  generateWeeklyChallenge: () => Promise<void>;
  getChallengesByWeek: (week: string) => Challenge[];
  getCurrentWeek: () => string;
  loading: boolean;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};

const weeklyChallengeSuggestions = [
  "Economize R$ 50 esta semana cortando gastos desnecessários",
  "Não compre nada por impulso durante 7 dias",
  "Cozinhe todas as refeições em casa esta semana",
  "Cancele uma assinatura que você não usa",
  "Venda algo que não precisa mais",
  "Use transporte público ou caminhe ao invés de usar carro/uber",
  "Não gaste com delivery esta semana",
  "Faça um levantamento de todos os seus gastos fixos",
  "Negocie uma conta ou serviço para conseguir desconto",
  "Guarde todas as moedas que receber de troco",
  "Evite compras no supermercado além da lista",
  "Procure cupons de desconto antes de qualquer compra",
  "Organize suas finanças e elimine gastos duplicados",
  "Invista pelo menos R$ 20 em algum investimento",
  "Compare preços antes de fazer qualquer compra acima de R$ 30"
];

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentWeekChallenge, setCurrentWeekChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}-${week.toString().padStart(2, '0')}`;
  };

  // Carregar desafios do usuário
  const loadChallenges = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);

      // Encontrar desafio da semana atual
      const currentWeek = getCurrentWeek();
      const weekChallenge = data?.find(c => c.week === currentWeek);
      setCurrentWeekChallenge(weekChallenge || null);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadChallenges();
    } else {
      setChallenges([]);
      setCurrentWeekChallenge(null);
    }
  }, [user]);

  const addChallenge = async (challenge: Omit<Challenge, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('challenges')
        .insert([{ ...challenge, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setChallenges(prev => [data, ...prev]);
      
      if (data.week === getCurrentWeek()) {
        setCurrentWeekChallenge(data);
      }
    } catch (error) {
      console.error('Erro ao adicionar desafio:', error);
    }
  };

  const updateChallengeStatus = async (id: string, status: 'pending' | 'accepted' | 'completed') => {
    if (!user) return;

    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('challenges')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setChallenges(prev => prev.map(c => c.id === id ? data : c));
      
      if (data.week === getCurrentWeek()) {
        setCurrentWeekChallenge(data);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do desafio:', error);
    }
  };

  const generateWeeklyChallenge = async () => {
    if (!user) return;

    const currentWeek = getCurrentWeek();
    const existingChallenge = challenges.find(c => c.week === currentWeek);
    
    if (existingChallenge) return;

    const randomChallenge = weeklyChallengeSuggestions[
      Math.floor(Math.random() * weeklyChallengeSuggestions.length)
    ];

    await addChallenge({
      description: randomChallenge,
      status: 'pending',
      week: currentWeek
    });
  };

  const getChallengesByWeek = (week: string) => {
    return challenges.filter(c => c.week === week);
  };

  return (
    <ChallengesContext.Provider value={{
      challenges,
      currentWeekChallenge,
      addChallenge,
      updateChallengeStatus,
      generateWeeklyChallenge,
      getChallengesByWeek,
      getCurrentWeek,
      loading
    }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export type { Challenge };