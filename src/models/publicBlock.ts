import {
  IsNotEmpty,
  IsString,
  validate,
} from 'class-validator'

class PublicBlock {

  @IsNotEmpty()
  @IsString()
  public accountUUID: string
  @IsNotEmpty()
  @IsString()
  public blockName: string

  public constructor(accountUUID: string, blockName: string) {
    this.accountUUID = accountUUID
    this.blockName = blockName
  }

  public static generateRedisKey(accountUUID: string,
                                 blockName: string): string {
    return `public:${accountUUID}::block:${blockName}`
  }

  public async store(): Promise<string> {
    await this.validate()

    const _publicKey = PublicBlock.generateRedisKey(
      this.accountUUID, this.blockName
    )

    return _publicKey
  }

  private async validate(): Promise<void> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed ${_errors}`)
    }
  }
}

export default PublicBlock
