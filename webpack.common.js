const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    app: './src/app/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ],
      },
      {
        test: /\.css$/,
        loaders: 'style-loader!css-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: 'style-loader!css-loader!sass-loader',
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loaders: 'html-loader',
      },
      {
        test: /\.(png|jpg|svg)$/,
        loaders: [
          'file-loader?name=/app/images/[name].[ext]'
        ]
      },
      {
        test: /\.vue$/,
        loaders: 'vue-loader'
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    modules: [path.resolve(__dirname, "app"), "node_modules"],
  }
};
