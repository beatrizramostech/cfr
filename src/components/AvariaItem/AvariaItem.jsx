import React from 'react';
import '../ModalChecklist/ModalChecklist.css';

const AvariaItem = ({ index, data, onChange, onRemove }) => {
  return (
    <div className="avaria-item">
      <select
        value={data.categoria}
        onChange={(e) => onChange(index, 'categoria', e.target.value)}
      >
        <option value="">Selecione uma categoria</option>
        <option value="CARROCERIA E PINTURA">CARROCERIA E PINTURA</option>
        <option value="ILUMINAÇÃO E SINALIZAÇÃO">
          ILUMINAÇÃO E SINALIZAÇÃO
        </option>
        <option value="INTERIOR DO VEÍCULO">INTERIOR DO VEÍCULO</option>
        <option value="ITENS DE SEGURANÇA">ITENS DE SEGURANÇA</option>
        <option value="MECÂNICA E ELÉTRICA">MECÂNICA E ELÉTRICA</option>
        <option value="OUTROS/DIVERSOS">OUTROS/DIVERSOS</option>
        <option value="PNEUS E RODAS">PNEUS E RODAS</option>
        <option value="PORTAS E FECHADURAS">PORTAS E FECHADURAS</option>
        <option value="SISTEMA DE CLIMATIZAÇÃO">SISTEMA DE CLIMATIZAÇÃO</option>
        <option value="VIDROS E ESPELHOS">VIDROS E ESPELHOS</option>
      </select>

      <input
        placeholder="Descrição"
        value={data.descricao}
        onChange={(e) => onChange(index, 'descricao', e.target.value)}
      />

      <button className="remover-avaria" onClick={() => onRemove(index)}>
        Remover
      </button>
    </div>
  );
};

export default AvariaItem;
