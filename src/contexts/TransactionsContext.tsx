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

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  createdAt: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  getBalance: () => number;
  getTransactionsByType: (type: 'income' | 'expense') => Transaction[];
  getTransactionsByMonth: (month: string) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
  categories: string[];
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { currentUser } = useAuth();
  const { user } = useAuth();

  const categories = [
    'Alimentação',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Moradia',
    'Compras',
    'Investimentos',
    'Outros',
    'Salário',
    'Freelance',
    'Vendas',
    'Dividendos'
  ];

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      return;
      setTransactions([]);
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading transactions:', error);
      return;
    }
    setTransactions(data || []);
    // Listen to real-time updates from Firestore
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionsData.push({
          id: doc.id,
          type: data.type,
          description: data.description,
          amount: data.amount,
          date: data.date,
          category: data.category,
          createdAt: data.createdAt.toDate().toISOString()
        });
      });
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, [currentUser]);
    if (!user) return;
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('transactions')
      .insert([{ ...newTransaction, user_id: user.id }]);

    if (error) {
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: currentUser.uid,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }
  const deleteTransaction = async (id: string) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating transaction:', error);
      return;
    }
  const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, 'transactions', id), transaction);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const getBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
  };

  const getTransactionsByType = (type: 'income' | 'expense') => {
    return transactions.filter(t => t.type === type);
  };

  const getTransactionsByMonth = (month: string) => {
    return transactions.filter(t => t.date.startsWith(month));
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(t => t.category === category);
  };

  return (
    <TransactionsContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      getBalance,
      getTransactionsByType,
      getTransactionsByMonth,
      getTransactionsByCategory,
      categories
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};