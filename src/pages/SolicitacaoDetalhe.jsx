import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { apiService } from '../services/api';
import Header from '../components/Header/Header';
import ModalPendencia from '../components/ModalPendencia/ModalPendencia';

const SolicitacaoDetalhe = () => {
  const { id } = useParams();
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
  console.log(solicitacao);
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
      <div className='detalhes-container'>
        <div className='detalhes-header'>
          <h2>Solicitação #{solicitacao.onBaseID}</h2>
          <div className='usuario-logado'>João da Silva</div>
        </div>

        <div className='detalhes-card'>
          <div className='grid-detalhes'>
            <div>
              <label>Status</label>
              <input disabled value={status} />
            </div>
            <div>
              <label>Horário de Saída</label>
              <input disabled value={horaPartida} />
            </div>
            <div>
              <label>Data de Saída</label>
              <input disabled value={formatDate(dataPartida)} />
            </div>
            <div>
              <label>Horário de Chegada</label>
              <input disabled value={horaChegada} />
            </div>
            <div>
              <label>Data de Chegada</label>
              <input disabled value={formatDate(dataChegada)} />
            </div>
            <div>
              <label>Motorista Solicitado?</label>
              <input disabled value={motoristaSolicitado ? 'Sim' : 'Não'} />
            </div>
            <div>
              <label>Tipo de Veículo</label>
              <input disabled value={tipoVeiculo.nome} />
            </div>
            <div>
              <label>Tipo de Viagem</label>
              <input disabled value={tipoViagem.nome} />
            </div>
            <div className='grid-full'>
              <label>Motivo da Viagem</label>
              <input disabled value={motivoViagem.nome} />
            </div>
          </div>

          {pontosRota != [] && (
            <div className='rota-container'>
              <h4>Rota</h4>
              <div className='rota-bloco'>
                <label>Origem</label>
                <p>{pontosRota}</p>
              </div>
              {pontosRota && (
                <div className='rota-bloco'>
                  <label>Intermediário</label>
                  <p>{pontosRota}</p>
                </div>
              )}
              <div className='rota-bloco'>
                <label>Destino</label>
                <p>{pontosRota}</p>
              </div>
            </div>
          )}

          <button
            className='botao-responder'
            onClick={() => setModalOpen(true)}
          >
            Responder Pendência
          </button>
        </div>

        {modalOpen && (
          <ModalPendencia onClose={()=>setModalOpen(false)}/>
        )}
      </div>
    </>
  );
};

export default SolicitacaoDetalhe;
