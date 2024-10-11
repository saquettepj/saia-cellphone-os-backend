import { createHash } from 'crypto'

import sharp from 'sharp'
import { Company } from '@prisma/client'

import { IBucketRepository } from '@/repositories/bucket/IBucketRepository'
import { IBucketParams } from '@/config/s3'
import { ICompanyRepository } from '@/repositories/company/ICompanyRepository'
import { env } from '@/env'
import { UploadedContentEmptyError } from '@/errors/uploadedContentEmptyError'
import { UploadedContentWrongFormatError } from '@/errors/uploadedContentWrongFormatError'

interface IUploadCompanyImageUseCaseRequest {
  id: string
  buffer?: Buffer
  contentType: string
}

interface IUploadCompanyImageUseCaseReturn {
  company: Company | null
}

class UploadCompanyImageUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private bucketRepository: IBucketRepository,
  ) {}

  async execute({
    id,
    buffer,
    contentType,
  }: IUploadCompanyImageUseCaseRequest) {
    if (!buffer) {
      throw new UploadedContentEmptyError()
    }

    if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
      throw new UploadedContentWrongFormatError()
    }

    let fileContent

    if (buffer) {
      fileContent = await sharp(buffer)
        .resize({ height: 1920, width: 1080, fit: 'contain' })
        .toBuffer()
    }

    const hashKey = 'companyImageUrl'

    const imageNameHash = await createHash('md5')
      .update(id + hashKey)
      .digest('hex')

    const putParams: IBucketParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: imageNameHash,
      Body: fileContent,
      ContentType: contentType,
    }

    await this.bucketRepository.put(putParams)

    const updateResult = await this.companyRepository.updateById(id, {
      companyImageUrl: `https://${env.AWS_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${putParams.Key}`,
    })

    const result: IUploadCompanyImageUseCaseReturn = {
      company: updateResult,
    }

    return result
  }
}

export { UploadCompanyImageUseCase, IUploadCompanyImageUseCaseRequest }
