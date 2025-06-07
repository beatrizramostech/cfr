// import { createContext, useContext } from 'react';
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { jwtDecode as jwt_decode } from 'jwt-decode';
// import { api, apiService } from '../services/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const { VITE_CLIENT_ID, VITE_URI_AC, VITE_APP_NAME_TOKEN } = import.meta.env;
//   const params = new URLSearchParams(window.location.search);
//   const [token, setToken] = useState(params.get('token'));
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return localStorage.getItem(VITE_APP_NAME_TOKEN);
//   });

//   if (token) localStorage.setItem(VITE_APP_NAME_TOKEN, token);

//   const scopes = useMemo(
//     () => [
//       'cpf',
//       'openid',
//       'profile',
//       'email',
//       'ApiAcessoCidadao',
//       'api-acessocidadao-cpf',
//       'api-acessocidadao-base',
//       'api-sistemateste',
//     ],
//     [],
//   );

//   function generateRandomNonce(length) {
//     const characters =
//       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let nonce = '';

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       nonce += characters.charAt(randomIndex);
//     }

//     return nonce;
//   }

//   const loginAC = useCallback(() => {
//     const link =
//       'https://acessocidadao.es.gov.br/is/connect/authorize?' +
//       'response_type=code%20id_token&' +
//       `client_id=${VITE_CLIENT_ID}&` +
//       `scope= ${scopes.join('%20')}&` +
//       `redirect_uri=${encodeURIComponent(VITE_URI_AC)}&` +
//       `nonce=${generateRandomNonce(26)}&` +
//       'response_mode=form_post';
//     window.location.href = link;
//     setIsAuthenticated(true);
//     // window.open(link, "_blank")
//   }, [scopes]);

//   useEffect(() => {
//     const intervalId = setInterval(async () => {
//       if (token || localStorage.getItem(VITE_APP_NAME_TOKEN)) {
//         const tempoRestante = await calcularTempoRestanteParaExpiracao();
//         const umMinutoEmMilissegundos = 60 * 1000;

//         if (tempoRestante <= umMinutoEmMilissegundos) {
//           // console.log("Falta um minuto para expirar o token!");

//           api
//             .post(`/auth/renovacao`)
//             .then((response) => {
//               if (response.status === 200) {
//                 setToken(response.data);
//                 localStorage.setItem(VITE_APP_NAME_TOKEN, response.data);
//                 // console.log("token renovado: ", response.data);
//               } else {
//                 console.log(response.data);
//               }
//             })
//             .catch((error) => {
//               // console.log("deu erro ao renovar");
//               console.error(error);
//               loginAC();
//             });
//         }
//       }
//     }, 1000); // roda a cada 1 segundos

//     return () => clearInterval(intervalId);
//   }, [token, loginAC]);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const tokenFromUrl = params.get('token');
//     const localToken = localStorage.getItem(VITE_APP_NAME_TOKEN);

//     if (tokenFromUrl) {
//       localStorage.setItem(VITE_APP_NAME_TOKEN, tokenFromUrl);
//       setToken(tokenFromUrl);
//       window.history.replaceState({}, document.title, window.location.pathname); // remove query param
//     } else if (localToken) {
//       setToken(localToken);
//     }
//   }, []);

//   function calcularTempoRestanteParaExpiracao() {
//     const expiracaoToken =
//       jwt_decode(localStorage.getItem(VITE_APP_NAME_TOKEN)).exp * 1000; // Tempo de expiração do token em milissegundos
//     const tempoAtual = Date.now(); // Tempo atual em milissegundos
//     return expiracaoToken - tempoAtual; // Tempo restante em milissegundos
//   }

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwt_decode(token);
//         setUser(decoded);
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         setIsAuthenticated(true);
//       } catch {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//       }
//     }
//   }, []);

//   //Login Sem AC
//   const login = async (cpf) => {
//     try {
//       const token = await apiService.login(cpf);
//       localStorage.setItem('token', token);

//       const decoded = jwt_decode(token);
//       setUser(decoded);
//       return true;
//     } catch (err) {
//       console.error('Erro ao fazer login:', err);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete api.defaults.headers.common['Authorization'];
//     setUser(null);
//   };
//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, loginAC, login, user, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { api, apiService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

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
    [],
  );

  const generateRandomNonce = (length) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  };

  const loginAC = useCallback(() => {
    const authUrl =
      'https://acessocidadao.es.gov.br/is/connect/authorize?' +
      `response_type=code%20id_token&client_id=${VITE_CLIENT_ID}&` +
      `scope=${scopes.join('%20')}&redirect_uri=${encodeURIComponent(
        VITE_URI_AC,
      )}&` +
      `nonce=${generateRandomNonce(26)}&response_mode=form_post`;

    window.location.href = authUrl;
  }, [VITE_CLIENT_ID, VITE_URI_AC, scopes]);

  const calcularTempoRestanteParaExpiracao = () => {
    const rawToken = localStorage.getItem(VITE_APP_NAME_TOKEN);
    if (!rawToken) return 0;
    const expiracaoToken = jwt_decode(rawToken).exp * 1000;
    return expiracaoToken - Date.now();
  };

  const renovarToken = async () => {
    try {
      const response = await apiService.post(`/auth/renovacao`);
      if (response.status === 200) {
        const newToken = response.data;
        localStorage.setItem(VITE_APP_NAME_TOKEN, newToken);
        setToken(newToken);
      }
    } catch (err) {
      console.error('Erro ao renovar token:', err);
      loginAC(); // força novo login
    }
  };

  const logout = () => {
    localStorage.removeItem(VITE_APP_NAME_TOKEN);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // ⏱ Checagem e renovação do token a cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token || localStorage.getItem(VITE_APP_NAME_TOKEN)) {
        const tempoRestante = calcularTempoRestanteParaExpiracao();
        if (tempoRestante <= 60 * 1000) {
          renovarToken();
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const localToken = localStorage.getItem(VITE_APP_NAME_TOKEN);

    if (tokenFromUrl) {
      localStorage.setItem(VITE_APP_NAME_TOKEN, tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname); // remove query param
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
      } catch (err) {
        console.error('Token inválido:', err);
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginAC, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
