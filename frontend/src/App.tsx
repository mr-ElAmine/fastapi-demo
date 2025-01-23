import { StrictMode } from 'react';

import { AuthProvider } from './provider/auth-provider.tsx';
import RouterApp from './routes/index.tsx';

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <RouterApp />
      </AuthProvider>
    </StrictMode>
  );
}

export default App;
