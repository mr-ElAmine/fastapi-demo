import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

export interface User {
  id: string;
  email: string;
  exp: number;
  [key: string]: unknown; // Pour les autres claims éventuels
}

export interface AuthContextType {
  token: string | null;
  setToken: (newToken: string | null) => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(null);

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  const isTokenExpired = (exp: number | undefined) => {
    if (!exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  };

  useEffect(() => {
    if (token) {
      try {
        // Décodez le token et vérifiez son expiration
        const decoded = jwtDecode(token);
        if (isTokenExpired(decoded.exp)) {
          console.warn('Token expiré');
          setToken(null);
          return;
        }
        setUser(decoded as User);

        // Configure Axios pour inclure l'authentification
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);

        // Redirige si l'utilisateur est sur une page de connexion/inscription
        if (
          window.location.pathname === '/register' ||
          window.location.pathname === '/login'
        ) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        setToken(null);
      }
    } else {
      // Réinitialisez l'état si le token est nul
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
