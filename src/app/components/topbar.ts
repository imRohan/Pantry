// External Files
const topbarTemplate = require('../templates/topbar.html')

// Configs
const configs = require('../config.ts')

// Interfaces
const { IView } = require('../../interfaces/view.ts')

// Constants
const DOCS_PATH = configs.docsPath

const topbar = {
  name: 'topbar',
  template: topbarTemplate,
  props: [],
  methods: {
    showStatus() {
      this.$emit('change-view', IView.status)
    },
    showAbout() {
      this.$emit('change-view', IView.about)
    },
    showDocs() {
      window.location.href = DOCS_PATH
    },
    showDashboard() {
      this.$emit('change-view', IView.dashboard)
    },
    goHome() {
      this.$emit('change-view', IView.home)
    },
    showSDK() {
      this.$emit('change-view', IView.sdk)
    },
  },
}

export = topbar
