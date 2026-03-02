import axios from 'axios'

import { IPlunkEvent } from '../interfaces/plunkEvent'
import logService from './logger'

class EventTracker {
  private apiKey: string = process.env.EVENT_TRACKING_API_KEY
  private plunkEndpoint: string = 'https://next-api.useplunk.com/v1/track'
  private logger = new logService('Event Tracker')
  private email: string
  private event: string
  private data: unknown

  public constructor(plunkEvent: IPlunkEvent) {
    const { email, event, data } = plunkEvent
    this.email = email
    this.event = event
    this.data = data
  }

  public static trackSignup(email: string, pantryID: string,
                            pantryName: string): void {
    const _event: IPlunkEvent = {
      email,
      event: 'pantry.created',
      data: { pantryID, pantryName },
    }
    void new EventTracker(_event).track()
  }


  public async track(): Promise<void> {
    try {
      await axios({
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        url: this.plunkEndpoint,
        data: { email: this.email, event: this.event, data: this.data },
      })
      this.logger.info(`Successfully tracked event ${this.event} for ${this.email}`)
    } catch (error) {
      this.logger.info(`Failed to track event ${this.event} for ${this.email}: ${error}`)
    }
  }
}

export default EventTracker
