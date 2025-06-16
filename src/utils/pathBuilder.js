const { VITE_NAME_APP } = import.meta.env;

export const path = {
  login: `/`,
  home: `/home`,
  minhasViagens: `/minhas-viagens`,
  minhasSolicitacoes: `/minhas-solicitacoes`,
  novaSolicitacao: `/nova-solicitacao`,

  detalhesViagem: (id) => `/detalhes-viagem/${id}`,
  solicitacaoDetalhe: (id) => `/solicitacao-detalhe/${id}`,
};
