import { Storage } from '@google-cloud/storage'

const decodedCredentials = Buffer.from(
  process.env.GOOGLE_CLOUD_BUCKET_KEY!,
  'base64',
).toString('utf-8')
const credentials = JSON.parse(decodedCredentials)

const storage = new Storage({ credentials })

const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET!
const bucket = storage.bucket(BUCKET_NAME)

export { storage, bucket }
