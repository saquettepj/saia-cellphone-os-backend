/* eslint-disable no-unused-vars */

export enum AccountTypeEnum {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
}
export enum AccountPayTypeEnum {
  MONTHLY = 'MONTHLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}
export enum ProductConditionEnum {
  NEW = 'NEW',
  USED = 'GOOD',
  BAD = 'BAD',
}
export enum ProductTypeEnum {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}
export enum RoleEnum {
  TECHNICIAN = 'TECHNICIAN',
  ATTENDANT = 'ATTENDANT',
}
export enum OrderTypeEnum {
  SERVICE = 'SERVICE',
  SALE = 'SALE',
}
export enum PaymentMethodEnum {
  PIX = 'PIX',
  CASH = 'CASH',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  ESTIMATE = 'ESTIMATE',
  INSTALLMENTS = 'INSTALLMENTS',
}
export enum OrderStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  AWAITING_SUPPLY = 'AWAITING_SUPPLY',
}
export enum PaymentStatusEnum {
  OPEN = 'OPEN',
  ESTIMATED = 'ESTIMATED',
  INVOICED = 'INVOICED',
  FULFILLED = 'FULFILLED',
}
export enum ServiceStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  AWAITING_ADJUSTMENT = 'AWAITING_ADJUSTMENT',
}

export enum NfeDataRegimeTributarioEnum {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  SIMPLES_NACIONAL_EXCESSO_SUBLIMITE = 'SIMPLES_NACIONAL_EXCESSO_SUBLIMITE',
  REGIME_NORMAL = 'REGIME_NORMAL',
  SIMPLES_NACIONAL_MICROEMPRESA_MUNICIPAL = 'SIMPLES_NACIONAL_MICROEMPRESA_MUNICIPAL',
  ESTIMATIVA = 'ESTIMATIVA',
  MICROEMPREENDEDOR_INDIVIDUAL = 'MICROEMPREENDEDOR_INDIVIDUAL',
}

export enum NfeDataCodigoRegimeTributarioEnum {
  SIMPLES_NACIONAL = '1',
  SIMPLES_NACIONAL_EXCESSO_SUBLIMITE = '2',
  REGIME_NORMAL = '3',
  SIMPLES_NACIONAL_MICROEMPRESA_MUNICIPAL = '4',
  ESTIMATIVA = '5',
  MICROEMPREENDEDOR_INDIVIDUAL = '6',
}

export enum ValidateMessagesEnum {
  DATE_ON_ISO = 'Invalid date format. Expected ISO 8601 string.',
}

export enum NCMEnum {
  TELEFONE_CELULAR = '85171200', // Telefones celulares e smartphones
  BATERIA_CELULAR = '85076000', // Baterias de celulares (lítio ou outras) ou Power banks e baterias externas
  DISPLAY_CELULAR = '85249900', // Telas e displays de celulares
  PLACA_ELETRONICA = '85340011', // Placas de circuito impresso montadas
  CONECTOR_USB = '85369090', // Conectores e peças de interconexão
  ANTENA_CELULAR = '85291019', // Antenas para celulares
  CABO_FLEXIVEL = '85444200', // Cabos flexíveis de conexão interna ou // Cabos de carregamento USB
  CAPA_PROTETORA = '39269090', // Capas protetoras (plástico ou outros materiais) ou Películas protetoras de tela
  FONE_OUVIDO = '85183000', // Fones de ouvido e similares
  CARREGADOR = '85044021', // Carregadores de celular (adaptadores de corrente)
  SUPORTE_CARRO = '83024900', // Suportes para celulares (veículos)
  CAIXA_SOM_BLUETOOTH = '85182100', // Caixas de som Bluetooth
  SOLDADOR = '85151100', // Ferros de soldar
  PASTA_SOLDAR = '38101010', // Pastas de solda
  ESTACAO_SOLDAGEM = '85158090', // Estações de soldagem
  MICROCHAVE = '85365090', // Microchaves de celulares
  KIT_FERRAMENTAS = '82060000', // Kits de ferramentas para manutenção
  ALCOOL_ISOPROPILICO = '22071090', // Álcool isopropílico
  ADESIVO_B7000 = '35061090', // Adesivos específicos para reparo de eletrônicos
  ESPONJA_LIMPEZA = '39199000', // Espumas e esponjas de limpeza
  CARTAO_MEMORIA = '85235110', // Cartões de memória (SD, microSD)
  CHIP_CELULAR = '85423110', // Chips e cartões SIM
  RELOGIO_SMARTWATCH = '85176292', // Smartwatches
}
