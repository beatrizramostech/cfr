import { z } from 'zod';

export const schemaFormulario = z.object({
  tipoSolicitacao: z.enum(['proprio', 'terceiro']),
  procurador: z.object({
    nome: z.string().optional(),
    cpf: z.string().optional(),
    email: z.string().optional(),
    telefone: z.string().optional(),
  }),
  interessado: z.object({
    nome: z.string().min(1, 'Nome obrigatório'),
    cpf: z.string().min(11, 'CPF inválido'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(8, 'Telefone obrigatório'),
    cnh: z.string().optional(),
    cnhCategoria: z.string().optional(),
    cnhOrgaoEmissor: z.string().optional(),
    cnhuf: z.string().optional(),
    cnhValidade: z.string().optional(),
  }),
  tipoVeiculo: z.string().min(1, 'Tipo de veiculo obrigatório'),
  motoristaSolicitado: z.string(),
  tipoViagem: z.string().min(1, 'Tipo de viagem obrigatória'),
  motivoViagem: z.string().min(1, 'Motivo de viagem obrigatória'),
  dataPartida: z.string().min(1, 'Data de partida obrigatória'),
  horaPartida: z.string().min(1, 'Hora da partida obrigatória'),
  dataChegada: z.string().min(1, 'Data de chegada obrigatória'),
  horaChegada: z.string().min(1, 'Hora de chegada obrigatória'),
  observacao: z.string().optional(),
});

export const validarCNH = (data) => {
  if (data.motoristaSolicitado == 'Não') {
    if (data.interessado.cnh == '') {
      return 'Se o solicitante não possui CNH válida, deve solicitar motorista.';
    }
    if (data.interessado.cnhValidade == '') {
      return 'Validade da CNH Invalida';
    }
    if (data.interessado.cnhCategoria == '') {
      return 'Categoria da CNH Invalida';
    }
    if (data.interessado.cnhOrgaoEmissor == '') {
      return 'Orgão Emissor da CNH Invalida';
    }
    if (data.interessado.cnhuF == '') {
      return 'UF da CNH Invalida';
    }
  }
  return null;
};
export const validarTipoViagem = (data, pontosRota) => {
  const partida = new Date(`${data.dataPartida}T${data.horaPartida}:00`);
  const chegada = new Date(`${data.dataChegada}T${data.horaChegada}:00`);

  const origem = pontosRota.find((p) => p.tipoPonto === 'Origem');
  const destino = pontosRota.find((p) => p.tipoPonto === 'Destino');
  const intermediarios = pontosRota.filter(
    (p) => p.tipoPonto === 'Intermediario',
  );

  const mesmoLugar =
    origem?.nomeLocal === destino?.nomeLocal &&
    origem?.municipio === destino?.municipio;

  switch (data.tipoViagem) {
    case 'BATE VOLTA':
      if (partida.toDateString() !== chegada.toDateString()) {
        return 'Em Bate Volta, a data de chegada deve ser no mesmo dia da partida.';
      }
      if (!mesmoLugar) {
        return 'Em Bate Volta, o local de origem deve ser igual ao destino.';
      }
      if (intermediarios.length == 0) {
        return 'Em Bate Volta, deve haver ponto intermediário.';
      }
      break;

    case 'DOBRADINHA': {
      const nomes = pontosRota.map((p) => `${p.nomeLocal}-${p.municipio}`);
      const setNomes = new Set(nomes);
      if (setNomes.size !== pontosRota.length) {
        return 'Em Dobradinha, todos os pontos devem ser diferentes entre si.';
      }
      break;
    }

    case 'IDA':
      if (intermediarios.length > 0) {
        return 'Em Ida, não pode haver ponto intermediário.';
      }
      if (mesmoLugar) {
        return 'Em Ida, origem e destino devem ser diferentes.';
      }
      break;

    default:
      return null;
  }

  return null;
};
