import { useEffect, useState } from 'react';
import ViagemCard from '../components/ViagemCard/ViagemCard';
import '../styles/MinhasViagens.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { apiService } from '../services/api';

import '../styles/SolicitacaoDetalhe.css';

const MinhasSolicitacoes = () => {
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

  console.log(solicitacoes);
  return (
    <>
      <Header />
      <Container>
        <div className='minhas-viagens-container'>
          <h2>Minhas Solicitações</h2>

          <div className='lista-viagens'>
            {solicitacoes.map((v) => (
              <ViagemCard categoria={'solicitacao'} key={v.id} viagem={v} />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MinhasSolicitacoes;
