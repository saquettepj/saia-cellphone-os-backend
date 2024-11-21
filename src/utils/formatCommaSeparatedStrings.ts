export const validateCommaSeparatedStrings = (text: string): boolean => {
  return text.split(',').every((item) => item.trim() !== '')
}
