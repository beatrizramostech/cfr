import React, { useState } from 'react';
import './ModalChecklist.css';
import AvariaItem from '../AvariaItem/AvariaItem';
import { apiService } from '../../services/api';
import { useAlert } from '../../contexts/AlertContext';

const ModalChecklist = ({ viagem, user, onClose }) => {
  const [combustivel, setCombustivel] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [observacao, setObservacao] = useState('');
  const [avarias, setAvarias] = useState([]);
  const [fotos, setFotos] = useState([]);
  const { showAlert } = useAlert();

  const adicionarAvaria = () => {
    setAvarias([...avarias, { categoria: '', descricao: '' }]);
  };

  const removerAvaria = (index) => {
    const novas = [...avarias];
    novas.splice(index, 1);
    setAvarias(novas);
  };

  const atualizarAvaria = (index, campo, valor) => {
    const novas = [...avarias];
    novas[index][campo] = valor;
    setAvarias(novas);
  };

  const handleUpload = (e) => {
    setFotos([...fotos, ...Array.from(e.target.files)]);
  };

  const removerArquivo = (i) => {
    const novos = [...fotos];
    novos.splice(i, 1);
    setFotos(novos);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (!combustivel || !quilometragem) {
      showAlert({
        message: 'Combustível e quilometragem são obrigatórios.',
        type: 'error',
      });
      return;
    }
    fotos.forEach((file) => formData.append('arquivos', file));
    if (fotos.length == 0) formData.append('arquivos', JSON.stringify(fotos));
    formData.append('combustivel', combustivel);
    formData.append('observacao', observacao);
    formData.append('quilometragem', parseInt(quilometragem));
    formData.append('responsavelCpf', user.cpf);
    formData.append(
      'responsavelId',
      viagem.motorista?.id || viagem.colaborador?.id
    );
    formData.append('solicitanteId', viagem.colaborador?.id || '');
    formData.append(
      'tipo',
      viagem.status.toLowerCase() === 'iniciada' ? 'DEVOLUÇÃO' : 'RETIRADA'
    );
    formData.append('avarias', JSON.stringify(avarias));
    

    try {
      await apiService.enviarChecklist(formData, viagem.id);
      showAlert({
        message: 'Checklist enviado com sucesso.',
        type: 'success',
      });
      onClose();
    } catch (err) {
      const res = err.response?.data || 'Erro ao enviar checklist.';
      showAlert({
        message: res,
        type: 'error',
      });
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Checklist</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-grid">
          <label>
            Data
            <input
              type="date"
              disabled
              className="disabled-input"
              value={new Date().toISOString().split('T')[0]}
            />
          </label>
          <label htmlFor="">
            Hora
            <input
              type="time"
              disabled
              className="disabled-input"
              value={new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          </label>
          <label htmlFor="">
            Combustível *
            <input
              placeholder="Combustível"
              value={combustivel}
              onChange={(e) => setCombustivel(e.target.value)}
              required
            />
          </label>
          <label htmlFor="">
            Quilometragem *
            <input
              placeholder="Quilometragem"
              value={quilometragem}
              onChange={(e) => setQuilometragem(e.target.value)}
              required
            />
          </label>
          <textarea
            placeholder="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <div className="avarias-section">
          <div className="avarias-header">
            <strong>Avarias</strong>
            <button className="secundario" onClick={adicionarAvaria}>
              + Adicionar
            </button>
          </div>
          {avarias.map((item, i) => (
            <AvariaItem
              key={i}
              index={i}
              data={item}
              onChange={atualizarAvaria}
              onRemove={removerAvaria}
            />
          ))}
        </div>

        <div className="upload-section">
          <input
            type="file"
            id="upload-arquivos"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />

          <label htmlFor="upload-arquivos" className="upload-botao">
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

        <div className="modal-buttons">
          <button className="primario" onClick={handleSubmit}>
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChecklist;
