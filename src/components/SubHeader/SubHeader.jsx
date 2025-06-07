import './SubHeader.css';
const SubHeader = ({ userName, onBack }) => {
  return (
    <div className='subheader'>
      <button className='subheader__back' onClick={onBack}>
        ⬅ Voltar
      </button>
      <span className='subheader__username'>{userName}</span>
    </div>
  );
};

export default SubHeader;
