import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);

const app = createApp(App, { socket });
app.mount('#app');
