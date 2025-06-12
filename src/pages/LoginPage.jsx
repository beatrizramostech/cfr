import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { path } from '../utils/pathBuilder';
import '../styles/LoginPage.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import SubHeader from '../components/SubHeader/SubHeader';

const LoginPage = () => {
  const { loginAC, isAuthenticated, login, } = useAuth();
  const [cpf, setCpf] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(path.home);
    }
  }, [isAuthenticated]);
  const handleSubmit = (e) => {
    e.preventDefault()
    try{
      login(cpf);
      navigate(path.home);
    }catch(error){
      console.error('Erro ao fazer login:', error);
    }
  }
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

          <span className="subtitle">ou digite o seu cpf:</span>
          <form onSubmit={e=>handleSubmit(e)}>
          <input
            type='text'
            className='input-cpf'
            placeholder='Digite seu CPF'
            onChange={(e)=>setCpf(e.target.value)}
            value={cpf}
          />
          <button
            className='button primario'
            type='submit'
        
          >
            Login
          </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
