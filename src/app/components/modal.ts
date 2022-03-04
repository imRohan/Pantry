// Templates
const modalTemplate = require('../templates/modal.html')

const modal = {
  name: 'modal',
  template: modalTemplate,
  data(): any {
    return {
    }
  },
  methods: {
    close(): void {
      this.$emit('close')
    },
  },
}

export = modal
