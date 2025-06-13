import React, { useEffect, useState } from 'react';
import './FormularioRota.css';
import Container from '../Container/Container';
import { apiService } from '../../services/api';
import { validarTipoViagem } from './schemaFormularioInicial';
import { useAlert } from '../../contexts/AlertContext';

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

const FormularioRota = ({
  pontos,
  setPontos,
  setStep,
  dadosSolicitacao,
  onBack,
}) => {
  const { showAlert } = useAlert();
  const [pontoAtual, setPontoAtual] = useState(pontoInicial);
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    const loadUnidades = async () => {
      try {
        const res = await apiService.getUnidades();
        setUnidades(res || []);
      } catch (err) {
        console.error('Erro ao carregar unidades:', err);
      }
    };
    loadUnidades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'unidadeId') {
      const unidadeSelecionada = unidades.find((u) => String(u.id) === value);
      if (unidadeSelecionada) {
        setPontoAtual({
          ...pontoAtual,
          unidadeId: unidadeSelecionada.id,
          nomeLocal: unidadeSelecionada.nome,
          cep: unidadeSelecionada.cep,
          logradouro: unidadeSelecionada.logradouro,
          numero: unidadeSelecionada.numero,
          complemento: unidadeSelecionada.complemento || '',
          bairro: unidadeSelecionada.bairro,
          municipio: unidadeSelecionada.municipio,
          uf: unidadeSelecionada.uf,
        });
      } else {
        setPontoAtual({
          ...pontoAtual,
          unidadeId: value,
          nomeLocal: value,
          cep: value,
          logradouro: value,
          numero: value,
          complemento: value,
          bairro: value,
          municipio: value,
          uf: value,
        });
      }
    } else {
      setPontoAtual({ ...pontoAtual, [name]: value });
    }
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

  const onNext = () => {
    const erroTipoViagem = validarTipoViagem(dadosSolicitacao, pontos || []);
    if (erroTipoViagem) {
      showAlert({ type: 'error', message: erroTipoViagem });
      throw new Error({ message: erroTipoViagem });
    }
    setStep(3);
  };
  return (
    <Container>
      <div className="formulario-rota page">
        <h3>Rota</h3>

        <fieldset>
          <legend>Ponto da Rota</legend>
          <select
            name="tipoPonto"
            value={pontoAtual.tipoPonto}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecione o tipo de ponto
            </option>
           
            {pontos.length < 1 && <option value="Origem">Origem</option>}
            {pontos.length > 0 &&
              pontos.every((ponto) => ponto.tipoPonto !== 'Destino') && (
                <option value="Intermediario">Intermediário</option>
              )}

            {pontos.length > 0 &&
              pontos.every((p) => p.tipoPonto !== 'Destino') && (
                <option value="Destino">Destino</option>
              )}
          </select>

          <select
            name="unidadeId"
            value={pontoAtual.unidadeId}
            onChange={handleChange}
            required
            disabled={!pontoAtual.tipoPonto}
          >
            <option value="">Selecione a Unidade</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>

          <input
            name="nomeLocal"
            placeholder="Nome do Local"
            value={pontoAtual.nomeLocal}
            onChange={handleChange}
          />
          <input
            name="cep"
            placeholder="CEP"
            value={pontoAtual.cep}
            onChange={handleChange}
          />
          <input
            name="logradouro"
            placeholder="Logradouro"
            value={pontoAtual.logradouro}
            onChange={handleChange}
          />
          <input
            name="numero"
            placeholder="Número"
            value={pontoAtual.numero}
            onChange={handleChange}
          />
          <input
            name="complemento"
            placeholder="Complemento"
            value={pontoAtual.complemento}
            onChange={handleChange}
          />
          <input
            name="bairro"
            placeholder="Bairro"
            value={pontoAtual.bairro}
            onChange={handleChange}
          />
          <input
            name="municipio"
            placeholder="Município"
            value={pontoAtual.municipio}
            onChange={handleChange}
          />
          <input
            name="uf"
            placeholder="UF"
            value={pontoAtual.uf}
            onChange={handleChange}
          />
        </fieldset>

        <div className="formulario-botoes">
          <button type="button" className="verde" onClick={adicionarPonto}>
            + Adicionar Ponto
          </button>
        </div>

        {pontos.map((p, index) => (
          <div key={index} className="ponto-listado">
            <div className="ponto-cabecalho">
              <strong>{p.tipoPonto}</strong> — {p.nomeLocal}
              <button className="perigo" onClick={() => removerPonto(index)}>
                Remover
              </button>
            </div>
          </div>
        ))}

        <div className="formulario-botoes">
          <button className="perigo" onClick={onBack}>
            Voltar
          </button>
          <button className="primario" onClick={onNext}>
            Finalizar
          </button>
        </div>
      </div>
    </Container>
  );
};

export default FormularioRota;
