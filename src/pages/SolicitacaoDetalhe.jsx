import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubHeader from '../components/SubHeader/SubHeader';
import { apiService } from '../services/api';
import Header from '../components/Header/Header';
import ModalPendencia from '../components/ModalPendencia/ModalPendencia';
import { useAuth } from '../contexts/AuthContext';
import '../styles/SolicitacaoDetalhe.css';
import Container from '../components/Container/Container';

const SolicitacaoDetalhe = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [solicitacao, setSolicitacao] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSolicitacao = async () => {
      try {
        const data = await apiService.getSolicitacaoPorId(id);
        setSolicitacao(data);
      } catch (err) {
        console.error('Erro ao buscar solicitação:', err);
      }
    };

    fetchSolicitacao();
  }, [id]);

  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
  };

  if (!solicitacao) return <p>Carregando...</p>;
  const {
    status,
    horaPartida,
    dataPartida,
    horaChegada,
    dataChegada,
    motoristaSolicitado,
    tipoVeiculo,
    tipoViagem,
    motivoViagem,
    pontosRota = {},
  } = solicitacao;

  return (
    <>
      <Header />
      <SubHeader
        userName={user.nome || user.cpf}
        onBack={() => window.history.back()}
      />
      <Container>
        <div className='page'>
          <div className='detalhes-container'>
            <h2>Solicitação #{solicitacao.onBaseID}</h2>
          </div>
          <div className='detalhes-grid'>
            <div>
              <strong>Status</strong>
              <p>{status}</p>
            </div>
            <div>
              <strong>Horário de Saída</strong>
              <p>{horaPartida}</p>
            </div>
            <div>
              <strong>Data de Saída</strong>
              <p>{formatDate(dataPartida)}</p>
            </div>
            <div>
              <strong>Horário de Chegada</strong>
              <p>{horaChegada}</p>
            </div>
            <div>
              <strong>Data de Chegada</strong>
              <p>{formatDate(dataChegada)}</p>
            </div>
            <div>
              <strong>Motorista Solicitado?</strong>
              <p>{motoristaSolicitado ? 'Sim' : 'Não'}</p>
            </div>
            <div>
              <strong>Tipo de Veículo</strong>
              <p>{tipoVeiculo.nome}</p>
            </div>
            <div>
              <strong>Tipo de Viagem</strong>
              <p>{tipoViagem.nome}</p>
            </div>
            <div className='grid-full'>
              <strong>Motivo da Viagem</strong>
              <p>{motivoViagem.nome}</p>
            </div>
          </div>
          <div className='rota-box'>
            <h4>Rota</h4>
            {pontosRota != [] &&
              pontosRota.map((ponto) => (
                <div key={ponto.id} className='ponto-rota'>
                  <div className='ponto-rota-info'>
                    <p>
                      <strong>{ponto.tipoPonto}</strong>
                    </p>
                    <p>
                      {ponto.nomeLocal} - {ponto.municipio}/{ponto.uf}
                    </p>
                  </div>{' '}
                </div>
              ))}
          </div>
          {solicitacao.pendencia && (
            <button className='primario' onClick={() => setModalOpen(true)}>
              Responder Pendência
            </button>
          )}
        </div>
        {!solicitacao.pendencia && status == 'EM PENDÊNCIA' && <p>WTF?</p>}
        {modalOpen && (
          <ModalPendencia
            solicitacao={solicitacao}
            onClose={() => setModalOpen(false)}
          />
        )}
      </Container>
    </>
  );
};

export default SolicitacaoDetalhe;
