// External Files
const vue = require('vue')

// CSS
require('./scss/main.scss')

// Components
const landingLeft = require('./components/landingLeft.ts')
const landingRight = require('./components/landingRight.ts')

// Interfaces
const { IView } = require('../interfaces/view.ts')

const pantry = new vue({
  el: '.app',
  data() {
    return {
      view: IView.home,
    }
  },
  methods: {
    changeView(view: string) {
      this.view = IView[view]
    },
    goHome() {
      this.changeView(IView.home) 
    },
  },
  components: {
    landingLeft,
    landingRight,
  },
})

export = pantry
