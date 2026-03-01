// import ElementPlus from "element-plus";
// import "element-plus/dist/index.css";
// import { createPinia } from "pinia";
// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";

// const app = createApp(App);

// app.use(createPinia());
// app.use(router);
// app.use(ElementPlus);

// app.mount("#app");

import { template } from '@/template/index';
import { menu } from '@/views/menu';
import { routes } from '@/views/router';
import { createApp } from 'vue';
// import App from './App.vue';
import KTemplate from './template/kTemplate';
import dayjs from 'dayjs';

const app = createApp(template.layouts.MainLayout);
app.use(KTemplate, { routes, menu });
app.mount('#app');

dayjs.locale('cs')
