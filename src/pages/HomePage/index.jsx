import { useState, useEffect } from 'react';
import '../../styles/HomePage.css';
import Container from '../../components/Container/index.jsx';
import Card from '../../components/Card/index.jsx';
import Header from '../../components/Header/index.jsx';
import SubHeader from '../../components/SubHeader/index.jsx';
import { useAuth } from '../../contexts/AuthContext/index.jsx';
import { apiService } from '../../services/api.js';
import { formatDate } from '../../utils/formatDate.js';
import useWindowWidth from '../../components/NovaSolicitacao/resizeWidth.js';

const getViagemMaisProxima = (viagens, agora) => {
  const futuras = viagens.filter((v) => {
    const dataHora = new Date(
      `${v.dataPartida.split('T')[0]}T${v.horaPartida}`
    );
    return dataHora > agora;
  });

  if (futuras.length === 0) return null;

  return futuras.reduce((maisProxima, atual) => {
    const dataHoraAtual = new Date(
      `${atual.dataPartida.split('T')[0]}T${atual.horaPartida}`
    );
    const dataHoraMaisProxima = new Date(
      `${maisProxima.dataPartida.split('T')[0]}T${maisProxima.horaPartida}`
    );

    return dataHoraAtual < dataHoraMaisProxima ? atual : maisProxima;
  });
};

const getViagensDeHoje = (viagens, hoje) => {
  return viagens.filter((viagem) => viagem.dataPartida.split('T')[0] === hoje);
};

const HomePage = () => {
  const { user } = useAuth();
  const [viagens, setViagens] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [viagensHoje, setViagensHoje] = useState([]);
  const [proximaViagem, setProximaViagem] = useState(null);
  const [alertViagem, setAlertViagem] = useState(false);
  const [alertSolicitacao, setAlertSolicitacao] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [viagemResp, solicitacaoResp] = await Promise.all([
          apiService.getViagens(),
          apiService.getSolicitacoes(),
        ]);

        const agora = new Date();
        const hoje = agora.toISOString().split('T')[0];
        const viagensData = viagemResp.dados || [];
        const solicitacoesData = solicitacaoResp.dados || [];

        const confirmadas = viagensData.filter(
          (v) => v.status === 'CONFIRMADA'
        );
        const iniciadas = viagensData.some((v) => v.status === 'INICIADA');
        const pendentes = solicitacoesData.some((s) => s.status === 'PENDENTE');

        setViagens(viagensData);
        setSolicitacoes(solicitacoesData);
        setProximaViagem(getViagemMaisProxima(confirmadas, agora));
        setViagensHoje(getViagensDeHoje(confirmadas, hoje));
        setAlertViagem(iniciadas);
        setAlertSolicitacao(pendentes);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchDados();
  }, []);

  return (
    <>
      <Header />
      <SubHeader userName={user.nome} onBack={() => window.history.back()} />
      <Container>
        <div className="page">
          <div className="greeting-container">
            <h2>Olá, {user.nome}!</h2>
          </div>
          {proximaViagem && (
            <section>
              <div className="trip-info">
                <div>
                  <strong>Próxima viagem</strong>
                  <br />
                  {formatDate(proximaViagem.dataPartida)} às{' '}
                  {proximaViagem.horaPartida}
                </div>
                <div>
                  <strong>Destino:</strong> {proximaViagem.localDestino}
                  <br />
                  <strong>Município:</strong> {proximaViagem.municipioDestino}
                </div>
                <div>
                  <strong>Viagens hoje</strong>
                  <br />
                  {viagensHoje.length}
                </div>
              </div>
            </section>
          )}

          <section>
            <Card
              windowWidth={windowWidth}
              title="Minhas Viagens"
              type="viagem"
              status={alertViagem ? 'iniciada' : null}
            >
              <li>Visualizar detalhes da viagem</li>
              <li>Controlar o andamento da viagem</li>
              <li>Preencher checklist do veículo</li>
              <li>Registrar presença nos destinos</li>
              <li>Acompanhar e finalizar a experiência</li>
            </Card>

            {user.colaborador && (
              <>
                <Card
                  windowWidth={windowWidth}
                  title="Minhas Solicitações"
                  type="solicitações"
                  status={alertSolicitacao ? 'pendente' : null}
                >
                  <li>Visualizar todas as solicitações</li>
                  <li>Consultar detalhes</li>
                  <li>Responder pendências</li>
                </Card>

                <Card title="Solicitar Viagem" type="novasolicitação" />
              </>
            )}
          </section>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
