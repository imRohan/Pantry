// External Libs
const axios = require('axios')

// Configs
const configs = require('../configs.ts')

// Templates
const landingRightTemplate = require('../templates/landingRight.html')

// Constants
const API_PATH = configs.apiPath

const landingRight = {
  name: 'landingRight',
  data: function() {
    return {
      pantryId: null,
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
          contactEmail: 'default@email.com'
        },
        url: `${API_PATH}/api/create`,
      })

      this.pantryId = data
    },
  },
}

export = landingRight
