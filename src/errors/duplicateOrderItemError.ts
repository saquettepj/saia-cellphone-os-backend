class DuplicateOrderItemError extends Error {
  constructor() {
    super('OrderItem with this productId already exists in the order!')
  }
}

export { DuplicateOrderItemError }
