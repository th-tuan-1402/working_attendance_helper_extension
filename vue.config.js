const { defineConfig } = require('@vue/cli-service')
const isDev = process.env.NODE_ENV !== 'production'

module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  productionSourceMap: isDev,
  pluginOptions: {
    vuetify: {}
  }
})
