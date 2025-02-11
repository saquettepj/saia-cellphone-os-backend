import { TranslationKeysEnum } from '../enums/TranslationKeysEnum'

export const ptBR = {
  // #################### Errors #######################
  [TranslationKeysEnum.ERROR_ACCESS_TOKEN_NOT_FOUND]:
    'Token de acesso não encontrado!',
  [TranslationKeysEnum.ERROR_ADDRESS_NOT_FOUND]: 'Endereço não encontrado!',
  [TranslationKeysEnum.ERROR_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID]:
    'Um AccessToken já possui uma empresa e não pode ser atualizado!',
  [TranslationKeysEnum.ERROR_CLIENT_HAS_ADDRESS]:
    'Endereço já existe para este cliente!',
  [TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND]: 'Cliente não encontrado!',
  [TranslationKeysEnum.ERROR_SUPPLIER_NOT_FOUND]: 'Fornecedor não encontrado!',
  [TranslationKeysEnum.ERROR_SERVICE_NOT_FOUND]:
    'Serviço técnico não encontrado!',
  [TranslationKeysEnum.ERROR_COMPANY_CNPJ_ALREADY_EXISTS]:
    'Este CNPJ já existe!',
  [TranslationKeysEnum.ERROR_CNPJ_ALREADY_EXISTS]: 'Este CNPJ já existe!',
  [TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS]: 'CNPJ ou senha incorretos!',
  [TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS_FORGOT_PASSWORD]:
    'CNPJ ou email incorretos!',
  [TranslationKeysEnum.ERROR_COMPANY_HAS_ADDRESS]:
    'Endereço já existe para esta empresa!',
  [TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND]: 'Empresa não encontrada!',
  [TranslationKeysEnum.ERROR_EMAIL_NOT_FOUND]: 'Email não encontrado!',
  [TranslationKeysEnum.ERROR_COMPANY_UPDATE_PASSWORD]:
    'Erro ao alterar a senha!',
  [TranslationKeysEnum.ERROR_CPF_ALREADY_EXISTS]: 'Este CPF já existe!',
  [TranslationKeysEnum.ERROR_DELETING]: 'Erro ao excluir!',
  [TranslationKeysEnum.ERROR_UPDATING]: 'Erro ao atualizar!',
  [TranslationKeysEnum.ERROR_SYSTEM_CONFIG_NOT_FOUND]:
    'Configuração do sistema não encontrada.',
  [TranslationKeysEnum.ERROR_DUPLICATE_ORDER_ITEM]:
    'Existem itens duplicados na ordem!',
  [TranslationKeysEnum.ERROR_EMAIL_ALREADY_CONFIRMED]: 'E-mail já confirmado!',
  [TranslationKeysEnum.ERROR_EMAIL_ALREADY_EXISTS]: 'Este e-mail já existe!',
  [TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND]: 'Funcionário não encontrado!',
  [TranslationKeysEnum.ERROR_FILE_NOT_UPLOADED]:
    'Arquivo não enviado ou arquivo inválido. Por favor, forneça um arquivo válido!',
  [TranslationKeysEnum.ERROR_INVALID_EMAIL_CONFIRMATION_CODE]:
    'Código de confirmação de e-mail inválido!',
  [TranslationKeysEnum.ERROR_ONLY_ONE_ENTITY]:
    'Apenas uma entidade pode ser criada!',
  [TranslationKeysEnum.ERROR_ORDER_ITEM_NOT_FOUND]:
    'Item de pedido não encontrado!',
  [TranslationKeysEnum.ERROR_ORDER_NOT_FOUND]: 'Pedido não encontrado!',
  [TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND]: 'Produto não encontrado!',
  [TranslationKeysEnum.ERROR_PASSWORD_CONFIRMATION_DIFFERENT]:
    'A nova senha é diferente da confirmação da senha!',
  [TranslationKeysEnum.ERROR_REQUEST_PARAMS_NOT_REACHED]:
    'Parâmetros da rota não alcançados!',
  [TranslationKeysEnum.ERROR_THIS_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID]:
    'Este AccessToken já possui uma empresa e não pode ser atualizado!',
  [TranslationKeysEnum.ERROR_PRODUCT_DESCRIPTION_ALREADY_EXISTS]:
    'Um produto com esta descrição já existe para esta empresa.',
  [TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED]: 'Solicitação não permitida!',
  [TranslationKeysEnum.ERROR_TOKEN_MISSING]: 'Token ausente!',
  [TranslationKeysEnum.ERROR_INVALID_TOKEN]: 'Token inválido!',
  [TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION]:
    'Pré-requisito para esta ação: confirmação de e-mail.',
  [TranslationKeysEnum.ERROR_PRODUCTS_NOT_FOUND]:
    'Um ou mais produtos não encontrados!',
  [TranslationKeysEnum.ERROR_PRODUCTS_NOT_BELONG_TO_COMPANY]:
    'Um ou mais produtos não pertencem a esta empresa!',
  [TranslationKeysEnum.ERROR_VALIDATION]: 'Erro de validação!',
  [TranslationKeysEnum.ERROR_INVALID_JSON]: 'Formato JSON inválido.',
  [TranslationKeysEnum.ERROR_NOT_FOUND]: 'Não encontrado!',
  [TranslationKeysEnum.ERROR_LINK_EXPIRED]: 'Link expirou!',
  [TranslationKeysEnum.ERROR_PAYMENT]: 'Erro no sistema de pagamento!',
  [TranslationKeysEnum.ERROR_UNKNOWN]: 'Erro desconhecido!',
  [TranslationKeysEnum.ERROR_LAST_PAYMENT_NOT_FOUND]:
    'Último pagamento não encontrado!',
  [TranslationKeysEnum.ERROR_CLIENT_NAME_NOT_FOUND_BY_CPF]:
    'Nome do cliente não encontrado pelo CPF!',
  [TranslationKeysEnum.ERROR_SEND_EMAIL]: 'Error sending the email!',
  [TranslationKeysEnum.ERROR_NOT_ALLOWED_TO_DELETE_ITEM_AFTER_24HRS]:
    'Não permitido a exclusão após 24hrs da data de criação!',
  [TranslationKeysEnum.ERROR_INVALID_FILE]:
    'Arquivo inválido. Deve ser um certificado .pfx!',
  [TranslationKeysEnum.ERROR_INVOICE_CONFIGURATION_REQUIRED]:
    'A configuração da nota fiscal é obrigatória, com dúvida? Vá para a aba de ajuda!',
  [TranslationKeysEnum.ERROR_FETCHING_COMPANY_DATA]:
    'Erro ao buscar dados da empresa, tente novamente mais tarde!',
  [TranslationKeysEnum.ERROR_CLIENT_ADDRESS_NOT_FOUND]:
    'Endereço do cliente não encontrado!',
  [TranslationKeysEnum.ERROR_INVALID_CERTIFICATE]:
    'Certificado ou senha do certificado inválido!',
  [TranslationKeysEnum.ERROR_SEFAZ_UNSTABLE]:
    'Sistema Sefaz com instabilidade, tente novamente mais tarde!',
  [TranslationKeysEnum.ERROR_NFE_CONFIGURATION_NOT_FOUND]:
    'Nenhuma configuração de NF-e encontrada para a empresa!',
  [TranslationKeysEnum.ERROR_SEFAZ_INSTABILITY]: 'Instabilidade no SEFAZ!',
  [TranslationKeysEnum.ERROR_INVOICE_DATA_NOT_FOUND]:
    'Dados da nota fiscal não encontrados!',
  [TranslationKeysEnum.ERROR_ORDER_ALREADY_HAS_INVOICE]:
    'Pedido já possui nota fiscal!',

  // #################### GLOBALS #######################
  [TranslationKeysEnum.PAYMENT_DESCRIPTION_MONTHLY_PLAN]:
    'Pagamento referente ao uso do aplicativo SaiaSystemOS - Plano mensal (1 mês de assinatura)',
}
