// External Libs
import pino = require('pino')

class Logger {
  private logClient

  constructor(name: string) {
    this.logClient = pino({
      name,
      prettyPrint: true,
    })
  }

  public info(message: string, object?: any) {
    this.sendToClient('info', message, object)
  }

  public warn(message: string, object?: any) {
    this.sendToClient('warn', message, object)
  }

  public error(message: string, object?: any) {
    this.sendToClient('error', message, object)
  }

  private sendToClient(level: string, message: string, object?: any) {
    if (object) {
      this.logClient[level](message, object)
    } else {
      this.logClient[level](message)
    }
  }
}

export = Logger
