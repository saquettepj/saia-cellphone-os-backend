class ResponseError {
  statusCode: number

  constructor(statusCode = 400) {
    this.statusCode = statusCode
  }
}

export { ResponseError }