import { z } from 'zod'

export const ICreateNfceDTO = z
  .object({
    // Número da NFC-e e série (alterados a cada emissão)
    nNF: z.string().regex(/^[0-9]+$/, { message: 'Only numbers!' }), // Número da NFC-e
    serie: z.string().regex(/^[0-9]+$/, { message: 'Only numbers!' }), // Série da NFC-e

    // Dados do destinatário (opcionais para consumidor final sem CPF)
    dest: z
      .object({
        CNPJ: z
          .string()
          .length(14)
          .regex(/^[0-9]+$/)
          .optional(), // CNPJ do destinatário
        CPF: z
          .string()
          .length(11)
          .regex(/^[0-9]+$/)
          .optional(), // CPF do destinatário
        xNome: z.string().optional(), // Nome/Razão Social do destinatário
        email: z.string().email().optional(), // Email do destinatário
        enderDest: z
          .object({
            xLgr: z.string(), // Logradouro
            nro: z.string(), // Número
            xCpl: z.string().optional(), // Complemento
            xBairro: z.string(), // Bairro
            cMun: z.string().regex(/^[0-9]{7}$/), // Código do município
            xMun: z.string(), // Nome do município
            UF: z.string().length(2), // Estado
            CEP: z
              .string()
              .length(8)
              .regex(/^[0-9]+$/), // CEP
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),

    // Lista de itens da nota (variável a cada emissão)
    det: z
      .array(
        z
          .object({
            cProd: z.string(), // Código do produto
            xProd: z.string(), // Nome/descrição do produto
            NCM: z
              .string()
              .length(8)
              .regex(/^[0-9]+$/), // Código NCM
            qCom: z.string(), // Quantidade comercializada
            vUnCom: z.string(), // Valor unitário comercial
          })
          .strict(),
      )
      .min(1), // Pelo menos 1 item é necessário

    // Totais (calculados pelo sistema, mas enviados para a SEFAZ)
    total: z
      .object({
        vProd: z.string(), // Total dos produtos
        vNF: z.string(), // Valor total da nota fiscal
      })
      .strict(),

    // Pagamento (alterado conforme a forma de pagamento utilizada)
    pag: z
      .object({
        detPag: z
          .array(
            z
              .object({
                tPag: z.string(), // Tipo de pagamento (ex.: 01 = Dinheiro, 02 = Cheque)
                vPag: z.string(), // Valor pago
              })
              .strict(),
          )
          .min(1), // Pelo menos uma forma de pagamento é obrigatória
        vTroco: z.string().optional(), // Troco (opcional)
      })
      .strict(),
  })
  .strict()
