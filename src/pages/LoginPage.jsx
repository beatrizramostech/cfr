import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { path } from '../utils/pathBuilder';

const LoginPage = () => {
  const { loginAC, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(path.home);
    }
  }, [isAuthenticated]);

  return (
    <div className='box-container'>
      <div className='dados'>
        <span className='title'>Você não está logado</span>
        <span className='subtitle'>
          Faça login com o Acesso Cidadão para continuar
        </span>
        <button className='button' onClick={loginAC}>
          Fazer login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
