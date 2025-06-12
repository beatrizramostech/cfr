import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import SubHeader from '../components/SubHeader/SubHeader';
import Container from '../components/Container/Container';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ModalChecklist from '../components/ModalChecklist/ModalChecklist';
import '../styles/ViagemDetalhe.css';
import ModalCancelamentoViagem from '../components/ModalCancelamentoViagem/ModalCancelamentoViagem';
import { useAlert } from '../contexts/AlertContext';

const ViagemDetalhe = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [viagem, setViagem] = useState(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        const data = await apiService.getViagensPorId(id);
        setViagem(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da viagem:', error);
      }
    };
    fetchViagem();
  }, [id]);

  if (!viagem) return <p>Carregando...</p>;

  const isMotorista =
    user.motorista === true || user.cnh === viagem.motorista?.cnh;

  const handleMarcarChegada = async (pontoId) => {
    try {
      await apiService.marcarChegada(pontoId);
      showAlert({ message: 'Chegada marcada com sucesso', type: 'success' });
    } catch (error) {
      console.error('Erro ao marcar chegada:', error);
      showAlert({ message: 'Erro ao marcar chegada' });
    }
  };

  const handleCancelarRota = async (pontoId) => {
    try {
      await apiService.cancelarRota(pontoId);
      showAlert({ message: 'Rota cancelada com sucesso', type: 'success' });
    } catch (error) {
      console.error('Erro ao cancelar rota:', error);
      showAlert({ message: 'Erro ao cancelar rota' });
    }
  };

  const handleIniciarViagem = async () => {
    try {
      await apiService.iniciarViagem(viagem.id);
      showAlert({ message: 'Viagem iniciada com sucesso', type: 'success' });
    } catch (error) {
      console.error('Erro ao iniciar viagem:', error);
      showAlert({ message: 'Erro ao iniciar viagem.' });
    }
  };
  const handleConcluirViagem = async () => {
    try {
      await apiService.concluirViagem(viagem.id);
      showAlert({ message: 'Viagem concluida com sucesso', type: 'success' });
    } catch (error) {
      console.error('Erro ao concluir viagem:', error);
      showAlert({ message: 'Erro ao concluir viagem' });
    }
  };
  console.log(viagem);
  const validarCancelamento = function () {
    const { dataChegada, status } = viagem;
    const dataChegadaViagem = new Date(dataChegada);
    const agora = new Date();
    agora.setHours(0, 0, 0, 0);
    dataChegadaViagem.setHours(0, 0, 0, 0);
    if (
      dataChegadaViagem < agora ||
      status.toLowerCase() != 'confirmada'
    ) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <>
      <Header />
      <SubHeader
        userName={user.nome || user.cpf}
        onBack={() => window.history.back()}
      />
      {showChecklistModal && (
        <ModalChecklist
          viagem={viagem}
          user={user}
          onClose={() => setShowChecklistModal(false)}
        />
      )}
      <Container>
        <div className='page'>
          <div className='detalhes-container'>
            <h2>Viagem #{viagem.onBaseID}</h2>

            <div className='detalhes-grid'>
              <div>
                <strong>Status</strong>
                <p>{viagem.status}</p>
              </div>
              <div>
                <strong>Motorista</strong>
                <p>{viagem.motorista != null ? viagem.motorista.nome : viagem.colaborador.nome}</p>
              </div>
              <div>
                <strong>Data de Saída</strong>
                <p>{viagem.dataPartida?.split('T')[0]}</p>
              </div>
              <div>
                <strong>Horário de Saída</strong>
                <p>{viagem.horaPartida}</p>
              </div>
              <div>
                <strong>Data de Chegada</strong>
                <p>{viagem.dataChegada?.split('T')[0]}</p>
              </div>
              <div>
                <strong>Horário de Chegada</strong>
                <p>{viagem.horaChegada}</p>
              </div>
              <div>
                <strong>Veículo</strong>
                <p>{viagem.veiculo?.placa}</p>
              </div>
              <div>
                <strong>Marca/Modelo</strong>
                <p>{`${viagem.veiculo?.marca} ${viagem.veiculo?.modelo}`}</p>
              </div>
              <div>
                <strong>Tipo de Viagem</strong>
                <p>{viagem.tipoViagem?.nome}</p>
              </div>
              <div>
                <strong>Motivo da Viagem</strong>
                <p>{viagem.motivoViagem?.nome}</p>
              </div>
            </div>

            <div className='rota-box'>
              <h3>Rota</h3>
              {viagem.pontosRota?.map((ponto) => (
                <div key={ponto.id} className='ponto-rota'>
                  <div className='ponto-rota-info'>
                    <p>
                      <strong>{ponto.tipoPonto}</strong>
                    </p>
                    <p>
                      {ponto.nomeLocal} - {ponto.municipio}/{ponto.uf}
                    </p>
                  </div>
                  {isMotorista && viagem.status.toLowerCase() != 'cancelada' && (
                    <div className='ponto-rota-actions'>
                      <button
                        className='secundario'
                        onClick={() => handleMarcarChegada(ponto.id)}
                      >
                        Marcar chegada
                      </button>
                      <button
                        className='perigo'
                        onClick={() => handleCancelarRota(ponto.id)}
                      >
                        Cancelar Rota
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='botoes-viagem'>
              {validarCancelamento() && (
                <button className='perigo' onClick={() => setModalOpen(true)}>
                  Cancelar Viagem
                </button>
              )}
              {isMotorista &&
                viagem.status.toLowerCase() == 'confirmada' && (
                  <>
                    <button
                      className='secundario'
                      onClick={() => setShowChecklistModal(true)}
                    >
                      Inserir Checklist
                    </button>
                    <button
                      className='primario'
                      onClick={handleIniciarViagem}
                    >
                      Iniciar Viagem
                    </button>
                  </>
                )}
                {isMotorista && viagem.status.toLowerCase() == 'iniciada' && (
                  <>
                    <button className='primario' onClick={handleConcluirViagem}>
                      Concluir Viagem
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
        {modalOpen && (
          <ModalCancelamentoViagem
            id={viagem.id}
            onClose={() => setModalOpen(false)}
          />
        )}
      </Container>
    </>
  );
};

export default ViagemDetalhe;
