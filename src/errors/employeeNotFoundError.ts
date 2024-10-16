class EmployeeNotFoundError extends Error {
  constructor() {
    super('Employee not found!')
  }
}

export { EmployeeNotFoundError }
