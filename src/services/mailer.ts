// External Libs
import sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// External Files
import logService = require('./logger')

// Logger setup
const logger = new logService('Mailer')

const mailer = {
  async sendWelcomeEmail(email: string, pantryID: string): Promise<void> {
    try {
      const _email = {
        to: email,
        from: 'noreply@getpantry.cloud',
        templateId: process.env.WELCOME_EMAIL_ID,
        dynamic_template_data: { pantryID },
      }

      logger.info(`Sending welcome email to ${email}`)
      await sgMail.send(_email)
    } catch (error) {
      logger.error(`Sending welcome email failed: ${error.message}`)
    }
  },
}

export = mailer
