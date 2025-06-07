import { useEffect, useState } from 'react';
import ViagemCard from '../components/ViagemCard/ViagemCard';
import '../styles/MinhasViagens.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { apiService } from '../services/api';

const MinhasViagens = () => {
  const [viagens, setViagens] = useState([]);
  const [filtro, setFiltro] = useState('Todas');

  useEffect(() => {
    const fetchViagens = async () => {
      try {
        const data = await apiService.getViagens();
        setViagens(data.dados);
      } catch (error) {
        console.log('Erro ao buscar viagens', error);
      }
    };

    fetchViagens();
  }, []);

  const viagemAtual = viagens.find(
    (v) => v.status.toLowerCase() === 'iniciada',
  );
  const viagensFiltradas = viagens.filter((v) => {
    const hoje = new Date().toLocaleDateString();
    const data = new Date(v.dataPartida).toLocaleDateString();

    if (filtro === 'Dia') return data === hoje;
    if (filtro === 'Encerradas') return v.status.toLowerCase() === 'encerrada';
    return true;
  });

  return (
    <>
      <Header />
      <Container>
        <div className='minhas-viagens-container'>
          <h2>Minhas Viagens</h2>

          {viagemAtual && (
            <>
              <p className='aviso'>
                Atenção! Você tem viagens em andamento. Certifique-se de
                encerrá-las após sua conclusão.
              </p>
              <ViagemCard viagem={viagemAtual} isDestaque />
            </>
          )}

          <div className='filtros-mobile'>
            <button
              onClick={() => setFiltro('Todas')}
              className={filtro === 'Todas' ? 'ativo' : ''}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('Dia')}
              className={filtro === 'Dia' ? 'ativo' : ''}
            >
              Dia
            </button>
            <button
              onClick={() => setFiltro('Encerradas')}
              className={filtro === 'Encerradas' ? 'ativo' : ''}
            >
              Encerradas
            </button>
          </div>

          <div className='lista-viagens'>
            {viagensFiltradas.map((viagem) => (
              <ViagemCard
                key={viagem.id}
                viagem={viagem}
                isDestaque={viagem.status === 'INICIADA'}
                categoria='viagem'
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MinhasViagens;
