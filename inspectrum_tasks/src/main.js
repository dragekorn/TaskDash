import { createApp } from 'vue';
import 'flowbite';
import 'flowbite/dist/flowbite.css';
import './assets/styles/tailwind.css'
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');