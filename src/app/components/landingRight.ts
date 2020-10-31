// External Files
const axios = require('axios')
const jsonView = require('vue-json-pretty').default

// Configs
const configs = require('../config.ts')

// Templates
const landingRightTemplate = require('../templates/landingRight.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

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
  data() {
    return {
      apiPath: API_PATH,
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
    }
  },
  filters: {
    capitalizeKey(key) {
      if (!key) { return '' }

      const _key = key.toString()
      return(`${_key.charAt(0).toUpperCase()}${_key.slice(1)}`)
    },
    trim(text) {
      return String(text).trim()
    },
  },
  computed: {
    isStatusPositive() {
      if (!this.systemStatus) { return false }

      const _statusArray = Object.values(this.systemStatus)
      const _operational = _statusArray.filter((status) => {
        return status
      })

      return _operational.length === _statusArray.length
    },
  },
  methods: {
    async createNewPantry() {
      const { accountName, email } = this.signup
      const { data } = await axios({
        method: 'POST',
        data: {
          name: accountName,
          description: 'defaultDescription',
          contactEmail: email,
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
      const _emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return _emailRegix.test(String(this.signup.email).toLowerCase());
    },
    signupNameValid() {
      return this.signup.accountName !== null
    },
    pantryIDValid() {
      return this.pantry.id !== null
    },
    getStarted() {
      this.fetchPantry(this.pantry.id)
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
    enterPantryName() {
      if (this.signupValid()) {
        this.showNameField = true
      }
    },
    loadPantry() {
      if (this.pantry.id) {
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
