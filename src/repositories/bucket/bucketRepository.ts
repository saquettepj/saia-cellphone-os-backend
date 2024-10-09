import {
  DeleteObjectsCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3'

import { IBucketRepository } from './IBucketRepository'

import { IBucketParams, IBucketParamsToDeleteObjects, s3 } from '@/config/s3'
import { env } from '@/env'
import { DeleteImageOnBucketError } from '@/errors/deleteImageOnBucketError'
import { PutImageOnBucketError } from '@/errors/putImageOnBucketError'

class BucketRepository implements IBucketRepository {
  async put(putParams: IBucketParams): Promise<PutObjectCommandOutput> {
    try {
      const putCommand = new PutObjectCommand(putParams)
      const result = await s3.send(putCommand)
      return result
    } catch (error) {
      throw new PutImageOnBucketError()
    }
  }

  async delete(imageNames: string[]) {
    const formattedImageNames: { Key: string }[] = imageNames.map(
      (imageName) => ({ Key: imageName }),
    )

    try {
      const deleteParams: IBucketParamsToDeleteObjects = {
        Bucket: env.AWS_BUCKET_NAME,
        Delete: {
          Objects: formattedImageNames,
          Quiet: false,
        },
      }
      const deleteCommand = new DeleteObjectsCommand(deleteParams)
      await s3.send(deleteCommand)
    } catch (error) {
      throw new DeleteImageOnBucketError()
    }
  }
}

export { BucketRepository }
