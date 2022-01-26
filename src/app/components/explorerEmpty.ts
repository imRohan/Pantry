// Configs
const configs = require('../config.ts')

// Constants
const API_PATH = configs.apiPath
const DOCS_PATH = configs.docsPath

// Templates
const explorerEmptyTemplate = require('../templates/explorerEmpty.html')

const explorerEmpty = {
  name: 'explorerEmpty',
  template: explorerEmptyTemplate,
  props: ['pantryId'],
  data(): any {
    return {
      apiPath: API_PATH,
    }
  },
  methods: {
    showDocs(): void {
      window.location.href = DOCS_PATH
    },
  },
}

export = explorerEmpty
