interface IMiddlewareError {
  message: string
  statusCode?: number
}

class MiddlewareError extends Error {
  public readonly statusCode: number
  public readonly message: string

  constructor(info: IMiddlewareError) {
    super()
    this.message = info.message
    this.statusCode = info.statusCode || 400
  }
}

export { MiddlewareError }
