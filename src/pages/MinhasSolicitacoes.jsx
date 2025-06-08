import { useEffect, useState } from 'react';
import ViagemCard from '../components/ViagemCard/ViagemCard';
import '../styles/MinhasViagens.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { apiService } from '../services/api';
import SubHeader from '../components/SubHeader/SubHeader';

import '../styles/SolicitacaoDetalhe.css';
import { useAuth } from '../contexts/AuthContext';

const MinhasSolicitacoes = () => {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const data = await apiService.getSolicitacoes();
        setSolicitacoes(data.dados);
      } catch (error) {
        console.log('Erro ao buscar solicitações', error);
      }
    };

    fetchSolicitacoes();
  }, []);

  const solicitacaoComPendencia = solicitacoes.find(
    (s) => s.status.toLowerCase() === 'em pendência',
  );

  console.log(solicitacoes);
  return (
    <>
      <Header />
      <SubHeader onBack={() => window.history.back()} userName={user.nome} />
      <Container>
        <div className='minhas-viagens-container'>
          <h2>Minhas Solicitações</h2>

          {solicitacaoComPendencia && (
            <>
              <p className='aviso'>
                Atenção! Você tem solicitações com pendência. Certifique-se de
                respondê-las para prosseguimento da análise.
              </p>
              <ViagemCard viagem={solicitacaoComPendencia} isDestaque />
            </>
          )}

          <div className='lista-viagens'>
            {solicitacoes.map((v) => (
              <ViagemCard
                categoria={'solicitacao'}
                key={v.id}
                viagem={v}
                isDestaque={v.status === 'EM PENDÊNCIA'}
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MinhasSolicitacoes;
