import './SubHeader.css';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import useWindowWidth from '../NovaSolicitacao/resizeWidth';

const SubHeader = ({ userName, onBack }) => {
  const { logout, user } = useAuth();
  const width = useWindowWidth()
  return (
    <div className='subheader'>
      <div className="subheader-first">

      <button className='subheader__back' onClick={onBack}>
        <FaLongArrowAltLeft />
        Voltar
      </button>
      {user.motorista.toLowerCase() == 'sim' && 
      <><span className="tags">Home</span>
      <span className="tags">Viagens</span>
      <span className="tags">Solicitações</span>
      <span className="tags">Nova Solicitação</span></>}
      </div>
      <span className='subheader__username' onClick={logout}>
        <FaUser />
        {userName} {user? '(LogOut)':''}
      </span>
    </div>
  );
};

export default SubHeader;
