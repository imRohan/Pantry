// External Files
const axios = require('axios')

// Configs
const configs = require('../config.ts')

// Templates
const homeTemplate = require('../templates/home.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

// Components
const initialSignup = require('./initialSignup.ts')
const finishSignup = require('./finishSignup.ts')
const features = require('./features.ts')
const example = require('./example.ts')
const stats = require('./stats.ts')
const quote = require('./quote.ts')
const banner = require('./banner.ts')

/* eslint-disable */ 
declare global {
  interface Window {
    grecaptcha: any
  }
}
/* eslint-enable */

// Constants
const API_PATH = configs.apiPath

const home = {
  name: 'home',
  template: homeTemplate,
  components: {
    initialSignup,
    finishSignup,
    features,
    example,
    stats,
    quote,
    banner,
  },
  data(): any {
    return {
      email: null,
      name: null,
      finishOnboarding: false,
      siteKey: '6Leqqt4aAAAAAFCxWwcRO3YB6zuKKR2CGm8ACRuJ',
      promo: {
        emoji: '💪',
        snippet: 'Integrate Pantry using our SDK!',
        title: 'Speed up your development by using one of our many SDKs!',
      },
    }
  },
  methods: {
    beginSignup(email: string) {
      this.email = email
      this.finishOnboarding = true
    },
    beginRegistration(name: string) {
      this.name = name
      this.createNewPantry()
    },
    showReCaptcha() {
      window.grecaptcha.render('recaptcha', {
        sitekey: this.siteKey,
      })
    },
    async createNewPantry(): Promise<void> {
      const _recaptchaResponse = window.grecaptcha.getResponse()

      this.accountCreationInProgress = true
      const { data } = await axios({
        method: 'POST',
        data: {
          name: this.name,
          description: 'defaultDescription',
          contactEmail: this.email,
          recaptchaResponse: _recaptchaResponse,
        },
        url: `${API_PATH}/pantry/create`,
      })

      this.$emit('account-created', data)
    },
    bannerCTAClicked(): void {
      this.$emit('change-view', IView.sdk)
    },
  },
}

export = home
