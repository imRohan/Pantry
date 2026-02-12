import { Request } from 'express'

class ClientValidator {
  private authHeader: string
  private readonly internalClientToken = process.env.INTERNAL_CLIENT_TOKEN

  public constructor(authHeader: string) {
    this.authHeader = authHeader
  }

  public static validate(request: Request): boolean {
    const _validator = ClientValidator.factory(request)
    return _validator.validate()
  }

  public static factory(request: Request): ClientValidator {
    return new ClientValidator(request.get('Authorization'))
  }

  public validate(): boolean {
    if (!this.authHeader || !this.internalClientToken) { return false }
    const [, _token] = this.authHeader.split(' ')
    return _token === this.internalClientToken
  }
}

export default ClientValidator
