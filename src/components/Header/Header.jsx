import React from 'react';
import logoDetran from '../../assets/logoDetran.png';
import './Header.css';
import estadoSSP from '../../assets/estadoSSP.png';

const Header = () => {
  return (
    <>
      <header className='header-container'>
        <div className='banner'>
          <div className='divLogoDetran'>
            <img className='logoDetran' src={logoDetran} alt='Logo Detran' />
          </div>
          <div className='divTituloPortal'>
            <span className='tituloPortal'>CONTROLE DE FROTAS</span>
          </div>
          <div className='divLogoGoverno'>
            <img
              className='logoGoverno'
              src={estadoSSP}
              alt='Brasão Governo do Estado Espírito Santo'
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
