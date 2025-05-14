import { FastifyReply, FastifyRequest } from 'fastify'
import multer from 'fastify-multer'
import { read, utils } from 'xlsx'

import { FileNotUploadedError } from '@/errors/fileNotUploadedError'
import { InvalidExcelFormatError } from '@/errors/invalidExcelFormatError'
import { InvalidExcelHeadersError } from '@/errors/invalidExcelHeadersError'
import { EmptyExcelError } from '@/errors/emptyExcelError'
import { IImportProductsDTO } from '@/dtos/product/IImportProductsDTO'
import { ProductConditionEnum, ProductTypeEnum } from '@/enums/all.enum'
import { setupImportProductsUseCase } from '@/useCases/product/factory/setupImportProductsUseCase'

const upload = multer({ storage: multer.memoryStorage() })

async function importProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id: companyId } = request.company

    const file = request.file
    if (!file || !file.buffer) {
      throw new FileNotUploadedError()
    }

    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      throw new InvalidExcelFormatError()
    }

    const workbook = read(file.buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    const expectedHeaders = [
      'DESCRICAO',
      'PRECO',
      'QUANTIDADE',
      'CODIGO DE BARRAS',
      'CUSTO',
      'LOCAL',
    ].map((h) => h.trim())

    const sheetData = utils.sheet_to_json<string[]>(worksheet, {
      defval: undefined,
      header: 1,
    }) as string[][]

    if (!sheetData.length) {
      throw new EmptyExcelError()
    }

    const sheetHeaders = sheetData[0].map((h) => String(h).trim())

    const headersValid = expectedHeaders.every((header) =>
      sheetHeaders.includes(header),
    )

    if (!headersValid) {
      throw new InvalidExcelHeadersError()
    }

    const rawData = utils
      .sheet_to_json<Record<string, unknown>>(worksheet, {
        defval: undefined,
        header: expectedHeaders,
      })
      .map((row, index) => {
        const processedRow: Record<string, unknown> = {}

        expectedHeaders.forEach((header) => {
          processedRow[header] =
            row[header] !== undefined ? row[header] : undefined
        })

        return { index, data: processedRow }
      })
      .filter(({ data }) => {
        const isHeaderRow = expectedHeaders.every(
          (header) => data[header] === header,
        )
        const isEmptyRow = expectedHeaders.every(
          (header) => data[header] === undefined,
        )

        return !isHeaderRow && !isEmptyRow
      })
      .map(({ data }) => data)

    const parsedData = IImportProductsDTO.parse({
      products: rawData.map((row) => ({
        type: ProductTypeEnum.PRODUCT,
        condition: ProductConditionEnum.NEW,
        description: String(row.DESCRICAO),
        price: Number(row.PRECO),
        cost: row.CUSTO ? Number(row.CUSTO) : 0,
        quantity: Number(row.QUANTIDADE),
        localization: row.LOCAL ? String(row.LOCAL) : undefined,
        cEAN: row['CODIGO DE BARRAS']
          ? String(row['CODIGO DE BARRAS'])
          : undefined,
      })),
    })

    const importProductsUseCase = setupImportProductsUseCase()
    const createdProducts = await importProductsUseCase.execute({
      companyId,
      products: parsedData.products,
    })

    return reply.status(201).send(createdProducts)
  } catch (error) {
    if (
      error instanceof FileNotUploadedError ||
      error instanceof InvalidExcelFormatError ||
      error instanceof InvalidExcelHeadersError ||
      error instanceof EmptyExcelError
    ) {
      return reply.status(400).send({
        message: error.message,
        name: error.name,
      })
    }

    throw error
  }
}

export { importProductsController, upload }
