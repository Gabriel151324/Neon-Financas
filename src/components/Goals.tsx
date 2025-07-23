import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, Calendar, TrendingUp, Filter, CheckCircle, Clock } from 'lucide-react';
import { useGoals, Goal } from '../contexts/GoalsContext';
import { formatCurrency, formatDate, formatDateInput } from '../utils/formatters';
import GoalModal from './GoalModal';

const Goals: React.FC = () => {
  const { 
    goals, 
    deleteGoal, 
    getGoalProgress, 
    isGoalCompleted, 
    getCompletedGoals, 
    getActiveGoals 
  } = useGoals();
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'created'>('created');

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleCloseModal = () => {
    setShowGoalModal(false);
    setEditingGoal(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteGoal(id);
    }
  };

  const getFilteredGoals = () => {
    let filteredGoals = goals;
    
    switch (filter) {
      case 'active':
        filteredGoals = getActiveGoals();
        break;
      case 'completed':
        filteredGoals = getCompletedGoals();
        break;
      default:
        filteredGoals = goals;
    }

    return filteredGoals.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'progress':
          return getGoalProgress(b) - getGoalProgress(a);
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  const filteredGoals = getFilteredGoals();
  const completedGoals = getCompletedGoals();
  const activeGoals = getActiveGoals();

  const getGoalIcon = (goal: Goal) => {
    if (isGoalCompleted(goal)) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <Target className="w-6 h-6 text-blue-500" />;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const isOverdue = (goal: Goal) => {
    if (!goal.deadline || isGoalCompleted(goal)) return false;
    return new Date(goal.deadline) < new Date();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total de Metas</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Metas Ativas</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{activeGoals.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Metas Concluídas</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{completedGoals.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-500" />
              Minhas Metas Financeiras
            </h2>
            <button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Nova Meta</span>
              <span className="sm:hidden">Meta</span>
            </button>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todas as Metas</option>
                <option value="active">Metas Ativas</option>
                <option value="completed">Metas Concluídas</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'deadline' | 'progress' | 'created')}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="created">Data de Criação</option>
                <option value="deadline">Prazo</option>
                <option value="progress">Progresso</option>
              </select>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {filteredGoals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                  {filter === 'all' ? 'Nenhuma meta encontrada' : 
                   filter === 'active' ? 'Nenhuma meta ativa' : 'Nenhuma meta concluída'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2">
                  Clique em "Nova Meta" para começar a definir seus objetivos financeiros
                </p>
              </div>
            ) : (
              filteredGoals.map(goal => {
                const progress = getGoalProgress(goal);
                const completed = isGoalCompleted(goal);
                const overdue = isOverdue(goal);
                
                return (
                  <div
                    key={goal.id}
                    className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      completed 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : overdue
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getGoalIcon(goal)}
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {goal.name}
                          </h3>
                          {goal.deadline && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className={`text-xs sm:text-sm ${
                                overdue ? 'text-red-600 font-medium' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {overdue ? 'Vencida em ' : 'Prazo: '}{formatDate(goal.deadline)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-3 sm:mt-0">
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className={`text-xs sm:text-sm font-medium ${
                          completed ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {progress.toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      {completed && (
                        <div className="flex items-center space-x-2 text-green-600 text-xs sm:text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span>Meta concluída!</span>
                          {goal.completedAt && (
                            <span className="text-gray-500 hidden sm:inline">
                              em {formatDate(goal.completedAt)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <GoalModal
        isOpen={showGoalModal}
        onClose={handleCloseModal}
        goal={editingGoal}
      />
    </div>
  );
};

export default Goals;