/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')

const { NFeProcessor } = require('node-dfe')
const moment = require('moment')

// Dados da Empresa
const empresa = {
  cnpj: '26093979000183', // CNPJ da empresa
  razaoSocial: 'LF CALCADOS LTDA', // Nome completo ou razão social da empresa
  nomeFantasia: 'RAPHAELLA BOOZ SORRISO', // Nome fantasia da empresa
  inscricaoEstadual: '136478085', // Inscrição Estadual do emitente
  CNAE: '4782201', // Código CNAE da empresa
  codRegimeTributario: '3', // Regime tributário (Simples, Lucro Presumido, etc.)
  endereco: {
    logradouro: 'AV NATALINO JOAO BRESCANSIN',
    numero: '1783',
    complemento: 'SALA: 02',
    bairro: 'CENTRO',
    municipio: 'SORRISO',
    codMunicipio: '5107925',
    uf: 'MT',
    cUf: '51',
    cep: '78890178',
    telefone: '(66) 354-4124',
    pais: 'BRASIL',
    codPais: '1058',
  },
  certificado: {
    pfx: fs.readFileSync('D:\\Documentos\\Certificados\\cert.pfx'), // O PFX pode ser mantido como buffer
    pem: fs.readFileSync('D:\\Documentos\\Certificados\\cert.pem'), // Certificado extraído em formato PEM
    key: fs.readFileSync('D:\\Documentos\\Certificados\\key.pem'), // Chave privada extraída em formato PEM
    password: '1234', // Senha usada para descriptografar o PFX
  },
  idCSC: '1',
  CSC: 'CSC123456',
}

// Dados da NF-e (Documento Fiscal)
const documentoFiscal = {
  serie: '20', // Série da NF-e
  modelo: '65', // Modelo da NFC-e
  numeroNota: Math.floor(Math.random() * (9999 - 2 + 1)) + 2, // Número da nota fiscal
  naturezaOperacao: 'VENDA', // Descrição da natureza da operação
  ambiente: '2', // 1 = Produção, 2 = Homologação
  dhEmissao: moment().format(), // Data e hora da emissão
  dhSaiEnt: '', // Data e hora de saída/entrada (opcional para NFC-e)
  codUF: '51', // Código da Unidade Federativa
  tipoDocumentoFiscal: '1', // Tipo do documento: 0 = Entrada, 1 = Saída
  identificadorDestinoOperacao: '1', // Destino da operação: 1 = Interna, 2 = Interestadual, 3 = Exterior
  codIbgeFatoGerador: '4303103', // Código IBGE do município do fato gerador
  tipoImpressao: '4', // Tipo de impressão: 1 = Retrato, 2 = Paisagem
  tipoEmissao: '1', // Tipo de emissão: 1 = Normal
  finalidadeEmissao: '1', // Finalidade: 1 = Normal, 2 = Complementar, 3 = Ajuste, 4 = Devolução
  indPresenca: '1', // Indicador de presença: 0 = Não se aplica, 1 = Operação presencial
  indConsumidorFinal: '1', // Indicador de consumidor final: 0 = Não, 1 = Sim
  processoEmissao: '0', // Processo de emissão: 0 = Aplicativo do contribuinte
  versaoAplicativoEmissao: 'NODE-NFE TEST 1.0', // Versão do aplicativo emissor
  dhContingencia: '', // Data e hora da contingência (se houver)
  justificativaContingencia: '', // Justificativa para contingência (se houver)
  isContingenciaOffline: false, // Se está em contingência offline
}

// Dados do Destinatário
const destinatario = {
  documento: '41267310324', // CPF ou CNPJ do destinatário
  nome: 'DESTINATARIO TESTE', // Nome ou razão social do destinatário
  endereco: {
    logradouro: 'RUA TEST',
    numero: '1231',
    complemento: '',
    bairro: 'teste',
    municipio: 'testeee',
    codMunicipio: '4303103',
    uf: 'RS',
    cep: '11111111',
    telefone: '5111111111',
    pais: 'BRASIL',
    codPais: '1058',
  },
  indicadorIEDestinario: '9', // Indicador de Inscrição Estadual do destinatário
  email: 'test@test.com', // Email do destinatário
  isEstrangeiro: false, // Se o destinatário é estrangeiro
}

