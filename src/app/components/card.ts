// Templates
const cardTemplate = require('../templates/card.html')

const card = {
  name: 'card',
  template: cardTemplate,
  data(): any {
    return {
    }
  },
  methods: {
    clicked(): void {
      this.$emit('click')
    },
  },
}

export = card
