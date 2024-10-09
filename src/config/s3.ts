import { S3Client } from '@aws-sdk/client-s3'

import { env } from '../env'

interface IBucketParams {
  Bucket: string
  Key: string
  Body?: Buffer | undefined
  ContentType?: string
}

interface IBucketParamsToDeleteObjects {
  Bucket: string
  Delete: {
    Objects: { Key: string }[]
    Quiet?: boolean
  }
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: env.AWS_BUCKET_ACCESS_USER_KEY,
    secretAccessKey: env.AWS_BUCKET_ACCESS_USER_PASS,
  },
  region: env.AWS_BUCKET_REGION,
})

export { s3, IBucketParams, IBucketParamsToDeleteObjects }
