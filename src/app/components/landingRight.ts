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
      showNameField: false,
      copyPantryIdMessage: 'copy',
    }
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
    enterPantryName() {
      if (this.signupValid()) {
        this.showNameField = true
      }
    },
    loadPantry() {
      if(this.pantry.id) {
        this.fetchPantry(this.pantry.id)
      }
    },
    fetchURLParams() {
      if (this.view === IView.dashboard) {
        const _pantryId = decodeURIComponent(window.location.search.match(/(\?|&)pantryid\=([^&]*)/)[2])
        this.fetchPantry(_pantryId)
      }
    },
  },
  mounted() {
    this.fetchURLParams()
  },
}

export = landingRight
