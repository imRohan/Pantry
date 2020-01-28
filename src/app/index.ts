const vue = require('vue')
const axios = require('axios')

// Configs
const configs = require('./configs.ts')

// Components

// CSS
require('./scss/main.scss')

// Constants
const API_PATH = configs.apiPath

const boilerplate = new vue({
  el: '.app',
  data: {
    name: 'Node-Express-VueJS-Typescript Boilerplate',
    response: null,
  },
  components: {

  },
  methods: {
    getDataFromExpressServer() {
      axios({
        method: 'GET',
        url: `${API_PATH}/api/sample/hello`,
      }).then((res) => {
        console.log(res)
        this.response = res.data
      })
    },
  },
})

export = boilerplate
