import { concat } from 'lodash-es';
import { reactive } from 'vue';
import type { MenuItem } from './menu.d';

class MenuTree {
  menu: MenuItem[] = reactive([]);
  merge(payload: MenuItem[]) {
    // Vue.$set(this.menu, concat(this.menu, payload));
    // getCurrentInstance.$set(this.menu, concat(this.menu, payload));
    // const maped = payload.map((i) => {
    // 	if (!i.uriType) i.uriType = UriType.LIST;
    // 	return i;
    // });
    this.menu = concat(this.menu, payload);
  }
}

const menuTreeStatic = new MenuTree();

export const menuTree = menuTreeStatic;
// [
// 	{
// 		i18Key: 'PageOne',
// 		uri: {
// 			uriType: UriType.NAME,
// 			to: 'pageOne',
// 		},
// 	},
// 	{
// 		i18Key: 'PageTwo',
// 		uri: {
// 			uriType: UriType.NAME,
// 			to: (): string => 'pageTwo',
// 		},
// 	},
// ];
