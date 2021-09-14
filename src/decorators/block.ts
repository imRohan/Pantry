import { registerDecorator } from 'class-validator'

export function IsValidPayloadSize() {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidPayloadSize',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: any) {
          // In MB
          const MAX_PAYLOAD_SIZE = 1.44
          const _payloadString = JSON.stringify(value)
          // eslint-disable-next-line
          const _size = ~-encodeURI(_payloadString).split(/%..|./).length

          const MAX_PAYLOAD_SIZE_BYTES = MAX_PAYLOAD_SIZE * 1024000
          return _size <= MAX_PAYLOAD_SIZE_BYTES
        },
      },
    })
  }
}
