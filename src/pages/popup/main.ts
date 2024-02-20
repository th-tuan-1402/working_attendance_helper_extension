import AppContext from '@/scripts/lib/core/AppContext'
const appCtx = AppContext.getInstance()

import '@/assets/css/global.css'
import { createApp } from 'vue'
import page from './index.vue'
const app = createApp(page)

import { vuetify } from '@/plugins/vuetify'
app.use(vuetify)

const pinia = appCtx.make('pinia')
app.use(pinia)

import axios from '@/plugins/axios'
app.use(axios)

app.mount('#app')
