import React from 'react';
import './ModalPendencia.css';

const ModalPendencia = ({onClose}) => {
  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        <h2>Pendência</h2>
        <div className='row'>
          <div className='input-group'>
            <label>Data do Registro</label>
            <input type='text' value='03/05/2025' readOnly />
          </div>
          <div className='input-group'>
            <label>Horário do Registro</label>
            <input type='text' value='08:20' readOnly />
          </div>
        </div>

        <div className='input-group full'>
          <label>Motivo</label>
          <textarea value='Favor anexar a CNH frente e verso' readOnly />
        </div>

        <div className='input-group full'>
          <label>Resposta</label>
          <textarea placeholder='Digite sua resposta...' />
        </div>

        <div className='input-group full'>
          <label>Documentos</label>
          <div className='documentos-list'>
            <div className='documento'>
              <img src='/img-placeholder.png' alt='doc' />
              <button className='delete-btn'>🗑️</button>
            </div>
            <div className='documento'>
              <img src='/img-placeholder.png' alt='doc' />
              <button className='delete-btn'>🗑️</button>
            </div>
            <div className='documento'>
              <img src='/img-placeholder.png' alt='doc' />
              <button className='delete-btn'>🗑️</button>
            </div>
          </div>
        </div>

        <div className='buttons'>
          <label className='upload-btn'>
            📎 Inserir Arquivos
            <input type='file' multiple hidden />
          </label>
          <button className='responder-btn'>Responder</button>
        </div>

        <button className='close-btn' onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalPendencia;
