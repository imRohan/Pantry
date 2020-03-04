// External Libs
import pino = require('pino')
import axios from 'axios'
require('dotenv').config()

class Logger {
  private logClient
  private slackWebhook = process.env.SLACK_LOG_WEBHOOK

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

  // Send logs to not only the logging client, but also outbound to Slack.
  private sendToClient(level: string, message: string, object?: any) {
    if (object) {
      this.logClient[level](message, object)
    } else {
      this.logClient[level](message)
    }

    this.postToSlack(level, message)
  }

  private async postToSlack(level: string, message: string) {
    try {
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

export = Logger
