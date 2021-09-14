// External Files
const axios = require('axios')
const jsonView = require('vue-json-pretty').default

// Configs
const configs = require('../config.ts')

// Templates
const landingRightTemplate = require('../templates/landingRight.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

/* eslint-disable */ 
declare global {
  interface Window {
    grecaptcha: any
  }
}
/* eslint-enable */

// Constants
const API_PATH = configs.apiPath
const DOCS_PATH = configs.docsPath

const landingRight = {
  props: ['view'],
  name: 'landingRight',
  components: {
    'json-view': jsonView,
  },
  template: landingRightTemplate,
  data(): any {
    return {
      apiPath: API_PATH,
      siteKey: '6Leqqt4aAAAAAFCxWwcRO3YB6zuKKR2CGm8ACRuJ',
      systemStatus: null,
      signup: {
        email: null,
        accountName: null,
      },
      pantry: {
        id: null,
        data: null,
      },
      basket: null,
      activeBasket: null,
      showErrors: false,
      showNameField: false,
      copyPantryIdMessage: 'copy',
      accountCreationInProgress: false,
    }
  },
  filters: {
    capitalizeKey(key: boolean): string {
      if (!key) {
        return ''
      }

      const _key = key.toString()
      return(`${_key.charAt(0).toUpperCase()}${_key.slice(1).replace(/([A-Z][a-z])/g, ' $1')}`)
    },
    formatStatus(entity: string, status: number|string): any {
      if (entity === 'totalAccounts') {
        return status === -1 ? 'unknown' : status.toString()
      }
      return status ? 'Operational' : 'Down'
    },
    trim(text: any): any {
      return String(text).trim()
    },
  },
  computed: {
    isStatusPositive(): any {
      if (!this.systemStatus) {
        return false
      }

      const _statusArray = Object.values(this.systemStatus)
      const _operational = _statusArray.filter((status) => status)

      return _operational.length === _statusArray.length
    },

    accountHasErrors(): any {
      return this.pantry.data.errors && this.pantry.data.errors.length > 0
    },
  },
  methods: {
    async createNewPantry(): Promise<void> {
      const _recaptchaResponse = window.grecaptcha.getResponse()
      const { accountName, email } = this.signup

      this.accountCreationInProgress = true
      const { data } = await axios({
        method: 'POST',
        data: {
          name: accountName,
          description: 'defaultDescription',
          contactEmail: email,
          recaptchaResponse: _recaptchaResponse,
        },
        url: `${API_PATH}/pantry/create`,
      })

      this.pantry.id = data
      this.$emit('change-view', IView.created)
    },
    async fetchPantry(pantryId: string) {
      const { data } = await axios({
        method: 'GET',
        url: `${API_PATH}/pantry/${pantryId}`,
      })
      this.pantry.id = pantryId
      this.pantry.data = data
    },
    async toggleBasket(name: string) {
      if (this.activeBasket === name) {
        this.basket = null
        this.activeBasket = null
      } else {
        const { data } = await axios({
          method: 'GET',
          url: `${API_PATH}/pantry/${this.pantry.id}/basket/${name}`,
        })
        this.basket = data
        this.activeBasket = name
      }
    },
    toggleErrors() {
      this.showErrors = !this.showErrors
    },
    signupValid() {
      // eslint-disable-next-line max-len
      const _emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return _emailRegix.test(String(this.signup.email).toLowerCase())
    },
    signupNameValid(): boolean {
      return this.signup.accountName !== null
    },
    pantryIDValid() {
      return this.pantry.id !== null
    },
    createAccountButtonDisabled(): boolean {
      return !this.signupNameValid() || this.accountCreationInProgress
    },
    getStarted() {
      this.loadPantry()
      this.$emit('change-view', IView.dashboard)
    },
    goHome() {
      this.$emit('change-view', IView.home)
    },
    showDocs() {
      window.location.href = DOCS_PATH
    },
    copyPantryId() {
      this.$emit('copy-text', this.pantry.id)
      this.copyPantryIdMessage = 'copied!'
    },
    copyBasketLink(name: string) {
      const _link =  `${API_PATH}/pantry/${this.pantry.id}/basket/${name}`
      this.$emit('copy-text', _link)
      alert('Basket link copied link to clipboard!')
    },
    beginSignup() {
      this.showNameField = true
    },
    showReCaptcha() {
      window.grecaptcha.render('recaptcha', {
        sitekey: this.siteKey,
      })
    },
    destroyReCaptcha() {
      window.grecaptcha.reset()
      document.getElementsByTagName('iframe')[0].remove()
      this.recaptchaVisible = false
    },
    loadPantry() {
      if (this.pantryIDValid()) {
        this.fetchPantry(this.pantry.id)
      }
    },
    fetchURLParams() {
      if (this.view === IView.dashboard) {
        const _pantryId = decodeURIComponent(window.location.search.match(/(\?|&)pantryid\=([^&]*)/)[2])
        this.fetchPantry(_pantryId)
      }
    },
    async fetchStatus() {
      const { data } = await axios({
        method: 'GET',
        url: `${API_PATH}/system/status`,
      })
      this.systemStatus = data
    },
    getStatusString() {
      const _positiveMessage = 'All Services Operational'
      const _negativeMessage = 'Pantry is Experiencing Issues'

      const _positiveStatus = this.isStatusPositive

      return _positiveStatus ? _positiveMessage : _negativeMessage
    },
  },
  mounted() {
    this.fetchURLParams()
    this.fetchStatus()
  },
}

export = landingRight
