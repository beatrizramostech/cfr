import React, { useState } from 'react';
import './index.css';
import { apiService } from '../../services/api.js';
import { useAlert } from '../../contexts/AlertContext/index.jsx'
import { formatDate } from '../../utils/formatDate.js';

const ModalPendencia = ({ solicitacao, onClose }) => {
  const [fotos, setFotos] = useState([]);
  const [resposta, setResposta] = useState('');
  const { showAlert } = useAlert();

  const formatarHoraMinuto = (dataIso, usarUtc = false) => {
    const data = new Date(dataIso);
    const horas = usarUtc ? data.getUTCHours() : data.getHours();
    const minutos = usarUtc ? data.getUTCMinutes() : data.getMinutes();
    return `${horas.toString().padStart(2, '0')}:${minutos
      .toString()
      .padStart(2, '0')}`;
  };
  const handleUpload = (e) => {
    setFotos([...fotos, ...Array.from(e.target.files)]);
  };
  const removerArquivo = (i) => {
    const novos = [...fotos];
    novos.splice(i, 1);
    setFotos(novos);
  };
  const { pendencia } = solicitacao;

  const handleSubmit = async () => {
    const formData = new FormData();
    fotos.forEach((file) => formData.append('arquivos', file));
    formData.append('resposta', resposta);
    try {
      const res = await apiService.enviarRespostaPendencia(
        formData,
        pendencia.id
      );
      showAlert({ message: res.data.message, type: 'success' });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Pendência</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="row">
          <div className="input-group">
            <label>Data do Registro</label>
            <input
              type="text"
              value={formatDate(pendencia?.dataHoraRegistro)}
              readOnly
            />
          </div>
          <div className="input-group">
            <label>Horário do Registro</label>
            <input
              type="text"
              value={formatarHoraMinuto(pendencia?.dataHoraRegistro)}
              readOnly
            />
          </div>
        </div>

        <div className="input-group full">
          <label>Motivo</label>
          <textarea value={pendencia?.descricao} readOnly />
        </div>

        <div className="input-group full">
          <label>Resposta</label>
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta..."
          />
        </div>

        <div className="upload-section resposta-form">
          <input
            type="file"
            id="upload-arquivos"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
            accept="image/*"
          />

          <label htmlFor="upload-arquivos" className="upload-botao ">
            Inserir Fotos
          </label>

          <div className="preview-list">
            {fotos.map((file, i) => (
              <div key={i} className="file-preview">
                <span>{file.name}</span>
                <button onClick={() => removerArquivo(i)}>🗑</button>
              </div>
            ))}
          </div>
        </div>
        <button className="primario resposta-form" onClick={handleSubmit}>
          Responder
        </button>
      </div>
    </div>
  );
};

export default ModalPendencia;
