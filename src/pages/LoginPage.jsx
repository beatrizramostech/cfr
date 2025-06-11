import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { path } from '../utils/pathBuilder';
import '../styles/LoginPage.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import SubHeader from '../components/SubHeader/SubHeader';

const LoginPage = () => {
  const { loginAC, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(path.home);
    }
  }, [isAuthenticated]);

  return (
    <div className='login-container'>
      <Header />
      <div className='dados-container'>
        <div className='dados'>
          <span className='login-title'>Você não está logado!</span>
          <span className='subtitle'>
            Faça login com o Acesso Cidadão para continuar
          </span>
          <button className='button secundario' onClick={loginAC}>
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
