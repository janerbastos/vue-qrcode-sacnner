import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axiosPlugin from '@/plugins/axios'

import '@/utils/load_autentications'


const app = createApp(App)

app.use(axiosPlugin, {});
app.use(createPinia())
app.use(router)

app.mount('#app')
