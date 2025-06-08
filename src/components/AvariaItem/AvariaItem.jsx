import React from 'react';
import '../ModalChecklist/ModalChecklist.css';

const AvariaItem = ({ index, data, onChange, onRemove }) => {
  return (
    <div className='avaria-item'>
      <input
        placeholder='Categoria'
        value={data.categoria}
        onChange={(e) => onChange(index, 'categoria', e.target.value)}
      />
      <input
        placeholder='Descrição'
        value={data.descricao}
        onChange={(e) => onChange(index, 'descricao', e.target.value)}
      />
      <button className='remover-avaria' onClick={() => onRemove(index)}>
        Remover
      </button>
    </div>
  );
};

export default AvariaItem;
