import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { apiService } from '../../services/api';
import { useAlert } from '../../contexts/AlertContext';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/pathBuilder';

const ModalCancelamentoViagem = ({ onClose, pontoID, viagemId, opcao }) => {
  const [resposta, setResposta] = useState('');
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleCancelarViagem = async () => {
    try {
      const res = await apiService.cancelarViagem(viagemId, resposta);
      showAlert({ message: res.message, type: 'success' });
      onClose();
      navigate(path.detalhesViagem(viagemId));
    } catch (error) {
      showAlert({ message: 'Erro ao cancelar a viagem' });
      console.error('Erro ao cancelar viagem:', error);
    }
  };

  const handleCancelarRota = async () => {
    try {
      const res = await apiService.cancelarRota(pontoID, resposta);
      showAlert({ message: res.message, type: 'success' });
      navigate(path.detalhesViagem(viagemId));
      onClose();
    } catch (error) {
      showAlert({ message: 'Erro ao cancelar a rota' });
      console.error('Erro ao cancelar rota:', error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Motivo de cancelamento</h2>
          <button className="close-button" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className="input-group full">
          <label>Motivo:</label>
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite o motivo para o cancelamento"
          />
        </div>

        <button
          className="primario resposta-form"
          onClick={
            opcao === 'viagem' ? handleCancelarViagem : handleCancelarRota
          }
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalCancelamentoViagem;
