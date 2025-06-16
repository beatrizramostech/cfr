import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
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
  getUsuario: async () => {
    const res = await api.get('/usuarios');
    return res.data;
  },
  getViagens: async (pagina = 1, quantidade = 20) => {
    const res = await api.get(
      `/viagens/buscar?pagina=${pagina}&quantidade=${quantidade}`
    );
    return res.data;
  },
  getViagensPorId: async (id) => {
    const res = await api.get(`/viagens/${id}`);
    return res.data;
  },
  getSolicitacoes: async (pagina = 1, quantidade = 20) => {
    const res = await api.get(
      `/solicitacoes/buscar?pagina=${pagina}&quantidade=${quantidade}`
    );
    return res.data;
  },
  getSolicitacaoPorId: async (id) => {
    const res = await api.get(`/solicitacoes/${id}`);
    return res.data;
  },
  marcarChegada: async (pontoId) => {
    const res = await api.post(`/pontosrota/${pontoId}/conclusao`);
    return res.data;
  },
  cancelarRota: async (pontoId, resposta) => {
    const res = await api.post(
      `/pontosrota/${pontoId}/cancelamento`,
      JSON.stringify(resposta),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  },
  iniciarViagem: async (viagemId) => {
    const res = await api.post(`/viagens/${viagemId}/inicio`);
    return res.data;
  },

  concluirViagem: async (viagemId) => {
    const res = await api.post(`/viagens/${viagemId}/conclusao`);
    return res.data;
  },
  cancelarViagem: async (viagemId, resposta) => {
    const res = await api.post(
      `/viagens/${viagemId}/cancelamento`,
      JSON.stringify(resposta),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  },
  enviarChecklist: async (formData, viagemId) => {
    const res = await api.post(`/viagens/${viagemId}/checklist`, formData);
    return res;
  },
  enviarRespostaPendencia: async (formData, pendenciaId) => {
    const res = await api.post(`/pendencias/${pendenciaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  },
  criarSolicitacao: async (dados) => {
    const res = await api.post('/solicitacoes', dados);
    return res;
  },
  getUnidades: async () => {
    const res = await api.get('/unidades');
    return res.data;
  },
};
