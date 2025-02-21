import { bucket } from 'bucket'

import { IBucketRepository } from './IBucketRepository'

class BucketRepository implements IBucketRepository {
  async create(fileName: string, xmlContent: string): Promise<string> {
    const file = bucket.file(fileName)

    await file.save(xmlContent, {
      contentType: 'application/xml',
    })

    return fileName
  }
}

export { BucketRepository }
