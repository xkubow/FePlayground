import '@/styles/custom.scss';
import i18n from '@/template/i18n';
import Menu from '@/template/menu';
import ElementPlus from 'element-plus';
// import "element-plus/lib/theme-chalk/index.css";
import cs from 'element-plus/es/locale/lang/cs';
import type { App } from 'vue';
import type { InstallOptions } from './@types/kTemplate.d';
import KComponents from './components';
import Layouts from './layouts';
import Router from './router';
import Store from './store';
import './utils';
import VueDOMPurifyHTML from 'vue-dompurify-html';

export default {
  install: (app: App, options: InstallOptions): App => {
    app.use(Router, options);
    app.use(ElementPlus, { size: 'default', locale: cs });
    app.use(VueDOMPurifyHTML);
    app.use(Menu, options);
    app.use(i18n);
    app.use(KComponents);
    app.use(Layouts);
    app.use(Store);

    return app;
  },
};
