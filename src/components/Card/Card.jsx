import React from 'react';
import './Card.css';
import { PiCarProfile, PiFilesLight, PiFilePlus } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const Card = ({ title, children, type }) => {
  const navigate = useNavigate();
  const { VITE_NAME_APP } = import.meta.env;

  const handleClick = () => {
    switch (type) {
      case 'viagem':
        navigate(`/${VITE_NAME_APP}/minhas-viagens`);
        break;
      case 'solicitações':
        navigate(`/${VITE_NAME_APP}/minhas-solicitacoes`);
        break;
      default:
        navigate(`/${VITE_NAME_APP}/nova-solicitacao`);
    }
  };
  return (
    <div className={`card`} onClick={handleClick}>
      <div className='icon-card'>
        {type == 'viagem' && <PiCarProfile size={48} />}
        {type == 'solicitações' && <PiFilesLight size={48} />}
        {type == 'nova solicitação' && <PiFilePlus size={48} />}
      </div>
      <div className='card-content'>
        <div className='card-header'>
          <h3>{title}</h3>
        </div>
        {children && <ul className='card-body'>{children}</ul>}
      </div>
    </div>
  );
};

export default Card;
