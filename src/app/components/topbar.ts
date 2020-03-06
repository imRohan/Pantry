// External Files
const topbarTemplate = require('../templates/topbar.html')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

const tobpar = {
  name: 'tobpar',
  template: topbarTemplate,
  props: [],
  methods: {
    showDocs() {
      this.$emit('change-view', IView.docs)
    },
    goHome() {
      this.$emit('change-view', IView.home)
    },
  },
}

export = tobpar
