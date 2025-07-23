import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Filter } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionsContext';
import { formatCurrency, getMonthYear, getMonthName } from '../utils/formatters';
import ExpenseChart from './ExpenseChart';
import MonthlyChart from './MonthlyChart';

const Dashboard: React.FC = () => {
  const { transactions, getBalance, getTransactionsByType, categories } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const balance = getBalance();
  const income = getTransactionsByType('income');
  const expenses = getTransactionsByType('expense');

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Get unique months
  const months = [...new Set(transactions.map(t => getMonthYear(t.date)))].sort().reverse();

  const filteredTransactions = transactions.filter(t => {
    const matchesMonth = !selectedMonth || getMonthYear(t.date) === selectedMonth;
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesMonth && matchesCategory;
  });

  const clearFilters = () => {
    setSelectedMonth('');
    setSelectedCategory('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Total</p>
              <p className={`text-lg sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                {balance >= 0 ? 'Situação positiva' : 'Atenção aos gastos'}
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-full ${balance >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Receitas</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                {income.length} transação{income.length !== 1 ? 'ões' : ''}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-transform duration-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Despesas</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                {expenses.length} transação{expenses.length !== 1 ? 'ões' : ''}
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Filtros
          </h2>
          {(selectedMonth || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mês
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os meses</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <ExpenseChart transactions={filteredTransactions} />
        <MonthlyChart transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;