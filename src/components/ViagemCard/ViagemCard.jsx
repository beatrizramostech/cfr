import React from 'react';
import './ViagemCard.css';
import { useNavigate } from 'react-router-dom';
import { PiWarningCircleFill, PiExport } from 'react-icons/pi';
import { path } from '../../utils/pathBuilder';

const ViagemCard = ({ viagem, isDestaque = false, categoria }) => {
  const navigate = useNavigate();
  const data = new Date(viagem.dataPartida);
  const dataFormatada = data.toLocaleDateString('pt-BR');

  const rota =
    categoria === 'solicitacao'
      ? path.solicitacaoDetalhe(viagem.id)
      : path.detalhesViagem(viagem.id);

  const showAlerta =
    viagem.status === 'INICIADA' || viagem.status === 'PENDENTE';

  return (
    <div
      className={`viagem-card ${isDestaque ? 'destaque' : ''}`}
      onClick={() => navigate(rota)}
    >
      <div className='viagem-content'>
        <div className='viagem-linha-principal'>
          <span className='viagem-id'>{viagem.onBaseID}</span>
          <PiExport size={18} className='export-icon' />
        </div>
        <div className='viagem-info'>
          <span>{`${dataFormatada} às ${viagem.horaPartida}`}</span>
          <span>{viagem.municipioDestino}</span>
        </div>
        <div className='viagem-status'>
          {showAlerta && <PiWarningCircleFill size={16} color='#f5c400' />}
          <span
            className={`status-label status-${viagem.status.toLowerCase()}`}
          >
            {viagem.status}
          </span>
        </div>
      </div>

      <div className='viagem-tabela'>
        <span>{viagem.onBaseID}</span>
        <span>{dataFormatada}</span>
        <span>{viagem.horaPartida}</span>
        <span>{viagem.unidade}</span>
        <span>{viagem.municipioDestino}</span>
        <span className={`status-label status-${viagem.status.toLowerCase()}`}>
          {showAlerta && <PiWarningCircleFill size={16} />} {viagem.status}
        </span>
      </div>
    </div>
  );
};

export default ViagemCard;
