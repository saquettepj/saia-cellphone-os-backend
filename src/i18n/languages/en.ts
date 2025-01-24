import { TranslationKeysEnum } from '../enums/TranslationKeysEnum'

export const en = {
  // #################### Errors #######################
  [TranslationKeysEnum.ERROR_ACCESS_TOKEN_NOT_FOUND]: 'Access token not found!',
  [TranslationKeysEnum.ERROR_ADDRESS_NOT_FOUND]: 'Address not found!',
  [TranslationKeysEnum.ERROR_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID]:
    'An AccessToken already has a company and cannot be updated!',
  [TranslationKeysEnum.ERROR_CLIENT_HAS_ADDRESS]:
    'Address already exists for this client!',
  [TranslationKeysEnum.ERROR_CLIENT_NOT_FOUND]: 'Client not found!',
  [TranslationKeysEnum.ERROR_SUPPLIER_NOT_FOUND]: 'Supplier not found!',
  [TranslationKeysEnum.ERROR_SERVICE_NOT_FOUND]: 'Service not found!',
  [TranslationKeysEnum.ERROR_COMPANY_CNPJ_ALREADY_EXISTS]:
    'This CNPJ already exists!',
  [TranslationKeysEnum.ERROR_CNPJ_ALREADY_EXISTS]: 'This CNPJ already exists!',
  [TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS]:
    'CNPJ or password incorrect!',
  [TranslationKeysEnum.ERROR_COMPANY_CREDENTIALS_FORGOT_PASSWORD]:
    'CNPJ or email incorrect!',
  [TranslationKeysEnum.ERROR_COMPANY_HAS_ADDRESS]:
    'Address already exists for this company!',
  [TranslationKeysEnum.ERROR_COMPANY_NOT_FOUND]: 'Company not found!',
  [TranslationKeysEnum.ERROR_EMAIL_NOT_FOUND]: 'Email not found!',
  [TranslationKeysEnum.ERROR_COMPANY_UPDATE_PASSWORD]: 'Password change error!',
  [TranslationKeysEnum.ERROR_CPF_ALREADY_EXISTS]: 'This CPF already exists!',
  [TranslationKeysEnum.ERROR_DELETING]: 'Deleting error!',
  [TranslationKeysEnum.ERROR_UPDATING]: 'Updating error!',
  [TranslationKeysEnum.ERROR_SYSTEM_CONFIG_NOT_FOUND]:
    'System configuration not found.',
  [TranslationKeysEnum.ERROR_DUPLICATE_ORDER_ITEM]:
    'There are duplicate items in the order!',
  [TranslationKeysEnum.ERROR_EMAIL_ALREADY_CONFIRMED]:
    'Email already confirmed!',
  [TranslationKeysEnum.ERROR_EMAIL_ALREADY_EXISTS]:
    'This email already exists!',
  [TranslationKeysEnum.ERROR_EMPLOYEE_NOT_FOUND]: 'Employee not found!',
  [TranslationKeysEnum.ERROR_FILE_NOT_UPLOADED]:
    'File not uploaded or file is invalid. Please provide a valid file!',
  [TranslationKeysEnum.ERROR_INVALID_EMAIL_CONFIRMATION_CODE]:
    'Invalid email confirmation code!',
  [TranslationKeysEnum.ERROR_NFE_DATA_NOT_FOUND]: 'NFe data not found!',
  [TranslationKeysEnum.ERROR_ONLY_ONE_ENTITY]:
    'Only one entity is allowed to be created!',
  [TranslationKeysEnum.ERROR_ORDER_ITEM_NOT_FOUND]: 'OrderItem not found!',
  [TranslationKeysEnum.ERROR_ORDER_NOT_FOUND]: 'Order not found!',
  [TranslationKeysEnum.ERROR_PASSWORD_CONFIRMATION_DIFFERENT]:
    'New password is different from password confirmation!',
  [TranslationKeysEnum.ERROR_PRODUCT_NOT_FOUND]: 'Product not found!',
  [TranslationKeysEnum.ERROR_REQUEST_PARAMS_NOT_REACHED]:
    'Route parameters not reached!',
  [TranslationKeysEnum.ERROR_THIS_ACCESS_TOKEN_ALREADY_HAS_COMPANY_ID]:
    'This AccessToken already has a company and cannot be updated!',
  [TranslationKeysEnum.ERROR_PRODUCT_DESCRIPTION_ALREADY_EXISTS]:
    'A product with this description already exists for this company.',
  [TranslationKeysEnum.ERROR_REQUEST_NOT_ALLOWED]: 'Request not allowed!',
  [TranslationKeysEnum.ERROR_TOKEN_MISSING]: 'Token missing!',
  [TranslationKeysEnum.ERROR_INVALID_TOKEN]: 'Invalid token!',
  [TranslationKeysEnum.ERROR_PREREQUISITE_EMAIL_CONFIRMATION]:
    'Prerequisite for this action: email confirmation.',
  [TranslationKeysEnum.ERROR_PRODUCTS_NOT_FOUND]:
    'One or more products not found!',
  [TranslationKeysEnum.ERROR_PRODUCTS_NOT_BELONG_TO_COMPANY]:
    'One or more products do not belong to this company!',
  [TranslationKeysEnum.ERROR_VALIDATION]: 'Validation error!',
  [TranslationKeysEnum.ERROR_INVALID_JSON]: 'Invalid JSON format.',
  [TranslationKeysEnum.ERROR_NOT_FOUND]: 'Not found!',
  [TranslationKeysEnum.ERROR_LINK_EXPIRED]: 'Link has expired!',
  [TranslationKeysEnum.ERROR_PAYMENT]: 'Payment system problem!',
  [TranslationKeysEnum.ERROR_UNKNOWN]: 'Unknown error!',
  [TranslationKeysEnum.ERROR_LAST_PAYMENT_NOT_FOUND]: 'Last payment not found!',
  [TranslationKeysEnum.ERROR_CLIENT_NAME_NOT_FOUND_BY_CPF]:
    'Client name not found by CPF!',
  [TranslationKeysEnum.ERROR_SEND_EMAIL]: 'Erro ao enviar o e-mail!',
  [TranslationKeysEnum.ERROR_NOT_ALLOWED_TO_DELETE_ITEM_AFTER_24HRS]:
    'Deletion of the item is not allowed after 24 hours from the creation date!',

  // #################### GLOBALS #######################
  [TranslationKeysEnum.PAYMENT_DESCRIPTION_MONTHLY_PLAN]:
    'Payment for using the SaiaSystemOS app - Monthly plan (1-month subscription)',
}
