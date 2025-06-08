import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import MinhasViagens from '../pages/MinhasViagens';
import MinhasSolicitacoes from '../pages/MinhasSolicitacoes';
import SolicitacaoDetalhe from '../pages/SolicitacaoDetalhe';
import ProtectedRoute from './ProtectedRoute';
import ViagemDetalhe from '../pages/ViagemDetalhe';
import NovaSolicitacao from '../pages/NovaSolicitacao';

const { VITE_NAME_APP } = import.meta.env;

const routes = createBrowserRouter([
  // Rota de login (pública)
  {
    path: `/${VITE_NAME_APP}`,
    element: <LoginPage />,
  },

  // Rotas protegidas
  {
    path: `/${VITE_NAME_APP}/home`,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: `/${VITE_NAME_APP}/minhas-viagens`,
    element: (
      <ProtectedRoute>
        <MinhasViagens />
      </ProtectedRoute>
    ),
  },
  {
    path: `/${VITE_NAME_APP}/minhas-solicitacoes`,
    element: (
      <ProtectedRoute>
        <MinhasSolicitacoes />
      </ProtectedRoute>
    ),
  },
  {
    path: `/${VITE_NAME_APP}/detalhes-viagem/:id`,
    element: (
      <ProtectedRoute>
        <ViagemDetalhe />
      </ProtectedRoute>
    ),
  },
  {
    path: `/${VITE_NAME_APP}/solicitacao-detalhe/:id`,
    element: (
      <ProtectedRoute>
        <SolicitacaoDetalhe />
      </ProtectedRoute>
    ),
  },
  {
    path: `/${VITE_NAME_APP}/nova-solicitacao`,
    element: (
      <ProtectedRoute>
        <NovaSolicitacao />
      </ProtectedRoute>
    ),
  },

  // Fallback 404
  {
    path: `/${VITE_NAME_APP}/*`,
    element: <NotFound />,
  },
]);

export default routes;
