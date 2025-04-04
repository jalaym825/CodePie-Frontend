import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthContextProvider from './context/AuthContextProvider';
import { BrowserRouter as Router } from 'react-router-dom'; // Updated import
import { Toaster } from 'sonner';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Toaster richColors={true} />
    <AuthContextProvider>
      <Router>
        <App />
      </Router>
    </AuthContextProvider>
  </StrictMode>
);