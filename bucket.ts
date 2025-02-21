import { Storage } from '@google-cloud/storage'

const credentials = JSON.parse(process.env.GOOGLE_CLOUD_BUCKET_KEY!)

const storage = new Storage({ credentials })

const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET!
const bucket = storage.bucket(BUCKET_NAME)

export { storage, bucket }
