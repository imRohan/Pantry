// External Libs
import pino = require('pino')
require('dotenv').config()

// External Files
import { ILogLevel } from '../interfaces/logger'

class Logger {
  private logClient

  public constructor(name: string) {
    this.logClient = this.buildLogClient(name)
  }

  public logAndSlack(message: string, object?: any): void {
    this.sendToClient(ILogLevel.info, message, object)
  }

  public info(message: string, object?: any): void {
    this.sendToClient(ILogLevel.info, message, object)
  }

  public warn(message: string, object?: any): void {
    this.sendToClient(ILogLevel.warn, message, object)
  }

  public error(message: string, object?: any): void {
    this.sendToClient(ILogLevel.error, message, object)
  }

  private buildLogClient(name: string) {
    return pino({ name, prettyPrint: true })
  }

  // Send logs to not only the logging client, but also outbound to Slack.
  private sendToClient(
    level: ILogLevel,
    message: string,
    object?: any
  ) {
    if (object && Object.keys(object).length !== 0) {
      this.logClient[level](message, object)
    } else {
      this.logClient[level](message)
    }
  }
}

export default Logger
