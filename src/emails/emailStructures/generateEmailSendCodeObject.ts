import { IEmailMessageConfig } from '../IEmailConfig'

import { env } from '@/env'

function generateEmailSendCodeObject(code: number): IEmailMessageConfig {
  return {
    subject: 'Resgate seu código de verificação',
    html: `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <main>
          <h3>Olá, bom te encontrar novamente!</h3>
          <h2>Seu código de verificação é: <b>${code}</b></h2>
      </main>
      <p>Em caso de dúvidas entre em contato com <b><a>${env.SUPPORT_EMAIL_USER}</a></b>.<br/>Estamos em funcionamento nos seguintes horários:
      </p>
      <li>Segunda até sexta-feira: 09:00 às 17:00</li>
      <li>Sabados: 09:00 às 12:00</li>
      <li>Feriados: Sem funcionamento</li>
    </body>
  </html>`,
  }
}

export { generateEmailSendCodeObject }
