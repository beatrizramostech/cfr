import React from 'react';
import './Card.css';
import { PiWarningCircleFill } from 'react-icons/pi';
import { PiCarProfile, PiFilesLight, PiFilePlus } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/pathBuilder';
import useWindowWidth from '../NovaSolicitacao/resizeWidth';

const Card = ({ title, children, type, status, windowWidth }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    switch (type) {
      case 'viagem':
        navigate(path.minhasViagens);
        break;
      case 'solicitações':
        navigate(path.minhasSolicitacoes);
        break;
      default:
        navigate(path.novaSolicitacao);
    }
  };

  const showAlerta = status === 'pendente' || status === 'iniciada';

  const getIcon = () => {
    if (type === 'viagem') return <PiCarProfile size={40} />;
    if (type === 'solicitações') return <PiFilesLight size={40} />;
    if (type === 'novasolicitação') return <PiFilePlus size={40} />;
    return <PiFilePlus size={40} />;
  };

  const getAlertText = () => {
    if (status === 'iniciada') return 'Viagem Iniciada';
    if (status === 'em em pendência') return 'Pendência ativa';
    return '';
  };

  return (
    <div className={`card ${type}`} onClick={handleClick}>
      <div className="card__icon">{getIcon()}</div>
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <ul className="card__list">{children}</ul>
      </div>
      {showAlerta && (
        <div className="card__alert">
          <PiWarningCircleFill size={20} />
          {windowWidth > 768 && <span>{getAlertText()}</span>}
        </div>
      )}
    </div>
  );
};

export default Card;
