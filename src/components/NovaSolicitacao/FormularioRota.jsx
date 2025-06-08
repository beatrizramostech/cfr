import React, { useState } from 'react';
import './FormularioRota.css';
import Container from '../Container/Container';

const pontoInicial = {
  tipoPonto: '',
  unidadeId: '',
  nomeLocal: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: '',
  uf: '',
};

const FormularioRota = ({ pontos, setPontos, onNext, onBack }) => {
  const [pontoAtual, setPontoAtual] = useState(pontoInicial);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPontoAtual({ ...pontoAtual, [name]: value });
  };

  const adicionarPonto = () => {
    setPontos([...pontos, pontoAtual]);
    setPontoAtual(pontoInicial);
  };

  const removerPonto = (index) => {
    const novos = [...pontos];
    novos.splice(index, 1);
    setPontos(novos);
  };

  return (
    <Container>
      <div className='formulario-rota'>
        <h3>Rota</h3>

        <fieldset>
          <legend>Ponto da Rota</legend>
          <input
            name='tipoPonto'
            placeholder='Ponto da Rota'
            value={pontoAtual.tipoPonto}
            onChange={handleChange}
          />
          <input
            name='unidadeId'
            placeholder='Unidade'
            value={pontoAtual.unidadeId}
            onChange={handleChange}
          />
          <input
            name='nomeLocal'
            placeholder='Nome do Local'
            value={pontoAtual.nomeLocal}
            onChange={handleChange}
          />
          <input
            name='cep'
            placeholder='CEP'
            value={pontoAtual.cep}
            onChange={handleChange}
          />
          <input
            name='logradouro'
            placeholder='Logradouro'
            value={pontoAtual.logradouro}
            onChange={handleChange}
          />
          <input
            name='numero'
            placeholder='Número'
            value={pontoAtual.numero}
            onChange={handleChange}
          />
          <input
            name='complemento'
            placeholder='Complemento'
            value={pontoAtual.complemento}
            onChange={handleChange}
          />
          <input
            name='bairro'
            placeholder='Bairro'
            value={pontoAtual.bairro}
            onChange={handleChange}
          />
          <input
            name='municipio'
            placeholder='Município'
            value={pontoAtual.municipio}
            onChange={handleChange}
          />
          <input
            name='uf'
            placeholder='UF'
            value={pontoAtual.uf}
            onChange={handleChange}
          />
        </fieldset>

        <div className='formulario-botoes'>
          <button type='button' className='verde' onClick={adicionarPonto}>
            + Adicionar Ponto
          </button>
        </div>

        {pontos.map((p, index) => (
          <div key={index} className='ponto-listado'>
            <div className='ponto-cabecalho'>
              <strong>{p.tipoPonto}</strong> — {p.nomeLocal}
              <button className='perigo' onClick={() => removerPonto(index)}>
                Remover
              </button>
            </div>
          </div>
        ))}

        <div className='formulario-botoes'>
          <button className='perigo' onClick={onBack}>
            Voltar
          </button>
          <button className='primario' onClick={onNext}>
            Finalizar
          </button>
        </div>
      </div>
    </Container>
  );
};

export default FormularioRota;
