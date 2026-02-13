import axios from 'axios'

import logService from './logger'

const logger = new logService('CRM')

class Crm {
  public static  readonly baseID: string = process.env.AIRTABLE_BASE_ID
  public static  readonly tableID: string = process.env.AIRTABLE_TABLE_ID
  public static  readonly apiToken: string = process.env.AIRTABLE_API_TOKEN
  public static  readonly airtableBaseURL: string = 'https://api.airtable.com/v0'

  public static async addNewUser(email: string, pantryId: string): Promise<void> {
    try {
      const _url = `${this.airtableBaseURL}/${this.baseID}/${this.tableID}`
      await axios({
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        url: _url,
        data: {
          records: [
            {
              fields: {
                Email: email,
                PantryId: pantryId,
                DateCreated: new Date(),
              },
            },
          ],
        },
      })

      logger.info(`Saved user to table ${this.tableID}`)
    } catch (error) {
      logger.error(`Error when saving new user: ${error.message}`)
    }
  }
}

export default Crm
