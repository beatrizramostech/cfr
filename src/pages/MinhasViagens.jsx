import { useEffect, useState } from 'react';
import ViagemCard from '../components/ViagemCard/ViagemCard';
import '../styles/MinhasViagens.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { apiService } from '../services/api';
import SubHeader from '../components/SubHeader/SubHeader';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { path } from '../utils/pathBuilder';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { IoMdArrowDropupCircle } from 'react-icons/io';

const MinhasViagens = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [viagens, setViagens] = useState([]);
  const [filtro, setFiltro] = useState('Todas');
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);

  useEffect(() => {
    const fetchViagens = async () => {
      try {
        const data = await apiService.getViagens();
        setViagens(data.dados);
      } catch (error) {
        showAlert({ message: 'Erro ao buscar viagens' });
        console.log(error);
      }
    };

    fetchViagens();
  }, []);

  const ordenarDados = (campo) => {
    if (ordenarPor === campo) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdemAscendente(true);
    }
  };

  const viagensFiltradasDesktop = viagens
    .filter((v) => {
      const hoje = new Date().toLocaleDateString();
      const data = new Date(v.dataPartida).toLocaleDateString();

      if (filtro === 'Dia') return data === hoje;
      if (filtro === 'Encerradas')
        return v.status.toLowerCase() === 'encerrada';
      return true;
    })
    .sort((a, b) => {
      if (!ordenarPor) return 0;
      const valA = a[ordenarPor];
      const valB = b[ordenarPor];
      const comparador =
        typeof valA === 'string' ? valA.localeCompare(valB) : valA - valB;
      return ordemAscendente ? comparador : -comparador;
    });

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
  const handleClick = (id) => {
    navigate(path.detalhesViagem(id));
  };
  return (
    <>
      <Header />
      <SubHeader onBack={() => window.history.back()} userName={user.nome} />
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

          <section>
            <div className='lista-viagens'>
              <table className='tabela-viagens'>
                <thead>
                  <tr>
                    <th onClick={() => ordenarDados('id')}>
                      <div>
                        OnBase ID
                        {ordenarPor === 'id' ? (
                          ordemAscendente ? (
                            <IoMdArrowDropdownCircle size={24} />
                          ) : (
                            <IoMdArrowDropupCircle size={24} />
                          )
                        ) : (
                          <IoMdArrowDropdownCircle size={24} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => ordenarDados('dataPartida')}>
                      <div>
                        Data
                        {ordenarPor === 'dataPartida' ? (
                          ordemAscendente ? (
                            <IoMdArrowDropdownCircle size={24} />
                          ) : (
                            <IoMdArrowDropupCircle size={24} />
                          )
                        ) : (
                          <IoMdArrowDropupCircle size={24} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => ordenarDados('horaPartida')}>
                      <div>
                        Horário
                        {ordenarPor === 'horaPartida' ? (
                          ordemAscendente ? (
                            <IoMdArrowDropdownCircle size={24} />
                          ) : (
                            <IoMdArrowDropupCircle size={24} />
                          )
                        ) : (
                          <IoMdArrowDropdownCircle size={24} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => ordenarDados('unidade')}>
                      <div>
                        Unidade
                        {ordenarPor === 'unidade' ? (
                          ordemAscendente ? (
                            <IoMdArrowDropdownCircle size={24} />
                          ) : (
                            <IoMdArrowDropupCircle size={24} />
                          )
                        ) : (
                          <IoMdArrowDropdownCircle size={24} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => ordenarDados('municipio')}>
                      <div>
                        Município
                        {ordenarPor === 'municipio' ? (
                          ordemAscendente ? (
                            <IoMdArrowDropdownCircle size={24} />
                          ) : (
                            <IoMdArrowDropupCircle size={24} />
                          )
                        ) : (
                          <IoMdArrowDropdownCircle size={24} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => ordenarDados('status')}>
                      <div>
                        Status
                        {ordenarPor === 'status' ? (
                          ordemAscendente ? (
                            <IoMdArrowDropdownCircle size={24} />
                          ) : (
                            <IoMdArrowDropupCircle size={24} />
                          )
                        ) : (
                          <IoMdArrowDropdownCircle size={24} />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {viagensFiltradasDesktop.map((viagem) => (
                    <tr key={viagem.id} onClick={() => handleClick(viagem.id)}>
                      <td>{viagem.id}</td>
                      <td>
                        {new Date(viagem.dataPartida).toLocaleDateString()}
                      </td>
                      <td>{viagem.horaPartida}</td>
                      <td>{viagem.localDestino}</td>
                      <td>{viagem.municipioDestino}</td>
                      <td>{viagem.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className='lista-viagens-mobile'>
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
