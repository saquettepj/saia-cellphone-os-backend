interface IMiddlewareError {
  message: string
  statusCode?: number
  name?: string
}

class MiddlewareError extends Error {
  public readonly statusCode: number
  public readonly message: string
  public readonly name: string

  constructor(info: IMiddlewareError) {
    super()
    this.message = info.message
    this.statusCode = info.statusCode || 400
    this.name = info.name || ''
  }
}

export { MiddlewareError }
