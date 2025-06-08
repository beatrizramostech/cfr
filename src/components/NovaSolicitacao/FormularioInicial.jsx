import React, { useState } from 'react';
import './FormularioInicial.css';
import Container from '../Container/Container';

const tiposVeiculo = [
  'CAMINHÃO',
  'CAMINHONETE',
  'CARRO',
  'FURGÃO',
  'MICROÔNIBUS',
  'ÔNIBUS',
  'PICKUP',
  'VAN',
];

const tiposViagem = [
  'BATE VOLTA',
  'DOBRADINHA',
  'IDA',
  'PERNOITE',
  'VIAGEM PROLONGADA',
];

const motivosViagem = [
  'ABASTECIMENTO',
  'BANCA EXAMINADORA',
  'DIVERSOS',
  'ENGENHARIA DE TRÂNSITO',
  'ENTREGA E RECOLHIMENTO DE MATERIAL',
  'EVENTO OFICIAL',
  'FISCALIZAÇÃO',
  'INVENTÁRIO PATRIMONIAL',
  'MANUTENÇÃO',
  'SERVIÇOS',
  'SUPORTE DE TI',
  'TRANSPORTE DE PESSOAL',
  'VISITA TÉCNICA',
  'VISTORIA DE CREDENCIADOS',
];

const FormularioInicial = ({ dados, onNext }) => {
  const [form, setForm] = useState({
    tipoSolicitacao: 'proprio',
    procurador: {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
    },
    interessado: {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      cnh: '',
      cnhCategoria: '',
      cnhOrgaoEmissor: '',
      cnhuf: '',
      cnhValidade: '',
    },
    tipoVeiculo: '',
    motoristaSolicitado: 'Não',
    tipoViagem: '',
    motivoViagem: '',
    dataPartida: '',
    horaPartida: '',
    dataChegada: '',
    horaChegada: '',
    observacao: '',
    ...dados,
  });

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;

    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <Container>
      <div className='page'>
        <form onSubmit={handleSubmit}>
          <h3>Nova Solicitação</h3>

          <div className='radio-grupo'>
            <label>
              <input
                type='radio'
                name='tipoSolicitacao'
                value='proprio'
                checked={form.tipoSolicitacao === 'proprio'}
                onChange={handleChange}
              />
              Solicitação para você
            </label>
            <label>
              <input
                type='radio'
                name='tipoSolicitacao'
                value='terceiro'
                checked={form.tipoSolicitacao === 'terceiro'}
                onChange={handleChange}
              />
              Solicitação para terceiro
            </label>
          </div>

          {form.tipoSolicitacao === 'terceiro' && (
            <fieldset>
              <legend>Procurador</legend>
              <input
                placeholder='Procurador'
                name='nome'
                value={form.procurador.nome}
                onChange={(e) => handleChange(e, 'procurador')}
              />
              <input
                placeholder='CPF'
                name='cpf'
                value={form.procurador.cpf}
                onChange={(e) => handleChange(e, 'procurador')}
              />
              <input
                placeholder='E-mail'
                name='email'
                value={form.procurador.email}
                onChange={(e) => handleChange(e, 'procurador')}
              />
              <input
                placeholder='Telefone'
                name='telefone'
                value={form.procurador.telefone}
                onChange={(e) => handleChange(e, 'procurador')}
              />
            </fieldset>
          )}

          <fieldset>
            <legend>Interessado</legend>
            <input
              placeholder='Nome'
              name='nome'
              value={form.interessado.nome}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='CPF'
              name='cpf'
              value={form.interessado.cpf}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='E-mail'
              name='email'
              value={form.interessado.email}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='Telefone'
              name='telefone'
              value={form.interessado.telefone}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='CNH'
              name='cnh'
              value={form.interessado.cnh}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='Categoria'
              name='cnhCategoria'
              value={form.interessado.cnhCategoria}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='Validade'
              type='date'
              name='cnhValidade'
              value={form.interessado.cnhValidade}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='Órgão Emissor'
              name='cnhOrgaoEmissor'
              value={form.interessado.cnhOrgaoEmissor}
              onChange={(e) => handleChange(e, 'interessado')}
            />
            <input
              placeholder='UF'
              name='cnhuf'
              value={form.interessado.cnhuf}
              onChange={(e) => handleChange(e, 'interessado')}
            />
          </fieldset>

          <fieldset>
            <legend>Informações da Solicitação</legend>

            <select
              name='tipoVeiculo'
              value={form.tipoVeiculo}
              onChange={handleChange}
              required
            >
              <option value=''>Tipo de Veículo</option>
              {tiposVeiculo.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <select
              name='motoristaSolicitado'
              value={form.motoristaSolicitado}
              onChange={handleChange}
            >
              <option>Sim</option>
              <option>Não</option>
            </select>

            <select
              name='tipoViagem'
              value={form.tipoViagem}
              onChange={handleChange}
              required
            >
              <option value=''>Tipo de Viagem</option>
              {tiposViagem.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>

            <select
              name='motivoViagem'
              value={form.motivoViagem}
              onChange={handleChange}
              required
            >
              <option value=''>Motivo da Viagem</option>
              {motivosViagem.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
            <input
              type='date'
              name='dataPartida'
              value={form.dataPartida}
              onChange={handleChange}
            />
            <input
              type='time'
              name='horaPartida'
              value={form.horaPartida}
              onChange={handleChange}
            />
            <input
              type='date'
              name='dataChegada'
              value={form.dataChegada}
              onChange={handleChange}
            />
            <input
              type='time'
              name='horaChegada'
              value={form.horaChegada}
              onChange={handleChange}
            />
            <textarea
              placeholder='Observação'
              name='observacao'
              value={form.observacao}
              onChange={handleChange}
            />
          </fieldset>

          <div className='formulario-botoes'>
            <button type='submit' className='primario'>
              Próximo
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default FormularioInicial;
