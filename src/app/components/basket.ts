// External Files
const axios = require('axios')
const jsonEditor = require('vue-json-editor').default

// Configs
const configs = require('../config.ts')

// Templates
const basketTemplate = require('../templates/basket.html')

// Constants
const API_PATH = configs.apiPath

const basket = {
  props: ['pantryId', 'basket'],
  name: 'basket',
  components: {
    'json-edit': jsonEditor,
  },
  template: basketTemplate,
  data(): any {
    return {
      apiPath: API_PATH,
    }
  },
  computed: {
    name(): string {
      return this.basket.name
    },
    data: {
      get(): any {
        return this.basket.data
      },
      set(newData: any): void {
        this.basket.data = newData
      },
    },
  },
  methods: {
    refreshDashboard(): void {
      this.$emit('update')
    },
    async deleteBasket(): Promise<void> {
      const _response = confirm(`Are you sure you'd like to delete ${this.name}?`)
      if (_response) {
        await axios({
          method: 'DELETE',
          url: `${API_PATH}/pantry/${this.pantryId}/basket/${this.name}`,
        })
        this.refreshDashboard()
      }
    },
    async save(): Promise<void> {
      await axios({
        method: 'PUT',
        data: this.data,
        url: `${API_PATH}/pantry/${this.pantryId}/basket/${this.name}`,
      })
      alert(`${this.name} contents saved!`)
      this.refreshDashboard()
    },
  },
}

export = basket
