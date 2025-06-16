import './index.css';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { TiThMenu } from 'react-icons/ti';
import useWindowWidth from '../NovaSolicitacao/resizeWidth';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/pathBuilder';
import { useState } from 'react';
const SubHeader = ({ userName, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { logout, user } = useAuth();
  const width = useWindowWidth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };
  return (
    <div className="subheader">
      <div className="subheader-first">
        {width > 768 && (
          <>
            <button className="subheader__back" onClick={onBack}>
              <FaLongArrowAltLeft />
              Voltar
            </button>
          </>
        )}
      </div>
      <div className="menu-container">
        {width <= 768 && (
          <div className="menu-hamburger" onClick={toggleMenu}>
            <TiThMenu size={24} />
          </div>
        )}
        {width <= 768 && menuOpen && (
          <>
            <div className="dropdown-menu">
              <span
                className="dropdown-item"
                onClick={() => handleNavigate(path.home)}
              >
                Home
              </span>

              {user.motorista.toLowerCase() === 'false' && (
                <div className="divider">
                  <span
                    className="dropdown-item"
                    onClick={() => handleNavigate(path.minhasViagens)}
                  >
                    Minhas Viagens
                  </span>
                  <span
                    className="dropdown-item"
                    onClick={() => handleNavigate(path.minhasSolicitacoes)}
                  >
                    Minhas Solicitações
                  </span>
                  <span
                    className="dropdown-item"
                    onClick={() => handleNavigate(path.novaSolicitacao)}
                  >
                    Nova Solicitação
                  </span>
                  <hr className="divider" />
                </div>
              )}
              <span className="dropdown-item" onClick={logout}>
                Sair
              </span>
            </div>
          </>
        )}
      </div>

      {width > 768 && (
        <span className="subheader__username" onClick={logout}>
          <FaUser />
          {userName} {user ? '(LogOut)' : ''}
        </span>
      )}
    </div>
  );
};

export default SubHeader;
