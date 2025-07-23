import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, CheckCircle, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { useChallenges } from '../contexts/ChallengesContext';
import { formatDate } from '../utils/formatters';

const Challenges: React.FC = () => {
  const { 
    challenges, 
    currentWeekChallenge, 
    updateChallengeStatus, 
    generateWeeklyChallenge,
    getCurrentWeek,
    loading 
  } = useChallenges();

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Gerar desafio da semana se não existir
    if (!currentWeekChallenge && !loading) {
      generateWeeklyChallenge();
    }
  }, [currentWeekChallenge, loading, generateWeeklyChallenge]);

  const handleAcceptChallenge = async () => {
    if (currentWeekChallenge) {
      await updateChallengeStatus(currentWeekChallenge.id!, 'accepted');
    }
  };

  const handleCompleteChallenge = async () => {
    if (currentWeekChallenge) {
      await updateChallengeStatus(currentWeekChallenge.id!, 'completed');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'accepted':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'accepted':
        return 'Em Andamento';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'accepted':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  const acceptedChallenges = challenges.filter(c => c.status === 'accepted').length;
  const historyWeeks = [...new Set(challenges.map(c => c.week))].sort().reverse();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Desafios Concluídos</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{completedChallenges}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Andamento</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{acceptedChallenges}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Desafios</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{challenges.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Week Challenge */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-2 sm:mb-0">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-500" />
              Desafio da Semana
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              Semana {getCurrentWeek().split('-')[1]}/{getCurrentWeek().split('-')[0]}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : currentWeekChallenge ? (
            <div className={`p-4 sm:p-6 rounded-xl border-2 ${
              currentWeekChallenge.status === 'completed' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : currentWeekChallenge.status === 'accepted'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                  <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {currentWeekChallenge.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(currentWeekChallenge.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentWeekChallenge.status)}`}>
                      {getStatusText(currentWeekChallenge.status)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {currentWeekChallenge.status === 'pending' && (
                    <button
                      onClick={handleAcceptChallenge}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Aceitar Desafio
                    </button>
                  )}
                  {currentWeekChallenge.status === 'accepted' && (
                    <button
                      onClick={handleCompleteChallenge}
                      className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Marcar como Concluído
                    </button>
                  )}
                  {currentWeekChallenge.status === 'completed' && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Parabéns! Desafio concluído!
                    </div>
                  )}
                </div>
              </div>

              {currentWeekChallenge.completed_at && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Concluído em {formatDate(currentWeekChallenge.completed_at)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                Gerando seu desafio da semana...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Desafios
            </h3>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {showHistory ? 'Ocultar' : 'Ver Histórico'}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-4">
              {historyWeeks.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum histórico de desafios ainda
                  </p>
                </div>
              ) : (
                historyWeeks.map(week => {
                  const weekChallenges = challenges.filter(c => c.week === week);
                  return (
                    <div key={week} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1 sm:mb-0">
                          Semana {week.split('-')[1]}/{week.split('-')[0]}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {weekChallenges.length} desafio{weekChallenges.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {weekChallenges.map(challenge => (
                          <div key={challenge.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex-1 mb-2 sm:mb-0 sm:mr-3">
                              <p className="text-sm text-gray-900 dark:text-white">
                                {challenge.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(challenge.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                                {getStatusText(challenge.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;