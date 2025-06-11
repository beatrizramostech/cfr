import { useEffect, useState } from 'react';
import ViagemCard from '../components/ViagemCard/ViagemCard';
import '../styles/MinhasViagens.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { apiService } from '../services/api';
import SubHeader from '../components/SubHeader/SubHeader';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { IoMdArrowDropupCircle } from 'react-icons/io';
import '../styles/SolicitacaoDetalhe.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { path } from '../utils/pathBuilder';

const MinhasSolicitacoes = () => {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);
  const [filtro, setFiltro] = useState('Todas');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const data = await apiService.getSolicitacoes();
        setSolicitacoes(data.dados);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSolicitacoes();
  }, []);

  const solicitacaoComPendencia = solicitacoes.find(
    (s) => s.status.toLowerCase() === 'em pendência',
  );
  const ordenarDados = (campo) => {
    if (ordenarPor === campo) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdemAscendente(true);
    }
  };

  const solicitacoesComFiltro = solicitacoes.sort((a, b) => {
    if (!ordenarPor) return 0;
    const valA = a[ordenarPor];
    const valB = b[ordenarPor];
    const comparador =
      typeof valA === 'string' ? valA.localeCompare(valB) : valA - valB;
    return ordemAscendente ? comparador : -comparador;
  });

  const handleClick = (id) => {
    navigate(path.solicitacaoDetalhe(id));
  };

  const solicitacoesFiltradas = solicitacoes.filter((v) => {
    if (filtro === 'Dia') return v.status.toLowerCase() === 'em pendência';
    if (filtro === 'Aprovadas') return v.status.toLowerCase() === 'aprovada';
    return true;
  });

  return (
    <>
      <Header />
      <SubHeader onBack={() => window.history.back()} userName={user.nome} />
      <Container>
        <div className='page'>
          <h2>Minhas Solicitações</h2>

          {solicitacaoComPendencia && (
            <>
              <p className='aviso'>
                Atenção! Você tem solicitações com pendência. Certifique-se de
                respondê-las para prosseguimento da análise.
              </p>
              <ViagemCard
                viagem={solicitacaoComPendencia}
                categoria={'solicitacao'}
                isDestaque
              />
            </>
          )}

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
                  {solicitacoesComFiltro.map((solct) => (
                    <tr key={solct.id} onClick={() => handleClick(solct.id)}>
                      <td>{solct.id}</td>
                      <td>
                        {new Date(solct.dataPartida).toLocaleDateString()}
                      </td>
                      <td>{solct.horaPartida}</td>
                      <td>{solct.localDestino}</td>
                      <td>{solct.municipioDestino}</td>
                      <td>{solct.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
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
              Em Pendência
            </button>
            <button
              onClick={() => setFiltro('Aprovadas')}
              className={filtro === 'Aprovadas' ? 'ativo' : ''}
            >
              Aprovadas
            </button>
          </div>
          <div className='lista-viagens-mobile'>
            {solicitacoesFiltradas.map((v) => (
              <ViagemCard
                categoria={'solicitacao'}
                key={v.id}
                viagem={v}
                isDestaque={v.status === 'EM PENDÊNCIA'}
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MinhasSolicitacoes;