// Dados dos Produtos
const produtos = [
  {
    prod: {
      codigo: '84233', // Código do produto
      cEAN: '7898221456293', // Código EAN (código de barras)
      descricao: 'PRODUTO TESTE', // Descrição do produto
      cest: '2104400', // Código CEST (Substituição Tributária)
      NCM: '85164000', // Código NCM do produto
      CFOP: '5102', // CFOP (Código Fiscal de Operações)
      unidadeComercial: 'SAC', // Unidade comercial
      quantidadeComercial: '1.0000', // Quantidade comercializada
      valorUnitarioComercial: '31.80', // Valor unitário
      valorTotal: '31.80', // Valor total do produto
      cEANTrib: '7898221456293', // Código EAN tributável
      unidadeTributavel: 'SAC', // Unidade tributável
      quantidadeTributavel: '1.0000', // Quantidade tributável
      valorUnitarioTributavel: '31.80', // Valor unitário tributável
      valorFrete: '0.00', // Valor do frete
      valorSeguro: '0.00', // Valor do seguro
      valorDesconto: '0.00', // Valor do desconto
      valorOutro: '0.00', // Outros valores adicionais
      indicadorTotal: '1', // Indica se compõe o total da NF
    },
    imposto: {
      icms: {
        orig: '0', // Origem do produto
        CST: '00', // Código de Situação Tributária
        modBC: '3', // Modalidade de base de cálculo
        vBC: '31.80', // Valor da base de cálculo
        pICMS: '18.00', // Percentual do ICMS
        vICMS: '5.72', // Valor do ICMS
      },
      pis: {
        CST: '01', // Código de Situação Tributária do PIS
        vBC: 31.8, // Valor da base de cálculo do PIS
        pPIS: 1.65, // Percentual do PIS
        vPIS: 0.52, // Valor do PIS
      },
      cofins: {
        CST: '01', // Código de Situação Tributária do COFINS
        vBC: 31.8, // Valor da base de cálculo do COFINS
        pCOFINS: 7.6, // Percentual do COFINS
        vCOFINS: 2.42, // Valor do COFINS
      },
    },
    numeroItem: '1', // Número do item na nota
  },
]

// Total da nota fiscal
const total = {
  icmsTot: {
    vBC: '31.80', // Valor da base de cálculo do ICMS
    vICMS: '5.72', // Valor do ICMS
    vProd: '31.80', // Valor total dos produtos
    vNF: '31.80', // Valor total da nota fiscal
  },
}

// Transporte (obrigatório)
const transporte = {
  modalidateFrete: '9', // Modalidade do frete (0 = CIF, 1 = FOB, 9 = Sem frete)
}

// Informações adicionais
const infoAdicional = {
  infoComplementar: 'TESTE DE EMISSÃO DE NFC-E', // Informações adicionais ao contribuinte
  infoFisco: '', // Informações adicionais ao fisco
}

// Pagamento
const pagamento = {
  pagamentos: [
    {
      formaPagamento: '01', // 01 = Dinheiro, 03 = Cartão de Crédito, etc.
      valor: '31.80', // Valor do pagamento
    },
  ],
  valorTroco: '0.00', // Valor do troco (se houver)
}

// Montando o objeto 'configuracao'
const configuracao = {
  empresa,
  certificado: empresa.certificado,
  geral: {
    ambiente: documentoFiscal.ambiente,
    versao: '4.00',
    modelo: documentoFiscal.modelo,
  },
  webservices: {
    tentativas: 3,
    aguardarConsultaRetorno: 1000,
  },
  responsavelTecnico: {
    cnpj: '12345678000199',
    contato: 'João Silva',
    email: 'tecnico@empresa.com',
    fone: '(11) 99999-9999',
  },
  arquivos: {
    salvar: true,
    pastaEnvio: 'D:\\Documentos\\NFe',
    pastaRetorno: 'D:\\Documentos\\NFe\\Retorno',
    pastaXML: 'D:\\Documentos\\NFe\\XML',
  },
  nfe: {
    docFiscal: documentoFiscal,
    destinatario,
    produtos,
    total,
    transporte,
    infoAdicional,
    pagamento,
  },
}

async function testeEmissaoNFCe() {
  try {
    const nfeProcessor = new NFeProcessor(configuracao)
    const docEmitido = await nfeProcessor.processarDocumento(configuracao.nfe)

    if (!docEmitido.success) {
      throw new Error(docEmitido.error)
    } else {
      const env = docEmitido.envioNF
      console.log('XML Recebido:', env.xml_recebido)
      console.log(
        'Número do Protocolo:',
        env.data.retEnviNFe.protNFe.infProt.nProt,
      )
    }
  } catch (error) {
    console.error('Erro ao emitir NFC-e:', error)
  }
}

// Executa a função de teste
testeEmissaoNFCe()
