import { createApp } from 'vue'
import './assets/css/style.css'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(createPersistedState())
const app = createApp(App);
app.use(router);
app.use(ElementPlus)
const head = createHead()
app.use(head)
app.use(pinia)
app.mount('#app')
