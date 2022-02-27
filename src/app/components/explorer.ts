// External Files
const axios = require('axios')

// Configs
const configs = require('../config.ts')

// Templates
const explorerTemplate = require('../templates/explorer.html')

// Constants
const API_PATH = configs.apiPath

// Components
const explorerEmpty = require('./explorerEmpty.ts')
const explorerOnboarding = require('./explorerOnboarding.ts')
const basket = require('./basket.ts')

const explorer = {
  name: 'explorer',
  props: ['pantry'],
  template: explorerTemplate,
  components: {
    explorerEmpty,
    explorerOnboarding,
    basket,
  },
  data(): any {
    return {
      errorsVisible: false,
      basket: null,
    }
  },
  computed: {
    errorsExist(): boolean {
      return this.pantry.errors && this.pantry.errors.length > 0
    },
    isPantryEmpty(): boolean {
      return this.pantry.baskets && this.pantry.baskets.length === 0
    },
    activeBasket(): string {
      return this.basket ? this.basket.name : ''
    },
  },
  methods: {
    getDateOfDeletion(ttl: number): string {
      const _currentDate = new Date()
      _currentDate.setSeconds(ttl)
      return _currentDate.toISOString().split('T')[0]
    },
    toggleErrors(): void {
      this.errorsVisible = !this.errorsVisible
    },
    refresh(): void {
      this.$emit('refresh')
      this.basket = null
    },
    async createBasket(): Promise<void> {
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

        this.refresh()
      }
    },
    async viewBasket(name: string): Promise<void> {
      const { data } = await axios({
        method: 'GET',
        url: `${API_PATH}/pantry/${this.pantry.id}/basket/${name}`,
      })
      this.basket = { data, name }
    },
    loadBasket(): void {
      if (this.pantry.baskets && this.pantry.baskets.length > 0) {
        const { name } = this.pantry.baskets[0]
        this.viewBasket(name)
      }
    },
  },
}

export = explorer
