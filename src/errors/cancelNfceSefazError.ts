class CancelNfceSefazError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NFCE_CANCEL_ERROR'
  }
}

export { CancelNfceSefazError }
