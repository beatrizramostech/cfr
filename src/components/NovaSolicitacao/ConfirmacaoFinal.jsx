import React from 'react';
import { apiService } from '../../services/api';
import './ConfirmacaoFinal.css';
import Container from '../Container/Container';

const ConfirmacaoFinal = ({ dados, pontos, onBack }) => {
  const handleConfirmar = async () => {
    const payload = {
      ...dados,
      pontosRota: pontos.map((ponto, idx) => ({
        ...ponto,
        ordem: idx,
      })),
    };

    try {
      await apiService.criarSolicitacao(payload);
      alert('Solicitação enviada com sucesso!');
      // redirecionar ou resetar o formulário
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação.');
    }
  };

  return (
    <Container>
      <div className='confirmacao-container'>
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
      </div>{' '}
    </Container>
  );
};

export default ConfirmacaoFinal;
