import { useContext } from 'react';

import type { AuthContextType } from '@/provider/auth-provider';
import { AuthContext } from '@/provider/auth-provider';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
