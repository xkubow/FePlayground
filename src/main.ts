import { template } from '@/template/index';
import { menu } from '@/views/menu';
import { routes } from '@/views/router';
import { createApp } from 'vue';
import KTemplate from './template/kTemplate';
import dayjs from 'dayjs';

const app = createApp(template.layouts.MainLayout);
app.use(KTemplate, { routes, menu });
app.mount('#app');

dayjs.locale('cs');
