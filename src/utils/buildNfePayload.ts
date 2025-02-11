/* eslint-disable camelcase */
import { returnStateCode } from './returnStateCode'

import { env } from '@/env'
import { PaymentMethodEnum } from '@/enums/all.enum'
import { ICertificate } from '@/interfaces/ICertificate'
import { IExternalCNPJData } from '@/interfaces/IExternalCNPJData'
import { IOrder } from '@/repositories/order/IOrderRepository'

/* eslint-disable camelcase */

const getDateUTC = () => {
  const data = new Date()
  const ano = data.getUTCFullYear()
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
  const dia = String(data.getUTCDate()).padStart(2, '0')
  const horas = String(data.getUTCHours()).padStart(2, '0')
  const minutos = String(data.getUTCMinutes()).padStart(2, '0')
  const segundos = String(data.getUTCSeconds()).padStart(2, '0')

  return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}+00:00`
}

function getPaymentCode(paymentMethod: PaymentMethodEnum): string {
  const paymentMapping: Record<PaymentMethodEnum, string> = {
    [PaymentMethodEnum.CASH]: '01',
    [PaymentMethodEnum.INSTALLMENTS]: '03',
    [PaymentMethodEnum.CREDIT_CARD]: '03',
    [PaymentMethodEnum.DEBIT_CARD]: '04',
    [PaymentMethodEnum.PIX]: '17',
    [PaymentMethodEnum.ESTIMATE]: '90',
  }

  return paymentMapping[paymentMethod] || '99'
}

function getRegimeTributario(
  externalCNPJResponseData: IExternalCNPJData,
): string {
  // Se a empresa for optante pelo Simples Nacional, retorna '1'
  if (externalCNPJResponseData.company.simples.optant) {
    return '1' // Simples Nacional
  }

  // Se a empresa for optante pelo Simei, retorna '1' (Simples Nacional - MEI)
  if (externalCNPJResponseData.company.simei.optant) {
    return '1' // Simei também faz parte do Simples Nacional
  }

  // Se a empresa não for optante pelo Simples Nacional, verifica o regime normal
  return '3' // Regime Normal (Lucro Presumido ou Lucro Real)
}

export function buildNfcePayload(
  externalCNPJResponseData: IExternalCNPJData,
  nfeData: {
    id: string
    companyId: string
    serializedCertificatePFX: string
    certificatePasswordEncrypt: string
    idCSC: string
    CSC: string
    IE: string
    IM: string
    lastNNF: string
  } | null,
  client: {
    name: string
    id: string
    companyId: string
    createdAt: Date
    email: string | null
    CPF: string
    phone: string | null
  },
  clientAddress: {
    companyId: string | null
    clientId: string | null
    id: string
    country: string
    city: string
    state: string
    neighborhood: string
    street: string
    streetNumber: string
    zipCode: string
  } | null,
  order: IOrder | null,
  clientMunicipalityCode: string,
  cert: ICertificate,
  cEANDisabled: boolean | undefined,
) {
  if (!nfeData || !client || !clientAddress || !order) {
    return undefined
  }

  const emit = {
    CNPJ: externalCNPJResponseData.taxId,
    xNome: externalCNPJResponseData.company.name,
    xFant: externalCNPJResponseData.alias,
    enderEmit: {
      xLgr: externalCNPJResponseData.address.street,
      nro: externalCNPJResponseData.address.number,
      xCpl: externalCNPJResponseData.address.details || '',
      xBairro: externalCNPJResponseData.address.district,
      cMun: String(externalCNPJResponseData.address.municipality),
      xMun: externalCNPJResponseData.address.city,
      UF: externalCNPJResponseData.address.state,
      CEP: externalCNPJResponseData.address.zip,
      cPais: '1058', // Sempre Brasil
      xPais: externalCNPJResponseData.address.country.name,
      fone: externalCNPJResponseData.phones.length
        ? externalCNPJResponseData.phones[0].area +
          externalCNPJResponseData.phones[0].number
        : '',
    },
    IE: nfeData.IE,
    IM: nfeData.IM,
    CRT: getRegimeTributario(externalCNPJResponseData),
    CNAE: externalCNPJResponseData.mainActivity.id.toString(),
  }

  const dest = {
    CPF: client.CPF,
    xNome: client.name,
    enderDest: {
      xLgr: clientAddress.street,
      nro: clientAddress.streetNumber,
      xCpl: '',
      xBairro: clientAddress.neighborhood,
      cMun: clientMunicipalityCode,
      xMun: clientAddress.city,
      UF: clientAddress.state,
      CEP: clientAddress.zipCode,
      cPais: '1058',
      xPais: 'BRASIL',
    },
    indIEDest: '9',
    email: client.email || undefined,
  }

  // ✅ Definição das variáveis de soma
  let valorTotalProdutos = 0
  let totalBaseCalculoICMS = 0
  let totalICMS = 0
  let totalPIS = 0
  let totalCOFINS = 0
  let totalTributos = 0
  let descontoTotal = 0

  // ✅ Alíquotas padrão
  const aliquotaICMS = 18.0 // % ICMS
  const aliquotaPIS = 1.65 // % PIS
  const aliquotaCOFINS = 7.6 // % COFINS

  // =====================================================================
  // 1) MAPEAMENTO DOS ITENS DA NOTA FISCAL
  // =====================================================================
  const det_list = order.orderItems.map((item, index) => {
    // 1.1) Calcula valores básicos do item
    const quantidade = parseFloat((item.quantity || 0).toFixed(4))
    const valorUnitario = parseFloat(
      ((item.registeredProductPrice || 0) - (item.discount || 0)).toFixed(4),
    )
    const valorTotalItem = parseFloat((quantidade * valorUnitario).toFixed(4))
    const descontoItem = item.discount
      ? parseFloat((item.discount * quantidade).toFixed(4))
      : 0

    // 1.2) Soma nos acumuladores gerais
    valorTotalProdutos += valorTotalItem
    descontoTotal += descontoItem

    // 1.3) Base de cálculo e impostos
    let vBC_ICMS = 0
    let vICMS = 0 // ICMS destacado
    const vPIS = parseFloat(((valorTotalItem * aliquotaPIS) / 100).toFixed(4))
    const vCOFINS = parseFloat(
      ((valorTotalItem * aliquotaCOFINS) / 100).toFixed(4),
    )

    // 1.4) Regime Tributário
    const CRT = emit.CRT

    // 1.5) Se Lucro Presumido ou Real → destaca ICMS
    if (CRT === '2' || CRT === '3') {
      vBC_ICMS = valorTotalItem
      vICMS = parseFloat(((vBC_ICMS * aliquotaICMS) / 100).toFixed(4))
    }

    // 1.6) Soma valores de base e impostos no total da NF
    totalBaseCalculoICMS += vBC_ICMS
    totalICMS += vICMS
    totalPIS += vPIS
    totalCOFINS += vCOFINS
    totalTributos += vPIS + vCOFINS

    // 1.7) Monta o objeto do item (produto + imposto)
    return {
      $: { nItem: String(index + 1) },
      prod: {
        cProd: item.productId,
        cEAN: cEANDisabled ? 'SEM GTIN' : item?.product?.cEAN || 'SEM GTIN',
        cEANTrib: cEANDisabled ? 'SEM GTIN' : item?.product?.cEAN || 'SEM GTIN',
        xProd: item?.product?.description || 'SEM DESCRIÇÃO',
        NCM: item?.product?.NCM || '',
        CFOP: '5102',
        uCom: 'UN',
        qCom: quantidade.toFixed(4),
        vUnCom: valorUnitario.toFixed(2),
        vProd: valorTotalItem.toFixed(2),
        uTrib: 'UN',
        qTrib: quantidade.toFixed(4),
        vUnTrib: valorUnitario.toFixed(2),
        indTot: '1',
      },
      imposto: {
        // 1.7.1) Valor aproximado total de tributos do item (somente PIS + COFINS aqui)
        vTotTrib: totalTributos.toFixed(2),

        // 1.7.2) ICMS
        ICMS:
          CRT === '1'
            ? {
                // Simples Nacional
                ICMSSN102: {
                  orig: '0',
                  CSOSN: '102',
                },
              }
            : {
                // Lucro Presumido ou Real
                ICMS00: {
                  orig: '0',
                  CST: '00',
                  modBC: '3',
                  vBC: vBC_ICMS.toFixed(2),
                  pICMS: aliquotaICMS.toFixed(2),
                  vICMS: vICMS.toFixed(2),
                },
              },

        // 1.7.3) PIS
        PIS: {
          PISOutr: {
            CST: '99',
            vBC: vBC_ICMS.toFixed(2),
            pPIS: aliquotaPIS.toFixed(2),
            vPIS: vPIS.toFixed(2),
          },
        },

        // 1.7.4) COFINS
        COFINS: {
          COFINSOutr: {
            CST: '99',
            vBC: vBC_ICMS.toFixed(2),
            pCOFINS: aliquotaCOFINS.toFixed(2),
            vCOFINS: vCOFINS.toFixed(2),
          },
        },
      },
    }
  })

  // =====================================================================
  // 2) TOTALIZAÇÃO DOS VALORES NO ICMSTot
  // =====================================================================
  const ICMSTot = {
    vBC: totalBaseCalculoICMS.toFixed(2),
    vICMS:
      emit.CRT !== '1'
        ? ((totalBaseCalculoICMS * aliquotaICMS) / 100).toFixed(2)
        : '0.00',
    vICMSDeson: '0.00',
    vFCP: '0.00',
    vBCST: '0.00',
    vST: '0.00',
    vFCPST: '0.00',
    vFCPSTRet: '0.00',
    vProd: valorTotalProdutos.toFixed(2),
    vFrete: '0.00',
    vSeg: '0.00',
    vDesc: '0.00', // já descontado no preço do item
    vII: '0.00',
    vIPI: '0.00',
    vIPIDevol: '0.00',
    // PIS e COFINS totalizados sobre o valor total dos produtos
    vPIS: ((valorTotalProdutos * aliquotaPIS) / 100).toFixed(2),
    vCOFINS: ((valorTotalProdutos * aliquotaCOFINS) / 100).toFixed(2),
    vOutro: '0.00',
    vNF: valorTotalProdutos.toFixed(2),
    vTotTrib: totalTributos.toFixed(2),
  }

  console.log((Number(nfeData.lastNNF) + 1).toString())
  console.log(env.NODE_ENV !== 'production' ? '2' : '1')

  const nfe = {
    ide: {
      cUF: returnStateCode(externalCNPJResponseData.address.state),
      natOp: 'VENDA',
      serie: '1',
      nNF: (Number(nfeData.lastNNF) + 1).toString(),
      dhEmi: getDateUTC(),
      tpNF: '1',
      idDest: '1',
      cMunFG: String(externalCNPJResponseData.address.municipality),
      tpImp: '1',
      tpEmis: '1',
      finNFe: '1',
      indFinal: '1',
      indPres: '1',
      procEmi: '0',
      verProc: 'NODE-NFE TEST 1.0',
    },
    emit,
    dest,
    det_list,
    total: { ICMSTot },
    transp: { modFrete: '9' },
    pag: {
      detPag: [
        {
          indPag: '0',
          tPag: getPaymentCode(order.paymentMethod as PaymentMethodEnum),
          vPag: valorTotalProdutos.toFixed(2),
        },
      ],
      vTroco: '0',
    },
    infAdic: {
      infCpl: '',
      infAdFisco: '',
      obsCont: [],
      obsFisco: [],
      procRef: [],
    },
  }

  const configuracoes = {
    empresa: {
      pem: cert.pem,
      key: cert.key,
      password: cert.password,
      idCSC: nfeData.idCSC,
      CSC: nfeData.CSC,
    },
    geral: {
      versao: '4.00',
      ambiente: env.NODE_ENV !== 'production' ? '2' : '1',
      modelo: '55',
    },
  }

  return { documento: nfe, configuracoes }
}

export function buildCancelNfcePayload(
  nfeData: {
    id: string
    companyId: string
    serializedCertificatePFX: string
    certificatePasswordEncrypt: string
    idCSC: string
    CSC: string
    IE: string
    IM: string
  } | null,
  cert: ICertificate,
) {
  if (!nfeData) {
    return undefined
  }

  const configuracoes = {
    empresa: {
      pem: cert.pem,
      key: cert.key,
      password: cert.password,
      idCSC: nfeData.idCSC,
      CSC: nfeData.CSC,
    },
    geral: {
      versao: '4.00',
      ambiente: '2',
      modelo: '55',
    },
  }

  return { configuracoes }
}
