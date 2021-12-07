import axios from 'axios'
import VueAxios from 'vue-axios'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import SectionTitle from "/src/components/SectionTitle.vue";
import MyButton from "/src/components/Button.vue";
import MyTransition from "/src/components/Transition.vue";
import Value from "/src/components/Value.vue";

createApp(App)
    .use(VueAxios, axios)
    .component("SectionTitle", SectionTitle)
    .component("MyButton", MyButton)
    .component("MyTransition", MyTransition)
    .component("Value", Value)
    .mount('#app');
