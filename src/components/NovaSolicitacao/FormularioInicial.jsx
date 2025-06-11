import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaFormulario, validarCNH } from './schemaFormularioInicial';
import './FormularioInicial.css';
import Container from '../Container/Container';
import { FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { motivosViagem, tiposVeiculo, tiposViagem } from './selectInfo';
import { useAlert } from '../../contexts/AlertContext';

const FormularioInicial = ({ dados, onNext }) => {
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const form = useForm({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
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
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const tipoSolicitacao = watch('tipoSolicitacao');

  useEffect(() => {
    if (!user?.nome || !user?.cpf || !user?.email) return;

    if (tipoSolicitacao === 'proprio') {
      form.setValue('interessado.nome', user.nome);
      form.setValue('interessado.cpf', user.cpf);
      form.setValue('interessado.email', user.email);
      form.setValue('procurador.nome', '');
      form.setValue('procurador.cpf', '');
      form.setValue('procurador.email', '');
    } else if (tipoSolicitacao === 'terceiro') {
      form.setValue('interessado.nome', '');
      form.setValue('interessado.cpf', '');
      form.setValue('interessado.email', '');
      form.setValue('procurador.nome', user.nome);
      form.setValue('procurador.cpf', user.cpf);
      form.setValue('procurador.email', user.email);
    }
  }, [tipoSolicitacao, user, form]);

  const onError = (errors) => {
    const extractMessages = (errorObj) => {
      const messages = [];

      const traverse = (obj) => {
        if (!obj || typeof obj !== 'object') return;

        for (const key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

          const val = obj[key];

          if (val && typeof val.message === 'string') {
            messages.push(val.message);
          } else if (typeof val === 'object') {
            traverse(val);
          }
        }
      };

      traverse(errorObj);
      return messages;
    };

    const mensagens = extractMessages(errors);

    mensagens.forEach((msg) =>
      showAlert({
        type: 'error',
        message: msg,
      }),
    );
  };

  const onSubmit = (data) => {
    let partida = new Date(`${data.dataPartida}T${data.horaPartida}:00`);
    let chegada = new Date(`${data.dataChegada}T${data.horaChegada}:00`);
    let validade = data.interessado.cnhValidade;
    console.log(data);
    if (data.dataChegada < data.dataPartida) {
      showAlert({
        message: 'Data de chegada deve ser posterior à data de partida.',
        type: 'error',
      });
      throw new Error('Data de chegada deve ser posterior à data de partida.');
    }

    if (data.tipoViagem === 'BATE VOLTA') {
      chegada = partida;
    }
    if (data.tipoViagem === 'PERNOITE') {
      const diffPernoite = (chegada - partida) / (1000 * 60 * 60 * 24);
      if (diffPernoite < 1 || diffPernoite >= 2) {
        showAlert({
          message:
            'Em Pernoite, a chegada deve ser exatamente no dia seguinte da partida.',
          type: 'error',
        });
        throw new Error(
          'Em Pernoite, a chegada deve ser exatamente no dia seguinte da partida.',
        );
      }
    }
    if (data.tipoViagem === 'VIAGEM PROLONGADA') {
      const diffProlongada = (chegada - partida) / (1000 * 60 * 60 * 24);
      if (diffProlongada < 2) {
        showAlert({
          message:
            'Em Viagem Prolongada, a chegada deve ser pelo menos dois dias após a partida.',
          type: 'error',
        });
        throw new Error(
          'Em Viagem Prolongada, a chegada deve ser pelo menos dois dias após a partida.',
        );
      }
    }

    const res = validarCNH(data);
    console.log(res);
    if (res) {
      showAlert({
        message: res,
        type: 'error',
      });
      throw new Error(res);
    }

    const dadosFinal = {
      ...data,
      dataPartida: partida.toISOString(),
      dataChegada: chegada.toISOString(),
      cnhValidade: validade,
    };

    delete dadosFinal.tipoSolicitacao;
    onNext(dadosFinal);
  };

  return (
    <Container>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className='page form-inicial'
        >
          <h3>Nova Solicitação</h3>

          <div className='radio-grupo'>
            <label>
              <input
                type='radio'
                value='proprio'
                {...register('tipoSolicitacao')}
              />
              Solicitação para você
            </label>
            <label>
              <input
                type='radio'
                value='terceiro'
                {...register('tipoSolicitacao')}
              />
              Solicitação para terceiro
              <div className='tooltip-container'>
                <FaQuestionCircle className='information' />
                <span className='tooltip-text'>
                  Todo interessado precisa ser colaborador do DETRAN-ES
                </span>
              </div>
            </label>
          </div>

          {tipoSolicitacao === 'terceiro' && (
            <fieldset>
              <legend>Procurador</legend>
              <div className='row'>
                <label className='input-group'>
                  Nome
                  <input
                    {...register('procurador.nome')}
                    readOnly={tipoSolicitacao === 'terceiro'}
                  />
                </label>
                <label className='input-group'>
                  CPF
                  <input
                    {...register('procurador.cpf')}
                    readOnly={tipoSolicitacao === 'terceiro'}
                  />
                </label>
              </div>
              <div className='row'>
                <label className='input-group'>
                  Email
                  <input
                    {...register('procurador.email')}
                    readOnly={tipoSolicitacao === 'terceiro'}
                  />
                </label>
                <label className='input-group'>
                  Telefone
                  <input {...register('procurador.telefone')} />
                </label>
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend>Interessado</legend>
            <div className='row'>
              <div className='column'>
                <label className='input-group'>
                  Nome
                  <input
                    {...register('interessado.nome')}
                    readOnly={tipoSolicitacao === 'proprio'}
                  />
                </label>
              </div>
              <div className='column'>
                <label className='input-group'>
                  CPF
                  <input
                    {...register('interessado.cpf')}
                    readOnly={tipoSolicitacao === 'proprio'}
                  />
                </label>
              </div>
            </div>
            <div className='row'>
              <label className='input-group'>
                Email
                <input
                  {...register('interessado.email')}
                  readOnly={tipoSolicitacao === 'proprio'}
                />
              </label>
              <label className='input-group'>
                Telefone
                <input {...register('interessado.telefone')} />
              </label>
            </div>
            <div className='row'>
              <div className='column'>
                <label className='input-group-2'>
                  CNH
                  <input {...register('interessado.cnh')} />
                </label>
                <label className='input-group-3'>
                  Categoria
                  <input {...register('interessado.cnhCategoria')} />
                </label>

                <label className='input-group-2'>
                  Validade
                  <input type='date' {...register('interessado.cnhValidade')} />
                </label>
              </div>
              <label className='input-group-2'>
                Órgão Emissor
                <input {...register('interessado.cnhOrgaoEmissor')} />
              </label>
              <label className='input-group-3'>
                UF
                <input {...register('interessado.cnhuf')} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Informações da Solicitação</legend>
            <div className='row'>
              <label className='input-group'>
                Tipo de Veículo
                <select {...register('tipoVeiculo')}>
                  <option value='' disabled>
                    Selecione
                  </option>
                  {tiposVeiculo.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
              <label className='input-group'>
                Motorista Solicitado
                <select {...register('motoristaSolicitado')}>
                  <option value='' disabled>
                    Selecione
                  </option>
                  <option value='Sim'>Sim</option>
                  <option value='Não'>Não</option>
                </select>
              </label>
            </div>
            <div className='row'>
              <label className='input-group'>
                Tipo de Viagem
                <select {...register('tipoViagem')}>
                  <option value='' disabled>
                    Selecione
                  </option>
                  {tiposViagem.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>

              <label className='input-group'>
                Motivo da Viagem
                <select {...register('motivoViagem')}>
                  <option value='' disabled>
                    Selecione
                  </option>
                  {motivosViagem.map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='row'>
              <label className='input-group'>
                Data e Hora de Partida
                <input type='date' {...register('dataPartida')} />
                <input type='time' {...register('horaPartida')} />
              </label>
              <label className='input-group'>
                Data e Hora de Chegada
                <input type='date' {...register('dataChegada')} />
                <input type='time' {...register('horaChegada')} />
              </label>
            </div>
          </fieldset>
          <div className='row textarea'>
            <label className='input-group'>
              Observações
              <textarea {...register('observacao')} />
            </label>
          </div>

          <div className='formulario-botoes'>
            <button type='submit' className='primario'>
              Próximo
            </button>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
};

export default FormularioInicial;
