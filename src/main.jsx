import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import routes from './routes/routes.jsx';
import { RouterProvider } from 'react-router-dom';
import { AlertProvider } from './contexts/AlertContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AlertProvider>
        <RouterProvider router={routes} />
      </AlertProvider>
    </AuthProvider>
  </StrictMode>,
);
