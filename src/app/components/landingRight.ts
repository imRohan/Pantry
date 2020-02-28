// External Libs
const axios = require('axios')

// Configs
const configs = require('../configs.ts')

// Templates
const landingRightTemplate = require('../templates/landingRight.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

// Constants
const API_PATH = configs.apiPath

const landingRight = {
  name: 'landingRight',
  data: function() {
    return {
      view: IView.home,
      pantryId: 'Whoops! This was not supposed to happen.',
    }
  },
  watch: {
    view: function () {
      this.$emit('change-view', this.view)
    },
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
      this.view = IView.created
    },
    showDocs() {
      this.view = IView.docs
    },
  },
}

export = landingRight
