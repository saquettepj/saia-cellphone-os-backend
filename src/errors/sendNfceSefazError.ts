class SendNfceSefazError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NFCE_SEND_ERROR'
  }
}

export { SendNfceSefazError }
