// Templates
const headerTemplate = require('../templates/headerBar.html')

const headerBar = {
  name: 'headerBar',
  template: headerTemplate,
  props: ['view'],
  data(): any {
    return {
    }
  },
  methods: {
  },
}

export = headerBar
