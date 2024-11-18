import { ILocale } from './translate'

let globalLocale: ILocale

export const setGlobalLocale = (locale: ILocale): void => {
  globalLocale = locale
}

export const getGlobalLocale = (): ILocale => {
  return globalLocale || 'pt'
}
