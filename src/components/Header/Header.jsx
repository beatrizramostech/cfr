import logoDetran from '../../assets/logoDetran.png';
import estadoSSP from '../../assets/estadoSSP.png';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        <img
          src={logoDetran}
          alt="Logo Detran"
          className="header__logo-detran"
        />

        <h1 className="header__title">CONTROLE DE FROTAS</h1>

        <img
          src={estadoSSP}
          alt="Logo Governo"
          className="header__logo-governo"
        />
      </div>
    </header>
  );
};

export default Header;
