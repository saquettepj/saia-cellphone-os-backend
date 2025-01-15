import { IEmailMessageConfig } from '../IEmailConfig'

function generateSupportEmailByClient(
  textMessage: string,
  companyCNPJ: string,
  companyName: string,
  companyEmail: string,
): IEmailMessageConfig {
  return {
    subject: `${companyCNPJ} - ${companyName}`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${companyCNPJ} - ${companyName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
              color: #333;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 20px;
              color: #007acc;
              margin-bottom: 10px;
            }
            p {
              margin: 10px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Mensagem de Suporte</h1>
            <p><strong>Empresa:</strong> ${companyName}</p>
            <p><strong>CNPJ:</strong> ${companyCNPJ}</p>
            <p><strong>E-mail:</strong> ${companyEmail}</p>
            <p><strong>Mensagem:</strong></p>
            <p>${textMessage}</p>
            <div class="footer">
              <p>Este é um e-mail automático. Por favor, não responda diretamente a esta mensagem.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export { generateSupportEmailByClient }
