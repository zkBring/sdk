class UnauthorizedError extends Error {
  code: number
  error?: string
  constructor(
    message: string,
    error?: string
  ) {
    super(`Unauthorized Error: ${message}`)
    this.code = 401
    this.error = error
  }
}

export default UnauthorizedError
