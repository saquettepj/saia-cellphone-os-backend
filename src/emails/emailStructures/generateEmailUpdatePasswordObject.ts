import { IEmailMessageConfig } from '../IEmailConfig'

import { randomPasswordGenerator } from '@/utils/randomPasswordGenerator'
import { env } from '@/env'

function generateEmailUpdatePasswordObject(token: string): IEmailMessageConfig {
  const newPassword = randomPasswordGenerator()
  const resetPasswordUrl = `${env.FRONTEND_URL}/generic-list?token=${token}&password=${newPassword}`

  return {
    subject: 'Alteração de senha',
    html: `
      <div dir="ltr" lang="pt" style="background-color:#f0f0f0">
        <table width="100%" cellspacing="0" cellpadding="0" role="none" style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#f0f0f0">
            <tbody>
              <tr style="border-collapse:collapse">
                  <td valign="top" style="padding:0;Margin:0">
                    <table cellpadding="0" cellspacing="0" align="center" class="m_-4676932673795261361es-header" role="none" style="border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed!important;background-color:transparent;background-repeat:repeat;background-position:center top">
                        <tbody>
                          <tr style="border-collapse:collapse">
                              <td align="center" style="padding:0;Margin:0">
                                <table cellspacing="0" cellpadding="0" bgcolor="#333333" align="center" class="m_-4676932673795261361es-header-body" style="border-collapse:collapse;border-spacing:0px;background-color:#333333;width:600px;border-bottom:1px solid #efefef" role="none">
                                    <tbody>
                                      <tr style="border-collapse:collapse">
                                          <td align="left" bgcolor="#ffffff" style="Margin:0;padding-top:20px;padding-right:30px;padding-bottom:20px;padding-left:30px;background-color:#ffffff">
                                            <table cellpadding="0" cellspacing="0" align="left" class="m_-4676932673795261361es-left" role="none" style="border-collapse:collapse;border-spacing:0px;float:left">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td align="center" valign="top" class="m_-4676932673795261361es-m-p20b" style="padding:0;Margin:0;width:138px">
                                                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="left" style="padding:0;Margin:0">
                                                                    <p style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px"><br></p>
                                                                  </td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                      <td class="m_-4676932673795261361es-hidden" style="padding:0;Margin:0;width:10px"></td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                            <table cellpadding="0" cellspacing="0" align="left" class="m_-4676932673795261361es-left" role="none" style="border-collapse:collapse;border-spacing:0px;float:left">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td align="left" class="m_-4676932673795261361es-m-p20b" style="padding:0;Margin:0;width:238px">
                                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="center" style="padding:0;Margin:0">
                                                                    <h1 class="m_-4676932673795261361es-m-txt-c" style="Margin:0;font-family:'Arial Narrow',Arial,sans-serif;letter-spacing:0;font-size:28px;font-style:normal;font-weight:normal;line-height:28px;color:#0081ff"><strong>Saia<span style="color:#333333">SystemOS</span></strong></h1>
                                                                  </td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                            <table cellpadding="0" cellspacing="0" align="right" class="m_-4676932673795261361es-right" role="none" style="border-collapse:collapse;border-spacing:0px;float:right">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td align="left" style="padding:0;Margin:0;width:144px">
                                                        <table cellspacing="0" width="100%" cellpadding="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="left" style="padding:0;Margin:0">
                                                                    <p style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px"><br></p>
                                                                  </td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                          </td>
                                      </tr>
                                    </tbody>
                                </table>
                              </td>
                          </tr>
                        </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" align="center" class="m_-4676932673795261361es-content" role="none" style="border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed!important">
                        <tbody>
                          <tr style="border-collapse:collapse">
                              <td align="center" style="padding:0;Margin:0">
                                <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="m_-4676932673795261361es-content-body" role="none" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px">
                                    <tbody>
                                      <tr style="border-collapse:collapse">
                                          <td align="left" style="padding:30px;Margin:0">
                                            <table cellpadding="0" cellspacing="0" align="left" class="m_-4676932673795261361es-left" role="none" style="border-collapse:collapse;border-spacing:0px;float:left">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px">
                                                        <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0px;border-left:2px dashed #0081ff;border-right:2px dashed #0081ff;border-top:2px dashed #0081ff;border-bottom:2px dashed #0081ff;border-radius:12px" role="presentation">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="center" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                                                    <h2 class="m_-4676932673795261361es-m-txt-c" style="Margin:0;font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#333333">Clique no botão para aterar sua senha para:<br></h2>
                                                                    <h2 class="m_-4676932673795261361es-m-txt-c" style="Margin:0;font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#333333"><b><br></b></h2>
                                                                    <h2 class="m_-4676932673795261361es-m-txt-c" style="Margin:0;font-family:-apple-system,blinkmacsystemfont,'segoe ui',roboto,helvetica,arial,sans-serif,'apple color emoji','segoe ui emoji','segoe ui symbol';letter-spacing:0;font-size:24px;font-style:normal;font-weight:normal;line-height:28.8px;color:#333333"><b>${newPassword}</b></h2>
                                                                  </td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                          </td>
                                      </tr>
                                    </tbody>
                                </table>
                              </td>
                          </tr>
                        </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" align="center" class="m_-4676932673795261361es-content" role="none" style="border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed!important">
                        <tbody>
                          <tr style="border-collapse:collapse">
                              <td align="center" style="padding:0;Margin:0">
                                <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="m_-4676932673795261361es-content-body" role="none" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px">
                                    <tbody>
                                      <tr style="border-collapse:collapse">
                                          <td align="left" style="Margin:0;padding-right:30px;padding-left:30px;padding-top:15px;padding-bottom:15px">
                                            <table cellpadding="0" cellspacing="0" align="left" class="m_-4676932673795261361es-left" role="none" style="border-collapse:collapse;border-spacing:0px;float:left">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px">
                                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="center" style="padding:0;Margin:0"><span class="m_-4676932673795261361es-button-border" style="border-style:solid;border-color:#0081ff;background:#0081ff;border-width:2px;display:inline-block;border-radius:12px;width:auto;letter-spacing:0.5px"><a href="${resetPasswordUrl}" class="${resetPasswordUrl}-button" style="text-decoration:none!important;color:#ffffff;font-size:14px;padding:15px 30px 15px 30px;display:inline-block;background:#0081ff;border-radius:12px;font-family:arial,'helvetica neue',helvetica,sans-serif;font-weight:bold;font-style:normal;line-height:16.8px;width:auto;text-align:center;letter-spacing:0" target="_blank">Alterar Senha</a><span style="display:none">${resetPasswordUrl}</span></span></td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                          </td>
                                      </tr>
                                    </tbody>
                                </table>
                              </td>
                          </tr>
                        </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" align="center" class="m_-4676932673795261361es-footer" role="none" style="border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed!important;background-color:transparent;background-repeat:repeat;background-position:center top">
                        <tbody>
                          <tr style="border-collapse:collapse">
                              <td align="center" style="padding:0;Margin:0">
                                <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="m_-4676932673795261361es-footer-body" role="none" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px">
                                    <tbody>
                                      <tr style="border-collapse:collapse">
                                          <td align="left" style="padding:0;Margin:0;padding-right:30px;padding-left:30px;padding-top:30px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none" style="border-collapse:collapse;border-spacing:0px">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td valign="top" align="center" style="padding:0;Margin:0;width:540px">
                                                        <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#efefef" style="border-collapse:separate;border-spacing:0px;background-color:#efefef;border-radius:16px" role="presentation">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="left" bgcolor="#ffffff" class="m_-4676932673795261361es-text-2657" style="padding:0;Margin:0">
                                                                    <p class="m_-4676932673795261361es-text-mobile-size-13" style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:19.5px;letter-spacing:0;color:#333333;font-size:13px">Em caso de dúvidas entre em contato com&nbsp;<b><a style="text-decoration:underline;color:#333333;font-size:13px">${env.SUPPORT_EMAIL_USER}</a></b>.<br> Estamos em funcionamento nos seguintes horários:</p>
                                                                    <ul style="font-family:arial,'helvetica neue',helvetica,sans-serif;padding:0px 0px 0px 40px;margin-top:15px;margin-bottom:15px">
                                                                        <li style="color:#666666;margin:0px 0px 15px;font-size:14px">
                                                                          <p style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">Segunda até sexta-feira: 09:00 às 17:00</p>
                                                                        </li>
                                                                        <li style="color:#666666;margin:0px 0px 15px;font-size:14px">
                                                                          <p style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">Sabados: 09:00 às 12:00</p>
                                                                        </li>
                                                                        <li style="color:#666666;margin:0px 0px 15px;font-size:14px">
                                                                          <p style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">Feriados: Sem funcionamento</p>
                                                                        </li>
                                                                    </ul>
                                                                  </td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                          </td>
                                      </tr>
                                      <tr style="border-collapse:collapse">
                                          <td align="left" style="Margin:0;padding-right:30px;padding-left:30px;padding-top:30px;padding-bottom:30px">
                                            <table cellpadding="0" cellspacing="0" width="100%" role="none" style="border-collapse:collapse;border-spacing:0px">
                                                <tbody>
                                                  <tr style="border-collapse:collapse">
                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:540px">
                                                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                            <tbody>
                                                              <tr style="border-collapse:collapse">
                                                                  <td align="left" style="padding:0;Margin:0">
                                                                    <p style="Margin:0;font-family:arial,'helvetica neue',helvetica,sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px"><a href="http://www.saiasolutions.info" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.saiasolutions.info&amp;source=gmail&amp;ust=1736024104560000&amp;usg=AOvVaw1f05hrucW7YUb5UYbC1rg3">www.saiasolutions.info</a></p>
                                                                  </td>
                                                              </tr>
                                                            </tbody>
                                                        </table>
                                                      </td>
                                                  </tr>
                                                </tbody>
                                            </table>
                                          </td>
                                      </tr>
                                    </tbody>
                                </table>
                              </td>
                          </tr>
                        </tbody>
                    </table>
                  </td>
              </tr>
            </tbody>
        </table>
        <div class="yj6qo"></div>
        <div class="adL"> </div>
      </div>
    `,
  }
}

export { generateEmailUpdatePasswordObject }
