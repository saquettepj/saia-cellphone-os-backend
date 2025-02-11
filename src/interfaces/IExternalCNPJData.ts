/* eslint-disable @typescript-eslint/no-explicit-any */
interface IPerson {
  id: string
  type: string
  name: string
  taxId: string
  age: string
}

interface IRole {
  id: number
  text: string
}

interface ICompanyMember {
  since: string
  person: IPerson
  role: IRole
}

interface INature {
  id: number
  text: string
}

interface ICompanySize {
  id: number
  acronym: string
  text: string
}

interface ISimplesOption {
  optant: boolean
  since: string | null
}

interface IStatus {
  id: number
  text: string
}

interface ICountry {
  id: number
  name: string
}

interface IAddress {
  municipality: number
  street: string
  number: string
  district: string
  city: string
  state: string
  details: string
  zip: string
  country: ICountry
}

interface IActivity {
  id: number
  text: string
}

interface IPhone {
  type: string
  area: string
  number: string
}

interface IEmail {
  ownership: string
  address: string
  domain: string
}

interface IRegistration {
  number: string
  state: string
  enabled: boolean
  statusDate: string
  status: {
    id: number
    text: string
  }
  type: {
    id: number
    text: string
  }
}

export interface IExternalCNPJData {
  updated: string
  taxId: string
  alias: string
  founded: string
  head: boolean
  company: {
    members: ICompanyMember[]
    id: number
    name: string
    equity: number
    nature: INature
    size: ICompanySize
    simples: ISimplesOption
    simei: ISimplesOption
  }
  statusDate: string
  status: IStatus
  address: IAddress
  mainActivity: IActivity
  phones: IPhone[]
  emails: IEmail[]
  sideActivities: IActivity[]
  registrations: IRegistration[]
  suframa: any[]
}
