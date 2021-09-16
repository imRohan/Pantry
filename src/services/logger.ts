// External Libs
import axios from 'axios'
import pino = require('pino')
require('dotenv').config()

// External Files
import { ILogLevel } from '../interfaces/logger'
import * as environment from './environment'

class Logger {
  private logClient
  private slackWebhook = process.env.SLACK_LOG_WEBHOOK

  public constructor(name: string) {
    this.logClient = pino({
      name,
      prettyPrint: true,
    })
  }

  public logAndSlack(message: string, object?: any) {
    this.sendToClient(ILogLevel.info, message, object, true)
  }

  public info(message: string, object?: any) {
    this.sendToClient(ILogLevel.info, message, object)
  }

  public warn(message: string, object?: any) {
    this.sendToClient(ILogLevel.warn, message, object)
  }

  public error(message: string, object?: any) {
    this.sendToClient(ILogLevel.error, message, object)
  }

  // Send logs to not only the logging client, but also outbound to Slack.
  private sendToClient(
    level: ILogLevel,
    message: string,
    object?: any,
    postToSlack: boolean = false,
  ) {
    if (object && Object.keys(object).length !== 0) {
      this.logClient[level](message, object)
    } else {
      this.logClient[level](message)
    }

    if (level !== ILogLevel.info || postToSlack) {
      this.postToSlack(level, message)
    }
  }

  private async postToSlack(level: ILogLevel, message: string) {
    try {
      if (environment.isDevelopment()) { return }

      if (this.slackWebhook === undefined) {
        throw new Error('No Webhook Found')
      }

      const _time = new Date().toLocaleTimeString()
      const _message = `${_time} ${level.toUpperCase()} - ${message}`
      await axios({
        method: 'POST',
        data: { text: _message },
        url: this.slackWebhook,
      })
    } catch (error) {
      this.logClient.error(`Could not post to Slack: ${error.message}`)
    }
  }
}

export default Logger
