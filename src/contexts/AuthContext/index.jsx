import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { api, apiService } from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState();

  const { VITE_CLIENT_ID, VITE_URI_AC, VITE_APP_NAME_TOKEN } = import.meta.env;

  const scopes = useMemo(
    () => [
      'cpf',
      'openid',
      'profile',
      'email',
      'ApiAcessoCidadao',
      'api-acessocidadao-cpf',
      'api-acessocidadao-base',
      'api-sistemateste',
    ],
    []
  );

  const generateRandomNonce = (length) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  };

  const loginAC = useCallback(() => {
    const authUrl =
      'https://acessocidadao.es.gov.br/is/connect/authorize?' +
      `response_type=code%20id_token&client_id=${VITE_CLIENT_ID}&` +
      `scope=${scopes.join('%20')}&redirect_uri=${encodeURIComponent(
        VITE_URI_AC
      )}&` +
      `nonce=${generateRandomNonce(26)}&response_mode=form_post`;

    window.location.href = authUrl;
  }, [VITE_CLIENT_ID, VITE_URI_AC, scopes]);

  // ⏱ Checagem e renovação do token a cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token || localStorage.getItem(VITE_APP_NAME_TOKEN)) {
        const tempoRestante = calcularTempoRestanteParaExpiracao();
        if (tempoRestante <= 3 * 60 * 1000) {
          renovarToken();
        }
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const localToken = localStorage.getItem(VITE_APP_NAME_TOKEN);

    if (tokenFromUrl) {
      localStorage.setItem(VITE_APP_NAME_TOKEN, tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (localToken) {
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        try {
          const res = apiService.getUsuario();
          res.then((data) => {
            setUsuario(data);
          });
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
      } catch (err) {
        console.error('Token inválido:', err);
        logout();
      }
    }
  }, [token]);

  const renovarToken = async () => {
    try {
      const response = await apiService.renovacao();
      if (response.status === 200) {
        const newToken = response.data.token;
        localStorage.setItem(VITE_APP_NAME_TOKEN, newToken);
        setToken(newToken);
      }
    } catch (err) {
      console.error('Erro ao renovar token:', err.response.data);
      loginAC();
    }
  };

  const logout = () => {
    localStorage.removeItem(VITE_APP_NAME_TOKEN);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const calcularTempoRestanteParaExpiracao = () => {
    const rawToken = localStorage.getItem(VITE_APP_NAME_TOKEN);
    if (!rawToken) return 0;
    const expiracaoToken = jwt_decode(rawToken).exp * 1000;
    return expiracaoToken - Date.now();
  };

  const login = async (cpf) => {
    try {
      const token = await apiService.login(cpf);
      localStorage.setItem(VITE_APP_NAME_TOKEN, token);

      const decoded = jwt_decode(token);
      setUser(decoded);
      return true;
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginAC, login, logout, usuario, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
