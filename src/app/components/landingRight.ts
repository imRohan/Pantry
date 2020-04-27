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
      signupEmail: null,
      signupName: null,
      showNameField: false,
      pantryId: null,
      pantryName: null,
      copyPantryIdMessage: 'copy',
      pantry: null,
      basketContents: null,
      activeBasket: null,
    }
  },
  methods: {
    async createNewPantry() {
      const { data } = await axios({
        method: 'POST',
        data: {
          name: this.signupName,
          description: 'defaultDescription',
          contactEmail: this.signupEmail,
        },
        url: `${API_PATH}/pantry/create`,
      })

      this.pantryId = data
      this.$emit('change-view', IView.created)
    },
    async fetchPantry(pantryId: string) {
      const { data } = await axios({
        method: 'GET',
        url: `${API_PATH}/pantry/${pantryId}`,
      })
      this.pantryId = pantryId
      this.pantry = data
    },
    async toggleBasket(name: string) {
      if (this.activeBasket === name) {
        this.basketContents = null
        this.activeBasket = null
      } else {
        const { data } = await axios({
          method: 'GET',
          url: `${API_PATH}/pantry/${this.pantryId}/basket/${name}`,
        })
        this.basketContents = data
        this.activeBasket = name
      }
    },
    signupValid() {
      const _emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return _emailRegix.test(String(this.signupEmail).toLowerCase());
    },
    signupNameValid() {
      return this.signupName !== null
    },
    getStarted() {
      this.fetchPantry(this.pantryId)
      this.$emit('change-view', IView.dashboard)
    },
    goHome() {
      this.$emit('change-view', IView.home)
    },
    showDocs() {
      this.$emit('change-view', IView.docs)
    },
    copyPantryId() {
      this.$emit('copy-text', this.pantryId)
      this.copyPantryIdMessage = 'copied!'
    },
    enterPantryName() {
      if (this.signupValid()) {
        this.showNameField = true
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
