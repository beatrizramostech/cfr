import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { loginAC, isAuthenticated, login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { VITE_NAME_APP } = import.meta.env;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${VITE_NAME_APP}/home`);
    }
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await login(cpf);
    setLoading(false);

    if (success) {
      navigate('/home'); // ou outro path que quiser
    } else {
      setError('CPF inválido ou erro na autenticação');
    }
  };

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
        ou entre com seu cpf:
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Digite seu CPF'
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
