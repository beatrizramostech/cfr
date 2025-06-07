import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://localhost:7092',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  login: async (cpf) => {
    const res = await api.post('/auth/teste', `"${cpf}"`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data.token;
  },
  renovacao: async () => {
    const res = await api.post('/auth/renovacao', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  },
  getViagens: async () => {
    const res = await api.get('/viagens/buscar', {
      params: {
        pagina: 1,
        quantidade: 50,
      },
    });
    return res.data;
  },
  getViagensPorId: async (id) => {
    const res = await api.get(`/viagens/${id}`);
    return res.data;
  },
  getSolicitacoes: async () => {
    const res = await api.get('/solicitacoes/buscar', {
      params: {
        pagina: 1,
        quantidade: 50,
      },
    });
    return res.data;
  },
  getSolicitacaoPorId: async (id) => {
    const res = await api.get(`/solicitacoes/${id}`);
    return res.data;
  },
};
