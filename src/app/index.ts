// External Files
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash, faClipboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const vue = require('vue')
const vueClipboard = require('vue-clipboard2')

// Vue Setup
vue.use(vueClipboard)
vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faClipboard)
library.add(faEye)
library.add(faEyeSlash)

// CSS
require('./scss/main.scss')

// Interfaces
const { IView } = require('../interfaces/view.ts')

// Components
const landingLeft = require('./components/landingLeft.ts')
const landingRight = require('./components/landingRight.ts')
const topbar = require('./components/topbar.ts')
const bottomBar = require('./components/bottomBar.ts')


const pantry = new vue({
  el: '.app',
  components: {
    landingLeft,
    landingRight,
    topbar,
    bottomBar,
  },
  data() {
    return {
      view: IView.home,
    }
  },
  methods: {
    changeView(view: string) {
      this.view = IView[view]
    },
    copyText(text: string) {
      const _container = this.$refs.container
      this.$copyText(text, _container)
    },
    checkIfInView() {
      if (window.location.search) {
        const _view = decodeURIComponent(window.location.search.match(/(\?|&)show\=([^&]*)/)[2])
        if (IView[_view]) {
          this.view = IView[_view]
        }
      }
    },
  },
  created() {
    this.checkIfInView()
  },
})

export = pantry
