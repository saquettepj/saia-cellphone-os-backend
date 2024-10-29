class OrderItemNotFoundError extends Error {
  constructor() {
    super('OrderItem not found!')
    this.name = 'OrderItemNotFoundError'
  }
}

export { OrderItemNotFoundError }
