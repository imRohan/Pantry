import axios from 'axios'

import * as environment from './environment'
import logService from './logger'

const logger = new logService('Mailer')

class Mailer {
  private static apiKey: string = process.env.MAILER_API_KEY
  private static plunkEndpoint: string = 'https://next-api.useplunk.com/v1/send'
  private static welcomeEmailId = process.env.WELCOME_EMAIL_ID

  public static async sendWelcomeEmail(email: string, pantryID: string,
                                       pantryName: string): Promise<void> {
    if (environment.isDevelopment()) { return }

    try {
      await axios({
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        url: this.plunkEndpoint,
        data: {
          to: email,
          template: this.welcomeEmailId,
          data: { pantryID, pantryName },
        },
      })

      logger.info(`Sent a welcome email to ${email}`)
    } catch (error) {
      logger.error(`Sending welcome email failed: ${error.message}`)
    }
  }
}

export default Mailer
