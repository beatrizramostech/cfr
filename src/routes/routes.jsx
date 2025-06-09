import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import MinhasViagens from '../pages/MinhasViagens';
import MinhasSolicitacoes from '../pages/MinhasSolicitacoes';
import SolicitacaoDetalhe from '../pages/SolicitacaoDetalhe';
import ViagemDetalhe from '../pages/ViagemDetalhe';
import NovaSolicitacao from '../pages/NovaSolicitacao';
import ProtectedRoute from './ProtectedRoute';

const { VITE_NAME_APP } = import.meta.env;

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LoginPage />} />
      <Route
        path='home'
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path='minhas-viagens'
        element={
          <ProtectedRoute>
            <MinhasViagens />
          </ProtectedRoute>
        }
      />
      <Route
        path='minhas-solicitacoes'
        element={
          <ProtectedRoute>
            <MinhasSolicitacoes />
          </ProtectedRoute>
        }
      />
      <Route
        path='detalhes-viagem/:id'
        element={
          <ProtectedRoute>
            <ViagemDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path='solicitacao-detalhe/:id'
        element={
          <ProtectedRoute>
            <SolicitacaoDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path='nova-solicitacao'
        element={
          <ProtectedRoute>
            <NovaSolicitacao />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound />} />
    </>,
  ),
  {
    basename: `/${ VITE_NAME_APP }`,
  },
);

export default router;
