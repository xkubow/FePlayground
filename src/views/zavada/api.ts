import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';

class ZavadaProvider extends BaseApi {}

export const apiProvider = new ZavadaProvider(NAME);
