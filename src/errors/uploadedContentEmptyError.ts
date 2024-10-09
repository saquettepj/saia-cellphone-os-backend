class UploadedContentEmptyError extends Error {
  constructor() {
    super('Upload content is empty!')
  }
}

export { UploadedContentEmptyError }
