// Templates
const exampleTemplate = require('../templates/example.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

const example = {
  name: 'example',
  template: exampleTemplate,
  methods: {
    showSDK(): void {
      this.$emit('change-view', IView.sdk)
    },
  },
}

export = example
