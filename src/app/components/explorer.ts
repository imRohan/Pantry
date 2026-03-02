// External Files
const axios = require('axios')
const jsonEditor = require('vue-json-editor').default

// Configs
const configs = require('../config.ts')

// Templates
const explorerTemplate = require('../templates/explorer.html')

// Constants
const API_PATH = configs.apiPath

// Components
const changelog = require('./changelog.ts')
const explorerEmpty = require('./explorerEmpty.ts')
const explorerOnboarding = require('./explorerOnboarding.ts')
const basket = require('./basket.ts')
const modal = require('./modal.ts')

const explorer = {
  name: 'explorer',
  props: ['pantry'],
  template: explorerTemplate,
  components: {
    changelog,
    explorerEmpty,
    explorerOnboarding,
    basket,
    modal,
    'json-edit': jsonEditor,
  },
  data(): any {
    return {
      basket: null,
      schemaModalVisible: false,
      schemaExample: {
        _schema: {
          toppings: { type: 'array' },
          size: { type: 'string' },
          price: { type: 'number' },
        },
        toppings: ['pepperoni', 'mushrooms', 'hot peppers'],
        size: 'large',
        price: 19.99,
      },
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
    daysToDeletion(ttl: number): number {
      const _expiryDate = new Date()
      _expiryDate.setSeconds(ttl)
      return this.getDiffOfDates(new Date(), _expiryDate)
    },
    getDiffOfDates(start: Date, end: Date): number {
      const _msPerDay = 1000 * 60 * 60 * 24
      const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
      const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
      return Math.floor((endUTC - startUTC) / _msPerDay)
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
    async renamePantry(): Promise<void> {
      const _defaultPantryName = this.pantry.name
      const _namePantry = prompt('Pantry Name:', _defaultPantryName)
      if (_namePantry) {
        await axios({
          method: 'PUT',
          data: {
            name: _namePantry,
          },
          url: `${API_PATH}/pantry/${this.pantry.id}`,
        })

        this.refresh()
      }
    },
    async changePantryDescription(): Promise<void> {
      const _defaultDesc = this.pantry.description
      const _description = prompt('Pantry Description:', _defaultDesc)
      if (_description) {
        await axios({
          method: 'PUT',
          data: {
            description: _description,
          },
          url: `${API_PATH}/pantry/${this.pantry.id}`,
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
    toggleSchemaModal(): void {
      this.schemaModalVisible = !this.schemaModalVisible
    },
  },
}

export = explorer
