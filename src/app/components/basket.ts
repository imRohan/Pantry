// External Files
const axios = require('axios')
const jsonEditor = require('vue-json-editor').default

// Configs
const configs = require('../config.ts')

// Templates
const basketTemplate = require('../templates/basketTemplate.html')

// Constants
const API_PATH = configs.apiPath

const basket = {
  props: ['pantry', 'name', 'ttl', 'active'],
  name: 'basket',
  components: {
    'json-edit': jsonEditor,
  },
  template: basketTemplate,
  data(): any {
    return {
      apiPath: API_PATH,
      basket: null,
    }
  },
  methods: {
    getDateOfDeletion(): string {
      const _currentDate = new Date()
      _currentDate.setSeconds(this.ttl)
      return _currentDate.toISOString().split('T')[0]
    },
    toggleBasket(name: string): void {
      this.$emit('toggle-basket', name)
    },
    async load(): Promise<void> {
      if (this.active) {
        this.basket = null
        this.toggleBasket(null)
      } else {
        const { data } = await axios({
          method: 'GET',
          url: `${API_PATH}/pantry/${this.pantry.id}/basket/${this.name}`,
        })
        this.basket = data
        this.toggleBasket(this.name)
      }
    },
    refreshDashboard(): void {
      this.$emit('update')
    },
    async deleteBasket(): Promise<void> {
      const _response = confirm(`Are you sure you'd like to delete ${this.name}?`)
      if (_response) {
        await axios({
          method: 'DELETE',
          url: `${API_PATH}/pantry/${this.pantry.id}/basket/${this.name}`,
        })
        this.refreshDashboard()
      }
    },
    async update(): Promise<void> {
      await axios({
        method: 'PUT',
        data: this.basket,
        url: `${API_PATH}/pantry/${this.pantry.id}/basket/${this.name}`,
      })
      alert(`${this.name} contents saved!`)
      this.refreshDashboard()
    },
    copyPath(): void {
      const _path =  `${API_PATH}/pantry/${this.pantry.id}/basket/${this.name}`
      this.$emit('copy-basket-path', _path)
      alert('Basket path copied link to clipboard!')
    },
  },
}

export = basket
