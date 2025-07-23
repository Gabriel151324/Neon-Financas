import React from 'react';
import { BarChart3, List, Lightbulb, Target, PlusCircle, Trophy } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowTransactionModal: (show: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  setShowTransactionModal 
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transações', icon: List },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'challenges', label: 'Desafios', icon: Trophy },
    { id: 'tips', label: 'Dicas', icon: Lightbulb },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:block">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowTransactionModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-50"
      >
        <PlusCircle className="w-6 h-6" />
      </button>
    </>
  );
};

export default Navigation;