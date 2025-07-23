import React, { createContext, useContext } from 'react';

// Context vazio para manter compatibilidade
const AuthContext = createContext<any>(undefined);

export const useAuth = () => {
  return { currentUser: { uid: 'local-user' }, loading: false };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};