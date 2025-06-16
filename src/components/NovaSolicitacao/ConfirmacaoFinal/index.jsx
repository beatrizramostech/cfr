import React from 'react';
import { apiService } from '../../../services/api.js';
import './index.css';
import Container from '../../Container/index.jsx';
import { useAlert } from '../../../contexts/AlertContext/index.jsx';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../utils/pathBuilder.js';
import { formatDate } from '../../../utils/formatDate.js';

const ConfirmacaoFinal = ({ dados, pontos, onBack }) => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const origem = pontos.find((p) => p.tipoPonto === 'Origem');
  const destino = pontos.find((p) => p.tipoPonto === 'Destino');

  const handleConfirmar = async () => {
    if (!origem || !destino) {
      showAlert({ message: 'Rota precisa ter ORIGEM E DESTINO' });
      return;
    }
    const payload = {
      ...dados,
      localOrigem: origem?.nomeLocal,
      municipioOrigem: origem?.municipio,
      localDestino: destino?.nomeLocal,
      municipioDestino: destino?.municipio,
      pontosRota: pontos.map((ponto, idx) => ({
        ...ponto,
        ordem: idx + 1,
      })),
    };

    if (
      !dados.procurador?.nome &&
      !dados.procurador?.cpf &&
      !dados.procurador?.email &&
      !dados.procurador?.telefone
    ) {
      delete payload.procurador;
    }

    if (!payload.interessado.cnhValidade) {
      delete payload.interessado.cnhValidade;
    }

    try {
      const data = await apiService.criarSolicitacao(payload);
      if (data.status === 200) {
        showAlert({
          message: 'Solicitação enviada com sucesso',
          type: 'success',
        });
        navigate(path.minhasSolicitacoes);
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      showAlert({ message: 'Erro ao enviar solicitação' });
    }
  };
  return (
    <Container>
      <div className="page">
        <h3>Confirma os dados da solicitação?</h3>

        <div className="resumo-solicitacao">
          <div className="rotas-row">
            <p>
              <strong>Interessado:</strong> {dados.interessado?.nome}
              <strong>CPF:</strong> {dados.interessado?.cpf}
            </p>
            <p>
              <strong>Motorista:</strong> {dados.motoristaSolicitado}
            </p>
          </div>
          <div className="rotas-row">
            <p>
              <strong>Tipo de Veículo:</strong> {dados.tipoVeiculo}
            </p>
            <p>
              <strong>Tipo de Viagem:</strong> {dados.tipoViagem}
            </p>
          </div>
          <div className="rotas-row">
            <p>
              <strong>Motivo da Viagem:</strong> {dados.motivoViagem}
            </p>
            <p>
              <strong>Saída:</strong> {formatDate(dados.dataPartida)} —{' '}
              {dados.horaPartida}
            </p>
          </div>
          <div className="rotas-row">
            <p>
              <strong>Chegada:</strong> {formatDate(dados.dataChegada)} —{' '}
              {dados.horaChegada}
            </p>

            <div className="unidade-municipio">
              <p>
                <strong>Unidade:</strong> {pontos[pontos.length - 1]?.nomeLocal}
                {'  '}
                <strong>Município:</strong>{' '}
                {pontos[pontos.length - 1]?.municipio}
              </p>
            </div>
          </div>
        </div>

        <div className="resumo-rota">
          <h4>Rota</h4>
          <div className="rota-linha">
            {pontos.map((ponto, idx) => (
              <React.Fragment key={idx}>
                <div className="ponto-rota">
                  <div className="ponto-bolinha" />
                  <span>{ponto.nomeLocal}</span>
                </div>
                {idx < pontos.length - 1 && <div className="ponto-seta">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="confirmacao-botoes">
          <button className="perigo" onClick={onBack}>
            Não
          </button>
          <button className="primario" onClick={handleConfirmar}>
            Sim
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ConfirmacaoFinal;
