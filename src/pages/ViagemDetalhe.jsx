import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import SubHeader from '../components/SubHeader/SubHeader';
import Container from '../components/Container/Container';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ViagemDetalhe.css';

const ViagemDetalhe = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [viagem, setViagem] = useState(null);

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

  const isMotorista = true;
  // user.motorista === true || user.cnh === viagem.motorista?.cnh;

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
            <h2>Viagem #{viagem.onBaseID}</h2>

            <div className='detalhes-grid'>
              <div>
                <strong>Status</strong>
                <p>{viagem.status}</p>
              </div>
              <div>
                <strong>Motorista</strong>
                <p>{viagem.motorista?.nome}</p>
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
              {viagem.pontosRota?.map((ponto, idx) => (
                <div key={ponto.id} className='ponto-rota'>
                  <div className='ponto-rota-info'>
                    <p>
                      <strong>{ponto.tipoPonto}</strong>
                    </p>
                    <p>
                      {ponto.nomeLocal} - {ponto.municipio}/{ponto.uf}
                    </p>
                  </div>
                  {isMotorista && (
                    <div className='ponto-rota-actions'>
                      <button className='secundario'>Marcar chegada</button>
                      <button className='perigo'>Cancelar Rota</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='botoes-viagem'>
              <button className='perigo'>Cancelar Viagem</button>
              {isMotorista && (
                <>
                  <button className='secundario'>Inserir Checklist</button>
                  <button className='primario'>Iniciar Viagem</button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ViagemDetalhe;
