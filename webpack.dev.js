const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  }
});
