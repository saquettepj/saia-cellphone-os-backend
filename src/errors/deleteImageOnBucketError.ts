class DeleteImageOnBucketError extends Error {
  constructor() {
    super('Fail to delete images on amazon s3!')
  }
}

export { DeleteImageOnBucketError }
