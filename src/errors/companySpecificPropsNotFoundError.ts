class CompanySpecificPropsNotFoundError extends Error {
  constructor(private propsName: string) {
    super(`Company ${propsName} not found!`)
  }
}

export { CompanySpecificPropsNotFoundError }
