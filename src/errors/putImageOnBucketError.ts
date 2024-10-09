class PutImageOnBucketError extends Error {
  constructor() {
    super('Fail to put images on amazon s3!')
  }
}

export { PutImageOnBucketError }
