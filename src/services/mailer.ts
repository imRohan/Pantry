// External Libs
import sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// External Files
import * as environment from './environment'
import logService from './logger'

// Logger setup
const logger = new logService('Mailer')

export async function sendWelcomeEmail(email: string, pantryID: string): Promise<void> {
  if (environment.isDevelopment()) { return }

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
}

export async function sendAccountErrorsEmail(errorMessage: string, email: string, pantryID: string): Promise<void> {
  try {
    const _email = {
      to: email,
      from: 'noreply@getpantry.cloud',
      templateId: process.env.ACCOUNT_ERRORS_EMAIL_ID,
      dynamic_template_data: { pantryID, errorMessage },
    }

    logger.info(`Sending account errors email to ${email}`)
    await sgMail.send(_email)
  } catch (error) {
    logger.error(`Sending account errors email  failed: ${error.message}`)
  }
}
