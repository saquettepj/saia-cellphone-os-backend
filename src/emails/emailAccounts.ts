interface IEmailAccount {
  user: string
  pass?: string
}

const supportEmailAccount: IEmailAccount = {
  user: 'thigo.saquette@gmail.com',
}

const autoEmailAccount: IEmailAccount = {
  user: 'teste.saquette@gmail.com',
  pass: 'zsqxpvrzeywmjnxi',
}

export { supportEmailAccount, autoEmailAccount }
