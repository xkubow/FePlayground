import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus';
import { ref } from 'vue';
import Col from '../src/template/components/form/Col.vue';
import FormItem from '../src/template/components/form/FormItem.vue';
import Wrapper from '../src/template/components/form/Wrapper.vue';
import 'element-plus/dist/index.css';

setup(app => {
  // Some dependencies still check process.env in browser context.
  if (!(globalThis as { process?: { env?: { NODE_ENV?: string } } }).process) {
    (globalThis as { process: { env: { NODE_ENV: string } } }).process = { env: { NODE_ENV: 'development' } };
  }

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  });
  const i18n = createI18n({
    legacy: false,
    locale: 'cs',
    messages: { cs: {} },
  });
  const pinia = createPinia();

  app.use(router);
  app.use(i18n);
  app.use(pinia);
  app.use(ElementPlus);
  app.component('k-col', Col);
  app.component('k-form-item', FormItem);
  app.component('k-wrapper', Wrapper);
  app.provide('disableAll', ref(false));
  app.provide('filterSubmit', () => {});
  app.provide('changeKeyboardOptions', () => {});
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
