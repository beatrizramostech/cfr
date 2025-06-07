const base = import.meta.env.VITE_NAME_APP;

export const path = {
  login: `/${base}`,
  home: `/${base}/home`,
  minhasViagens: `/${base}/minhas-viagens`,
  minhasSolicitacoes: `/${base}/minhas-solicitacoes`,
  novaSolicitacao: `/${base}/nova-solicitacao`,

  detalhesViagem: (id) => `/${base}/detalhes-viagem/${id}`,
  solicitacaoDetalhe: (id) => `/${base}/solicitacao-detalhe/${id}`,
};
