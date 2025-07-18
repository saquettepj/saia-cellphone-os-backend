const states = [
  { id: 12, sigla: 'AC', nome: 'Acre' },
  { id: 27, sigla: 'AL', nome: 'Alagoas' },
  { id: 13, sigla: 'AM', nome: 'Amazonas' },
  { id: 16, sigla: 'AP', nome: 'Amapá' },
  { id: 29, sigla: 'BA', nome: 'Bahia' },
  { id: 23, sigla: 'CE', nome: 'Ceará' },
  { id: 53, sigla: 'DF', nome: 'Distrito Federal' },
  { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
  { id: 52, sigla: 'GO', nome: 'Goiás' },
  { id: 21, sigla: 'MA', nome: 'Maranhão' },
  { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
  { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
  { id: 15, sigla: 'PA', nome: 'Pará' },
  { id: 25, sigla: 'PB', nome: 'Paraíba' },
  { id: 26, sigla: 'PE', nome: 'Pernambuco' },
  { id: 22, sigla: 'PI', nome: 'Piauí' },
  { id: 41, sigla: 'PR', nome: 'Paraná' },
  { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
  { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
  { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
  { id: 11, sigla: 'RO', nome: 'Rondônia' },
  { id: 14, sigla: 'RR', nome: 'Roraima' },
  { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
  { id: 28, sigla: 'SE', nome: 'Sergipe' },
  { id: 35, sigla: 'SP', nome: 'São Paulo' },
  { id: 17, sigla: 'TO', nome: 'Tocantins' },
]

export function returnStateCode(uf: string): string {
  const state = states.find((e) => e.sigla.toUpperCase() === uf.toUpperCase())
  return state && state.id ? state.id.toString() : ''
}
