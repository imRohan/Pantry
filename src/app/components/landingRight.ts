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
    }
  },
  template: landingRightTemplate,
  methods: {
    async createNewPantry() {
      const { data } = await axios({
        method: 'POST',
        data: {
          name: 'defaultAccountName',
          description: 'defaultDescription',
          contactEmail: 'default@email.com',
        },
        url: `${API_PATH}/apiv1/pantry/create`,
      })

      this.pantryId = data
      this.$emit('change-view', IView.created)
    },
    getStarted() {
      this.$emit('change-view', IView.getStarted)
    },
    showDocs() {
      this.$emit('change-view', IView.docs)
    },
  },
}

export = landingRight
