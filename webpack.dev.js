const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
  }
});
