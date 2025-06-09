import React, { useState } from 'react';
import './ModalChecklist.css';
import AvariaItem from '../AvariaItem/AvariaItem';
import { apiService } from '../../services/api';

const ModalChecklist = ({ viagem, user, onClose }) => {
  const [combustivel, setCombustivel] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [observacao, setObservacao] = useState('');
  const [avarias, setAvarias] = useState([]);
  const [fotos, setFotos] = useState([]);

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
    fotos.forEach((file) => formData.append('arquivos', file));
    formData.append('combustivel', combustivel);
    formData.append('observacao', observacao);
    formData.append('quilometragem', parseInt(quilometragem));
    formData.append('responsavelCpf', user.cpf);
    formData.append('responsavelId', user.id);
    formData.append('solicitanteId', viagem.colaborador?.id || '');
    formData.append('tipo', viagem.tipoVeiculo?.id);

    formData.append('avarias', JSON.stringify(avarias));

    try {
      await apiService.enviarChecklist(formData, viagem.id);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='modal-backdrop'>
      <div className='modal'>
        <div className='modal-header'>
          <h2>Checklist</h2>
          <button className='close-button' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='form-grid'>
          <input
            type='date'
            disabled
            value={new Date().toISOString().split('T')[0]}
          />
          <input
            type='time'
            disabled
            value={new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          <input
            placeholder='Combustível'
            value={combustivel}
            onChange={(e) => setCombustivel(e.target.value)}
            required
          />
          <input
            placeholder='Quilometragem'
            value={quilometragem}
            onChange={(e) => setQuilometragem(e.target.value)}
            required
          />
          <textarea
            placeholder='Observação'
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <div className='avarias-section'>
          <div className='avarias-header'>
            <strong>Avarias</strong>
            <button className='secundario' onClick={adicionarAvaria}>
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

        <div className='upload-section'>
          <input
            type='file'
            id='upload-arquivos'
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />

          <label htmlFor='upload-arquivos' className='upload-botao'>
            Inserir Fotos
          </label>

          <div className='preview-list'>
            {fotos.map((file, i) => (
              <div key={i} className='file-preview'>
                <span>{file.name}</span>
                <button onClick={() => removerArquivo(i)}>🗑</button>
              </div>
            ))}
          </div>
        </div>

        <div className='modal-buttons'>
          <button
            className='secundario'
            onClick={() => document.querySelector('input[type=file]').click()}
          >
            Inserir Fotos
          </button>
          <button className='primario' onClick={handleSubmit}>
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChecklist;
