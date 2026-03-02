import type { App } from 'vue';
import Edit from './Edit.vue';
import List from './list/List.vue';
import Main from './main/Main.vue';

export default {
  install: (app: App): App => {
    app.component(Main.name!, Main);
    app.component(List.name!, List);
    app.component(Edit.name!, Edit);

    return app;
  },
};
