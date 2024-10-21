class FileNotUploadedError extends Error {
  constructor() {
    super('File not uploaded or file is invalid. Please provide a valid file!')
  }
}

export { FileNotUploadedError }
