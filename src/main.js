import axios from 'axios'
import VueAxios from 'vue-axios'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const app = createApp(App).use(VueAxios, axios).mount('#app');
