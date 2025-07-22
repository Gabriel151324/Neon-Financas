import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Neon Finanças
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">v2.0</p>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Controle suas finanças de forma{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              inteligente
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Gerencie suas despesas, defina metas financeiras e alcance seus objetivos 
            com nossa plataforma moderna e intuitiva.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Dashboard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize seus dados financeiros
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Metas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Defina e acompanhe objetivos
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">💡</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Dicas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aprenda sobre finanças
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex items-center justify-center">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;