import React from 'react';
import AppRoutes from './routes';
import { ThemeProvider } from '@/context/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
