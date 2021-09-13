// External Libs
import axios from 'axios'
require('dotenv').config()

// External Files
import * as environment from './environment'
import logService from './logger'

// Logger setup
const logger = new logService('ReCaptcha')

const _baseURL = 'https://www.google.com/recaptcha/api'

export async function verify(response: string): Promise<boolean> {
  if (environment.isDevelopment()) { return true }

  try {
    const { data } = await axios({
      method: 'POST',
      params: {
        response,
        secret: process.env.RECAPTCHA_SECRET_KEY,
      },
      url: `${_baseURL}/siteverify`,
    })

    const { success } = data
    return success
  } catch (error) {
    logger.error(`Error when attempting to verify recaptcha: ${error.message}`)
    return false
  }
}
