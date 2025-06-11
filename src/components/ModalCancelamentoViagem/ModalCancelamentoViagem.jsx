import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { apiService } from '../../services/api';
import { useAlert } from '../../contexts/AlertContext';

const ModalCancelamentoViagem = ({ onClose, id }) => {
  const [resposta, setResposta] = useState('');
  const { showAlert } = useAlert();

  const handleCancelarViagem = async () => {
    console.log(JSON.stringify(resposta));
    try {
      const res = await apiService.cancelarViagem(id, resposta);
      showAlert({ message: res.message, type: 'success' });
      onClose();
    } catch (error) {
      showAlert({ message: 'Erro ao cancelar a viagem' });
      console.error('Erro ao cancelar viagem:', error);
    }
  };

  return (
    <div className='modal-backdrop'>
      <div className='modal'>
        <div className='modal-header'>
          <h2>Motivo de cancelamento de viagem</h2>
          <button className='close-button' onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className='input-group full'>
          <label>Motivo:</label>
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder='Digite o motivo para o cancelamento da viagem'
          />
        </div>

        <button
          className='primario resposta-form'
          onClick={handleCancelarViagem}
        >
          Cancelar Viagem
        </button>
      </div>
    </div>
  );
};

export default ModalCancelamentoViagem;
