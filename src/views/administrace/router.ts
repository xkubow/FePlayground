import { Path } from '@/template/router/path';
import { NAME } from './constants';
import { Nastaveni } from './nastaveni';

export const route = new Path(NAME).addChildren([Nastaveni.route]);
