import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';

class TiketProvider extends BaseApi {}

export const apiProvider = new TiketProvider(NAME);
