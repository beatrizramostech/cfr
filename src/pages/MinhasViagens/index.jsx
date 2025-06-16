import { useEffect, useState } from 'react';
import ViagemCard from '../../components/ViagemCard';
import '../../styles/MinhasViagens.css';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { apiService } from '../../services/api';
import SubHeader from '../../components/SubHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { path } from '../../utils/pathBuilder';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io';

const MinhasViagens = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [viagens, setViagens] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtro, setFiltro] = useState('Todas');
  const [ordenarPor, setOrdenarPor] = useState(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);

  const QUANTIDADE_POR_PAGINA = 20;

  const fetchViagens = async (pagina = 1) => {
    try {
      const response = await apiService.getViagens(
        pagina,
        QUANTIDADE_POR_PAGINA
      );
      setViagens(response.dados);
      setPaginaAtual(response.pagina);
      setTotalPaginas(response.totalPaginas);
    } catch (error) {
      showAlert({ message: 'Erro ao buscar viagens' });
      console.error(error);
    }
  };

  useEffect(() => {
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
      if (filtro === 'Concluídas')
        return v.status.toLowerCase() === 'concluída';
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
    (v) => v.status.toLowerCase() === 'iniciada'
  );

  const viagensFiltradasMobile = viagens.filter((v) => {
    const hoje = new Date().toLocaleDateString();
    const data = new Date(v.dataPartida).toLocaleDateString();
    if (filtro === 'Dia') return data === hoje;
    if (filtro === 'Concluídas') return v.status.toLowerCase() === 'concluída';
    return true;
  });

  const handleClick = (id) => {
    navigate(path.detalhesViagem(id));
  };

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      fetchViagens(novaPagina);
    }
  };

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    fetchViagens(1);
  };

  return (
    <>
      <Header />
      <SubHeader onBack={() => window.history.back()} userName={user.nome} />
      <Container>
        <div className="page">
          <h2>Minhas Viagens</h2>

          {viagemAtual && (
            <>
              <p className="aviso">
                Atenção! Você tem viagens em andamento. Certifique-se de
                encerrá-las após sua conclusão.
              </p>
              <ViagemCard viagem={viagemAtual} isDestaque />
            </>
          )}

          <div className="filtros-mobile">
            {['Todas', 'Dia', 'Concluídas'].map((f) => (
              <button
                key={f}
                onClick={() => handleFiltro(f)}
                className={filtro === f ? 'ativo' : ''}
              >
                {f}
              </button>
            ))}
          </div>

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

              {totalPaginas > 1 && (
                <div className="paginacao">
                  <button
                    onClick={() => mudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => mudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </section>

          <div className="lista-viagens-mobile">
            {viagensFiltradasMobile.map((viagem) => (
              <ViagemCard
                key={viagem.id}
                viagem={viagem}
                isDestaque={viagem.status === 'INICIADA'}
                categoria="viagem"
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MinhasViagens;
