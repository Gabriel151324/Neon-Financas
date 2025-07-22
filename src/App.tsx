import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { GoalsProvider } from './contexts/GoalsContext';
import AuthScreen from './components/Auth/AuthScreen';
import AuthScreen from './components/Auth/AuthScreen';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import TransactionModal from './components/TransactionModal';
import Goals from './components/Goals';
import Tips from './components/Tips';
import { Transaction } from './contexts/TransactionsContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleCloseModal = () => {
    setShowTransactionModal(false);
    setEditingTransaction(undefined);
  };

  // PWA Setup
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsList onEditTransaction={handleEditTransaction} />;
      case 'goals':
        return <Goals />;
      case 'tips':
        return <Tips />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TransactionsProvider>
      <GoalsProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <Navigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowTransactionModal={setShowTransactionModal}
          />
    <TransactionsProvider>
      <GoalsProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <Navigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowTransactionModal={setShowTransactionModal}
          />
          <main className="pb-20">
            {renderContent()}
          </main>
          <TransactionModal
            isOpen={showTransactionModal}
            onClose={handleCloseModal}
            transaction={editingTransaction}
          />
        </div>
      </GoalsProvider>
    </TransactionsProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;