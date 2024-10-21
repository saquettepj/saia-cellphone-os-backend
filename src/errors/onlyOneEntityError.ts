class OnlyOneEntityError extends Error {
  constructor() {
    super('Only one entity is allowed to be created!')
  }
}

export { OnlyOneEntityError }
