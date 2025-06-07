import { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import Container from '../components/Container/Container';
import Card from '../components/Card/Card';
import Header from '../components/Header/Header';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const HomePage = () => {
  const { user } = useAuth();
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proximaViagem, setProximaViagem] = useState(null);
  const [viagensConfirmadas, setViagensConfirmadas] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(true);

  const [viagensHoje, setViagensHoje] = useState([]);

  useEffect(() => {
    const fetchViagens = async () => {
      try {
        const data = await apiService.getViagens();
        const confirmadas = data.dados.filter((v) => v.status === 'CONFIRMADA');
        setViagensConfirmadas(confirmadas);

        if (confirmadas.length === 0) {
          setViagens([]);
          setProximaViagem(null);
          setViagensHoje([]);
          return;
        }

        const agora = new Date();
        const hoje = agora.toISOString().split('T')[0]; // yyyy-mm-dd

        const viagensDeHoje = confirmadas.filter(
          (viagem) => viagem.dataPartida.split('T')[0] === hoje,
        );

        const viagemMaisProxima = confirmadas.reduce((maisProxima, atual) => {
          const dataHoraAtual = new Date(
            `${atual.dataPartida.split('T')[0]}T${atual.horaPartida}`,
          );

          if (!maisProxima) return atual;

          const dataHoraMaisProxima = new Date(
            `${maisProxima.dataPartida.split('T')[0]}T${
              maisProxima.horaPartida
            }`,
          );

          return Math.abs(dataHoraAtual - agora) <
            Math.abs(dataHoraMaisProxima - agora)
            ? atual
            : maisProxima;
        }, null);

        setViagens(data.dados);
        setProximaViagem(viagemMaisProxima);
        setViagensHoje(viagensDeHoje);
      } catch (err) {
        console.error('Erro ao buscar viagens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchViagens();
  }, []);

  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const data = await apiService.getSolicitacoes();
        setSolicitacoes(data.dados);
      } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
      } finally {
        setLoadingSolicitacoes(false);
      }
    };

    fetchSolicitacoes();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <div className='page'>
          {proximaViagem && (
            <section>
              <div className='greeting-container'>
                <h2>Olá, {user.cpf}!</h2>
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
            <Card title='Minhas Viagens' type='viagem'>
              <li>Visualizar detalhes da viagem</li>
              <li>Controlar o andamento da viagem</li>
              <li>Preencher checklist do veículo</li>
              <li>Registrar presença nos destinos</li>
              <li>Acompanhar e finalizar a experiência</li>
            </Card>
            {user.colaborador && (
              <>
                <Card title='Minhas Solicitações' type='solicitações'>
                  <li>Visualizar todas as solicitações</li>
                  <li>Consultar detalhes</li>
                  <li>Responder pendências</li>
                </Card>
                <Card title='Solicitar Viagem' type='nova solicitação' />
              </>
            )}
          </section>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
