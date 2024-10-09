function generateRandomNumber(length: number): number {
  let repeat = length
  let decimalsAdd = ''

  while (repeat > 0) {
    decimalsAdd = decimalsAdd + '9'
    repeat--
  }

  const randomCode = Math.floor(Math.random() * +decimalsAdd)
  return randomCode
}

export { generateRandomNumber }
