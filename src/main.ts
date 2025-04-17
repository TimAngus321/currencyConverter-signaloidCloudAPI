import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Noir from './components/presets/Noir'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Chart from 'primevue/chart'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Noir
  }
})

app.component('Button', Button)
app.component('ToggleSwitch', ToggleSwitch)
app.component('InputNumber', InputNumber)
app.component('Chart', Chart)

app.mount('#app')
