import './SubHeader.css';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const SubHeader = ({ userName, onBack }) => {
  const { logout } = useAuth();
  return (
    <div className='subheader'>
      <button className='subheader__back' onClick={onBack}>
        <FaLongArrowAltLeft />
        Voltar
      </button>
      <span className='subheader__username' onClick={logout}>
        <FaUser />
        {userName}
      </span>
    </div>
  );
};

export default SubHeader;
