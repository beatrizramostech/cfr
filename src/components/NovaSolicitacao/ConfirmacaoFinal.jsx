import React from 'react';
import { apiService } from '../../services/api';
import './ConfirmacaoFinal.css';
import Container from '../Container/Container';
import { useAlert } from '../../contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/pathBuilder';

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
        ordem: idx,
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
      console.log('try', payload)
      alert(payload)
      const data = await apiService.criarSolicitacao(payload);
      if(data.status === 200) {
        showAlert({
          message: 'Solicitação enviada com sucesso',
          type: 'success',
        });
        console.log(data);
        navigate(path.minhasSolicitacoes);
    }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      showAlert({ message: 'Erro ao enviar solicitação' });
    }
  };

  return (
    <Container>
      <div className=' confirmacao-solict-container 
 page'>
        <h3>Confirma os dados da solicitação?</h3>

        <div className='resumo-solicitacao'>
          <p>
            <strong>Interessado:</strong> {dados.interessado?.nome} —{' '}
            <strong>CPF:</strong> {dados.interessado?.cpf}
          </p>
          <p>
            <strong>Motorista:</strong> {dados.motoristaSolicitado}
          </p>
          <p>
            <strong>Tipo de Veículo:</strong> {dados.tipoVeiculo}
          </p>
          <p>
            <strong>Tipo de Viagem:</strong> {dados.tipoViagem}
          </p>
          <p>
            <strong>Motivo da Viagem:</strong> {dados.motivoViagem}
          </p>
          <p>
            <strong>Saída:</strong> {dados.dataPartida} — {dados.horaPartida}
          </p>
          <p>
            <strong>Chegada:</strong> {dados.dataChegada} — {dados.horaChegada}
          </p>
          <p>
            <strong>Unidade:</strong> {pontos[0]?.unidadeId}
          </p>
          <p>
            <strong>Município:</strong> {pontos[pontos.length - 1]?.municipio}
          </p>
        </div>

        <div className='resumo-rota'>
          <h4>Rota</h4>
          <div className='rota-linha'>
            {pontos.map((ponto, idx) => (
              <React.Fragment key={idx}>
                <div className='ponto-rota'>
                  <div className='ponto-bolinha' />
                  <span>{ponto.nomeLocal}</span>
                </div>
                {idx < pontos.length - 1 && <div className='ponto-seta'>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className='confirmacao-botoes'>
          <button className='perigo' onClick={onBack}>
            Não
          </button>
          <button className='primario' onClick={handleConfirmar}>
            Sim
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ConfirmacaoFinal;
