// External Files
const axios = require('axios')
const jsonEditor = require('vue-json-editor').default

// Configs
const configs = require('../config.ts')

// Templates
const basketTemplate = require('../templates/basket.html')

// Components
const modal = require('./modal.ts')

// Constants
const API_PATH = configs.apiPath

const basket = {
  props: ['pantryId', 'basket'],
  name: 'basket',
  components: {
    modal,
    'json-edit': jsonEditor,
  },
  template: basketTemplate,
  data(): any {
    return {
      apiPath: API_PATH,
      shareModalVisible: false,
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
    async copyPath(path: string): Promise<void> {
      await navigator.clipboard.writeText(path)
      alert('Saved to clipboard')
    },
    refreshDashboard(): void {
      this.$emit('update')
    },
    basketPath(): string {
      return `${API_PATH}/pantry/${this.pantryId}/basket/${this.name}`
    },
    async deleteBasket(): Promise<void> {
      const _response = confirm(`Are you sure you'd like to delete ${this.name}?`)
      if (_response) {
        await axios({
          method: 'DELETE',
          url: this.basketPath(),
        })
        this.refreshDashboard()
      }
    },
    async save(): Promise<void> {
      await axios({
        method: 'POST',
        data: this.data,
        url: this.basketPath(),
      })
      alert(`${this.name} contents saved!`)
      this.refreshDashboard()
    },
    openShareModal(): void {
      this.shareModalVisible = true
    },
    closeShareModal(): void {
      this.shareModalVisible = false
    },
  },
}

export = basket
