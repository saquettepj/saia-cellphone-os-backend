interface IEmailConfig {
  from?: string
  to: string
  subject: string
  text?: string
  html?: string
}

interface IEmailMessageConfig {
  subject: string
  text?: string
  html?: string
}

export { IEmailConfig, IEmailMessageConfig }
