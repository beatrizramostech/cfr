import React from 'react';
import './ViagemCard.css';
import { useNavigate } from 'react-router-dom';

const ViagemCard = ({ viagem, isDestaque = false, categoria }) => {
  const data = new Date(viagem.dataPartida);
  const dataFormatada = data.toLocaleDateString();
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(viagem.id);
    switch (categoria) {
      case 'solicitacao':
        navigate(`/solicitacoes/${viagem.id}`);
        break;
      case 'viagem':
        navigate(`/viagens/${viagem.id}`);
        break;
    }
  };

  return (
    <div
      className={`viagem-card ${isDestaque ? 'destaque' : ''}`}
      onClick={handleClick}
    >
      <div className='viagem-info'>
        <span className='viagem-id'>{viagem.onBaseID}</span>
        <span className='viagem-data'>
          {dataFormatada} às {viagem.horaPartida}
        </span>
        <span className='viagem-local'>{viagem.municipioDestino}</span>
      </div>
      <div className='viagem-status'>
        <span className={`status-label status-${viagem.status.toLowerCase()}`}>
          {viagem.status}
        </span>
      </div>
    </div>
  );
};

export default ViagemCard;
