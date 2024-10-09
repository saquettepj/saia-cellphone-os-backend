class RequestParamsNotReachedError extends Error {
  constructor() {
    super('Route parameters not reached!')
  }
}

export { RequestParamsNotReachedError }
