import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { GoalsProvider } from './contexts/GoalsContext';
import { ChallengesProvider } from './contexts/ChallengesContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import TransactionModal from './components/TransactionModal';
import Goals from './components/Goals';
import Challenges from './components/Challenges';
import Tips from './components/Tips';
import AuthScreen from './components/Auth/AuthScreen';
import { Transaction } from './contexts/TransactionsContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | undefined>();

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleCloseModal = () => {
    setShowTransactionModal(false);
    setEditingTransaction(undefined);
  };

  // PWA Setup
  React.useEffect(() => {
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if user is not logged in
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
      case 'challenges':
        return <Challenges />;
      case 'tips':
        return <Tips />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TransactionsProvider>
      <GoalsProvider>
        <ChallengesProvider>
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
        </ChallengesProvider>
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