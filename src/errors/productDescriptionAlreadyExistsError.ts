class ProductDescriptionAlreadyExistsError extends Error {
  constructor() {
    super('A product with this description already exists for this company.')
  }
}

export { ProductDescriptionAlreadyExistsError }
