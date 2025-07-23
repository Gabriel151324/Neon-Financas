import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Neon Finanças
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Controle financeiro pessoal moderno
          </p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <SignUpForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Neon Finanças 2.0 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;