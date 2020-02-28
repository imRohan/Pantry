const vue = require('vue')

// CSS
require('./scss/main.scss')

// Components
const landingLeft = require('./components/landingLeft.ts')
const landingRight = require('./components/landingRight.ts')

const pantry = new vue({
  el: '.app',
  data: {},
  components: {
    landingLeft,
    landingRight,
  },
})

export = pantry
