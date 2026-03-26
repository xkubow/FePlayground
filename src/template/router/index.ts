import { has } from 'lodash-es';
import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import type { InstallOptions } from '../@types/kTemplate.d';

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL as string),
  routes: [],
});

export default {
  install: (app: App, options: InstallOptions): App => {
    if (has(options, 'routes')) {
      options.routes.forEach((route) => {
        router.addRoute(route);
      });
    }

    app.use(router);
    return app;
  },
};
