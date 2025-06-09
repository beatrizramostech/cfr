import { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Container from '../components/Container/Container';
import Card from '../components/Card/Card';
import Header from '../components/Header/Header';
import SubHeader from '../components/SubHeader/SubHeader';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

const getViagemMaisProxima = (viagens, agora) => {
  return viagens.reduce((maisProxima, atual) => {
    const dataHoraAtual = new Date(
      `${atual.dataPartida.split('T')[0]}T${atual.horaPartida}`,
    );
    if (!maisProxima) return atual;

    const dataHoraMaisProxima = new Date(
      `${maisProxima.dataPartida.split('T')[0]}T${maisProxima.horaPartida}`,
    );

    return Math.abs(dataHoraAtual - agora) <
      Math.abs(dataHoraMaisProxima - agora)
      ? atual
      : maisProxima;
  }, null);
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
          (v) => v.status === 'CONFIRMADA',
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
        <div className='page'>
          {proximaViagem && (
            <section>
              <div className='greeting-container'>
                <h2>Olá, {user.nome}!</h2>
              </div>
              <div className='trip-info'>
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
              title='Minhas Viagens'
              type='viagem'
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
                  title='Minhas Solicitações'
                  type='solicitações'
                  status={alertSolicitacao ? 'pendente' : null}
                >
                  <li>Visualizar todas as solicitações</li>
                  <li>Consultar detalhes</li>
                  <li>Responder pendências</li>
                </Card>

                <Card title='Solicitar Viagem' type='novasolicitação' />
              </>
            )}
          </section>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
