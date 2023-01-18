import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'

import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router'
import "./index.css";

library.add(faSearch)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())

app.use(router)


app.mount('#app')




