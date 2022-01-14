// External Files
const axios = require('axios')

// Configs
const configs = require('../config.ts')

// Constants
const API_PATH = configs.apiPath
const DOCS_PATH = configs.docsPath

// Templates
const dashboardEmptyTemplate = require('../templates/dashboardEmpty.html')

const dashboardEmpty = {
  name: 'dashboardEmpty',
  template: dashboardEmptyTemplate,
  props: ['pantry'],
  data(): any {
    return {
      apiPath: API_PATH,
    }
  },
  methods: {
    showDocs(): void {
      window.location.href = DOCS_PATH
    },
    async createNewBasket(): Promise<void> {
      const _randomNumber = Math.floor((Math.random() * 100) + 1)
      const _defaultName = `newBasket${_randomNumber}`
      const _name = prompt('What is the name of the new basket?', _defaultName)
      if (_name) {
        await axios({
          method: 'POST',
          data: {
            key: 'value',
          },
          url: `${API_PATH}/pantry/${this.pantry.id}/basket/${_name}`,
        })

        this.refreshDashboard()
      }
    },
    refreshDashboard(): void {
      this.$emit('update')
    },
  },
}

export = dashboardEmpty
