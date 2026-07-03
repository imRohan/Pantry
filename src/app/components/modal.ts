// Templates
const modalTemplate = require('../templates/modal.html')

const modal = {
  name: 'modal',
  template: modalTemplate,
  props: ['readOnly'],
  data(): any {
    return {
    }
  },
  methods: {
    clicked(): void {
      this.$emit('clicked')
    },
    close(): void {
      this.$emit('close')
    },
  },
}

export = modal
