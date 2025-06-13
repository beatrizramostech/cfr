import { useEffect, useState } from 'react';
import ViagemCard from '../components/ViagemCard/ViagemCard';
import '../styles/MinhasViagens.css';
import Container from '../components/Container/Container';
import Header from '../components/Header/Header';
import { apiService } from '../services/api';
import SubHeader from '../components/SubHeader/SubHeader';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io';
import '../styles/SolicitacaoDetalhe.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { path } from '../utils/pathBuilder';

const MinhasSolicitacoes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);
  const [filtro, setFiltro] = useState('Todas');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const QUANTIDADE_POR_PAGINA = 20;

  const fetchSolicitacoes = async (pagina = 1) => {
    try {
      const res = await apiService.getSolicitacoes(
        pagina,
        QUANTIDADE_POR_PAGINA
      );
      setSolicitacoes((prev) =>
        pagina === 1 ? res.dados : [...prev, ...res.dados]
      );

      setPaginaAtual(res.pagina);
      setTotalPaginas(res.totalPaginas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    fetchSolicitacoes(1);
  };

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      fetchSolicitacoes(novaPagina);
    }
  };

  const ordenarDados = (campo) => {
    if (ordenarPor === campo) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdemAscendente(true);
    }
  };

  const solicitacaoComPendencia = solicitacoes.find(
    (s) => s.status.toLowerCase() === 'em pendência'
  );

  const solicitacoesFiltradas = solicitacoes
    .filter((v) => {
      if (filtro === 'Dia') return v.status.toLowerCase() === 'em pendência';
      if (filtro === 'Aprovadas') return v.status.toLowerCase() === 'aprovada';
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

  const handleClick = (id) => {
    navigate(path.solicitacaoDetalhe(id));
  };

  return (
    <>
      <Header />
      <SubHeader onBack={() => window.history.back()} userName={user.nome} />
      <Container>
        <div className="page">
          <h2>Minhas Solicitações</h2>

          {solicitacaoComPendencia && (
            <>
              <p className="aviso">
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
            <div className="lista-viagens">
              <table className="tabela-viagens">
                <thead>
                  <tr>
                    {[
                      { campo: 'id', label: 'OnBase ID' },
                      { campo: 'dataPartida', label: 'Data' },
                      { campo: 'horaPartida', label: 'Horário' },
                      { campo: 'localDestino', label: 'Unidade' },
                      { campo: 'municipioDestino', label: 'Município' },
                      { campo: 'status', label: 'Status' },
                    ].map(({ campo, label }) => (
                      <th key={campo} onClick={() => ordenarDados(campo)}>
                        <div>
                          {label}
                          {ordenarPor === campo ? (
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
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesFiltradas.map((solct) => (
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

              {totalPaginas > 1 && (
                <div className="paginacao">
                  <button
                    className="secundario"
                    onClick={() => mudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    className="secundario"
                    onClick={() => mudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="filtros-mobile">
            <button
              onClick={() => handleFiltro('Todas')}
              className={filtro === 'Todas' ? 'ativo' : ''}
            >
              Todas
            </button>
            <button
              onClick={() => handleFiltro('Dia')}
              className={filtro === 'Dia' ? 'ativo' : ''}
            >
              Em Pendência
            </button>
            <button
              onClick={() => handleFiltro('Aprovadas')}
              className={filtro === 'Aprovadas' ? 'ativo' : ''}
            >
              Aprovadas
            </button>
          </div>

          <div className="lista-viagens-mobile">
            {solicitacoesFiltradas.map((v) => (
              <ViagemCard
                categoria={'solicitacao'}
                key={v.id}
                viagem={v}
                isDestaque={v.status === 'EM PENDÊNCIA'}
              />
            ))}

            {paginaAtual < totalPaginas && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  className="secundario"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MinhasSolicitacoes;
