// External Libs
import AirTable = require('airtable')

// External Files
import logService from './logger'

// Logger setup
const logger = new logService('AirTable')

export async function addNewUser(email: string, pantryID: string): Promise<void> {
  try {
    const _table = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)

    await _table('Users').create({
      Email: email,
      PantryId: pantryID,
      DateCreated: new Date(),
    })

    logger.info('Saved user details')
  } catch (error) {
    logger.error(`Error when adding new user: ${error.message}`)
  }
}
