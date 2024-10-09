class ImageNotFoundError extends Error {
  constructor() {
    super('Image not found!')
  }
}

export { ImageNotFoundError }
