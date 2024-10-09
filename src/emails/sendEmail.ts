import nodemailer from 'nodemailer'

import { IEmailConfig } from './IEmailConfig'

import { env } from '@/env'

function sendEmail(mailConfiguration: IEmailConfig) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.AUTOMATIC_EMAIL_USER,
      pass: env.AUTOMATIC_EMAIL_PASS,
    },
  })

  return transporter.sendMail(mailConfiguration)
}

export { sendEmail }
