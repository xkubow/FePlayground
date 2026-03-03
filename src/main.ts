import { template } from '@/template/index';
import { menu } from '@/views/menu';
import { routes } from '@/views/router';
import { createApp } from 'vue';
import KTemplate from './template/kTemplate';
import dayjs from 'dayjs';

async function enableMocks() {
  if (import.meta.env.DEV && (import.meta.env.VITE_MOCKS === 'true' || import.meta.env.MODE === 'mock')) {
    const { worker } = await import('./mocks/browser.ts');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocks().then(() => {
  const app = createApp(template.layouts.MainLayout);
  app.use(KTemplate, { routes, menu });
  app.mount('#app');
  dayjs.locale('cs');
});
