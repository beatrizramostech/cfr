import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaFormulario, validarCNH } from './schemaFormularioInicial';
import './FormularioInicial.css';
import Container from '../Container/Container';
import { FaQuestionCircle } from 'react-icons/fa';
import { motivosViagem, tiposVeiculo, tiposViagem } from './selectInfo';
import { useAlert } from '../../contexts/AlertContext';
import useWindowWidth from './resizeWidth';
import { useAuth } from '../../contexts/AuthContext';

const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${year}-${month}-${day}`;
  };
const toIsoDate = (date) => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  const res= new Date(Date.UTC(year, month - 1, day));
  return res.toISOString();
};  
const FormularioInicial = ({ dados, onNext }) => {
  const {usuario} = useAuth()
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
      motoristaSolicitado: '',
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
    if (!usuario) return;

    if (tipoSolicitacao === 'proprio' && usuario) {
      form.setValue('interessado.nome', usuario.nome);
      form.setValue('interessado.cpf', usuario.cpf);
      form.setValue('interessado.email', usuario.email);
      form.setValue('interessado.telefone', usuario.telefone || '');
      form.setValue('interessado.cnh', usuario.cnh || '');
      form.setValue('interessado.cnhCategoria', usuario.cnhCategoria || '');
      form.setValue('interessado.cnhOrgaoEmissor', usuario.cnhOrgaoEmissor || ''); 
      form.setValue('interessado.cnhuf', usuario.cnhuf || '');
      form.setValue('interessado.cnhValidade', formatDate(usuario.cnhValidade) || '');
      form.resetField('procurador.nome');
      form.resetField('procurador.cpf');
      form.resetField('procurador.email');
      form.resetField('procurador.telefone');
    } else if (tipoSolicitacao === 'terceiro') {
      form.resetField('interessado.nome');
      form.resetField('interessado.cpf');
      form.resetField('interessado.email');
      form.resetField('interessado.telefone');
      form.resetField('interessado.cnh');
      form.resetField('interessado.cnhCategoria');
      form.resetField('interessado.cnhOrgaoEmissor');
      form.resetField('interessado.cnhuf');
      form.resetField('interessado.cnhValidade');
      form.setValue('procurador.telefone', usuario.telefone || '');
      form.setValue('procurador.nome', usuario.nome);
      form.setValue('procurador.cpf', usuario.cpf);
      form.setValue('procurador.email', usuario.email);
    }
  }, [tipoSolicitacao, form]);

  const onError = (errors) => {
    console.error('Form errors:', errors);
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
    console.error('Mensagens de erro:', mensagens);
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
    console.log(data.interessado.cnh)
    const res = validarCNH(data);
    
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
  interessado: {
    ...data.interessado,
    cnhValidade: toIsoDate(validade),
  }
};


    delete dadosFinal.tipoSolicitacao;
    console.log(dadosFinal)
    onNext(dadosFinal);
  };

  const width = useWindowWidth();
  const input2 = width > 768 ? 'input-group-2' : 'input-group';
  const input3 = width > 768 ? 'input-group-3' : 'input-group';
  const input4 = width > 768 ? 'input-group-4' : 'input-group';
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
                    Nome *   
                  <input className='disabled-input'
                    {...register('procurador.nome')}
                    readOnly={tipoSolicitacao === 'terceiro'}
                  />
                </label>
                <label className='input-group'>
                  CPF *
                  <input className='disabled-input'
                    {...register('procurador.cpf')}
                    readOnly={tipoSolicitacao === 'terceiro'}
                  />
                </label>
              </div>
              <div className='row'>
                <label className='input-group'>
                  Email *
                  <input className='disabled-input'
                    {...register('procurador.email')}
                    readOnly={tipoSolicitacao === 'terceiro'}
                
                  />
                </label>
                <label className='input-group'>
                  Telefone *
                  <input className='disabled-input' {...register('procurador.telefone')} />
                </label>
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend>Interessado</legend>
            <div className='row'>
                <label className='input-group'>
                   <div className={tipoSolicitacao === 'terceiro' ? 'tooltip-container' : ''}>
                  Nome *
                  <input  className={tipoSolicitacao=== 'proprio' ? 'disabled-input' : ''}
                    {...register('interessado.nome')}
                    readOnly={tipoSolicitacao === 'proprio'}
                  />  <span className='tooltip-text'>
                  Campo obrigatório
                </span>
              </div>
                </label>
            
                <label className='input-group'>
                  <div className={tipoSolicitacao === 'terceiro' ? 'tooltip-container' : ''}>
                      CPF *
                      <input  className={tipoSolicitacao=== 'proprio' ? 'disabled-input' : ''}
                        {...register('interessado.cpf')}
                        readOnly={tipoSolicitacao === 'proprio'}
                      />  <span className='tooltip-text'>
                      Campo obrigatório
                    </span>
                  </div>
                </label>
              </div>
            <div className='row'>
              <label className='input-group'>
                <div className={tipoSolicitacao === 'terceiro' ? 'tooltip-container' : ''}>

                Email *
                      <input  className={tipoSolicitacao=== 'proprio' ? 'disabled-input' : ''}
                  {...register('interessado.email')}
                  readOnly={tipoSolicitacao === 'proprio'}
                       />  <span className='tooltip-text'>
                      Campo obrigatório
                    </span>
                  </div>
              </label>
              <label className='input-group'>
                  <div className={tipoSolicitacao === 'terceiro' ? 'tooltip-container' : ''}>
                     Telefone *
                    <input  className={tipoSolicitacao=== 'proprio' ? 'disabled-input' : ''}
                     {...register('interessado.telefone')} readOnly={tipoSolicitacao === 'proprio'}/>
                    <span className='tooltip-text'>
                      Campo obrigatório
                    </span>
                  </div>   
            </label>
            </div>
            <div className='row-cnh'>
          <div className="column">
                <label className={input2}>
                  CNH
                  <input {...register('interessado.cnh')} />
                </label>
                <label className={input3}>
                  Categoria
                  <input {...register('interessado.cnhCategoria')} />
                </label>
                <label className={input2}>
                  Validade
                  <input type='date' {...register('interessado.cnhValidade')} />
                </label>
              </div>
              <div className="column-cnh">
              <label className={input4}>
                Órgão Emissor
                <input {...register('interessado.cnhOrgaoEmissor')} />
              </label>
              <label className={input3}>
                UF
                <input {...register('interessado.cnhuf')} />
              </label>
              </div></div>
         
          </fieldset>

          <fieldset>
            <legend>Informações da Solicitação</legend>
            <div className='row'>
              <div className="column">
              <label className='input-group'>
                Tipo de Veículo *
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
                Motorista Solicitado *
                <select {...register('motoristaSolicitado')}>
                  <option value='' disabled>
                    Selecione
                  </option>
                  <option value='Sim'>Sim</option>
                  <option value='Não'>Não</option>
                </select>
              </label></div>
            
              <label className={input2}>
                Tipo de Viagem *
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
                Motivo da Viagem *
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
            <div className='row column'>
              <label className='input-group'>
                Data e Hora de Partida *
                <input type='date' {...register('dataPartida')} />
                <input type='time' {...register('horaPartida')} />
              </label>
              <label className='input-group'>
                Data e Hora de Chegada *
                <input type='date' {...register('dataChegada')} />
                <input type='time' {...register('horaChegada')} />
              </label>
            </div>
          </fieldset>
          <fieldset>
                  <legend> Observações</legend>
          <div className='row textarea'>
            <label className='input-group'>
             
              <textarea {...register('observacao')} />
            </label>
          </div>
          </fieldset>

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