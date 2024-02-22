const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'

module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  productionSourceMap: isDev,
  pages: {
    option: {
      entry: 'src/pages/option/main.ts',
      filename: 'option.html',
    },
    popup: {
      entry: 'src/pages/popup/main.ts',
      filename: 'popup.html'
    }
  },
  configureWebpack: {
    entry: {
      'content-script': './src/scripts/workers/content.ts',
      background: './src/scripts/workers/background.ts',
    },
    output: {
      filename: 'js/[name].js',
      clean: true,
    },
    optimization: {
      minimize: false,
    },
  },
  pluginOptions: {
    vuetify: {}
  }
})
