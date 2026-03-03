import type { App } from 'vue';
import type { MenuItem } from './menu.d';
import Menu from './Menu.vue';
import { menuTree } from './menuTree';

export default {
  install(app: App, options: { menu: MenuItem[] }): App {
    if (options.menu) {
      menuTree.merge(options.menu);
    }
    app.component('KMainMenu', Menu);

    return app;
  },
};
