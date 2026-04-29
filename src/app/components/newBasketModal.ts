// JSON files
import templates from '../assets/templates.json'

// External Files
const jsonEditor = require('vue-json-editor').default

// Templates
const newBasketModalTemplate = require('../templates/newBasketModal.html')

// Components
const modal = require('./modal.ts')
const card = require('./card.ts')

const newBasketModal = {
  name: 'newBasketModal',
  template: newBasketModalTemplate,
  props: ['visible'],
  components: {
    modal,
    card,
    'json-edit': jsonEditor,
  },
  data(): any {
    return {
      templates,
      basketName: 'my-new-basket-name',
      pathToTemplates: '../assets/templates/',
      payload: null,
    }
  },
  computed: {
    payloadIsNotEmpty(): boolean {
      return this.payload !== null
    },
    valid(): boolean {
      return this.payload && this.basketName
    },
  },
  methods: {
    close(): void {
      this.$emit('close')
    },
    async setTemplate(fileName: string): Promise<void> {
      const file = await import(`../assets/templates/${fileName}.json`)
      this.payload = file.default
    },
    setBlankTemplate(): void {
      this.payload = {}
    },
    createBasket(): void {
      if (this.valid) {
        this.$emit('createBasket', this.basketName, this.payload)
      } else {
        alert('Please enter a name & select a starting template')
      }
    },
    closeModal(): void {
      this.$emit('close')
    },
  },
  updated(): void {
    if (this.visible) {
      document.getElementById('newBasketName').focus()
    }
  },
}

export = newBasketModal
