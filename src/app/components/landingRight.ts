// External Libs
const axios = require('axios')

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
  data() {
    return {
      pantryId: 'Whoops! This was not supposed to happen.',
      apiPath: API_PATH,
      signupEmail: null,
    }
  },
  template: landingRightTemplate,
  methods: {
    async createNewPantry() {
      const { data } = await axios({
        method: 'POST',
        data: {
          name: 'defaultName',
          description: 'defaultDescription',
          contactEmail: this.signupEmail,
        },
        url: `${API_PATH}/pantry/create`,
      })

      this.pantryId = data
      this.$emit('change-view', IView.created)
    },
    signupValid() {
      const _emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return _emailRegix.test(String(this.signupEmail).toLowerCase());
    },
    getStarted() {
      this.$emit('change-view', IView.getStarted)
    },
    goHome() {
      this.$emit('change-view', IView.home)
    },
    showDocs() {
      this.$emit('change-view', IView.docs)
    },
  },
}

export = landingRight
