interface IRegiao {
  id: number
  sigla: string
  nome: string
}

interface IUF {
  id: number
  sigla: string
  nome: string
  regiao: IRegiao
}

interface IMesorregiao {
  id: number
  nome: string
  UF: IUF
}

interface IMicrorregiao {
  id: number
  nome: string
  mesorregiao: IMesorregiao
}

interface IRegiaoIntermediaria {
  id: number
  nome: string
  UF: IUF
}

interface IRegiaoImediata {
  id: number
  nome: string
  'regiao-intermediaria': IRegiaoIntermediaria
}

export interface IMunicipio {
  id: number
  nome: string
  microrregiao: IMicrorregiao
  'regiao-imediata': IRegiaoImediata
}
