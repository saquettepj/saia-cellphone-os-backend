class UploadedContentWrongFormatError extends Error {
  constructor() {
    super('Uploaded content on wrong format, request .png or .jpeg type!')
  }
}

export { UploadedContentWrongFormatError }
