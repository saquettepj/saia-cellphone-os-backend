import { PutObjectCommandOutput } from '@aws-sdk/client-s3'

import { IBucketParams } from '@/config/s3'

interface IBucketRepository {
  delete(imageNames: string[]): Promise<void>
  put(putParams: IBucketParams): Promise<PutObjectCommandOutput>
}

export { IBucketRepository }
