import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/pathBuilder';

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path.login);
  };
  return (
    <div className='login-container'>
      <div className='conteudo-notfound'>
        <h2>404 - Página não encontrada</h2>
        <button className='secundario' onClick={handleClick}>
          Voltar ao login
        </button>
      </div>
    </div>
  );
};

export default NotFound;
