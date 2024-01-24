const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pages: {
    option: {
      // entry for the page
      entry: 'src/pages/option/main.ts',
      // the source template
      // template: 'src/pages/option/index.html',
      // output as dist/index.html
      filename: 'option.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Option'
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
  },

  pluginOptions: {
    vuetify: {}
  }
})
