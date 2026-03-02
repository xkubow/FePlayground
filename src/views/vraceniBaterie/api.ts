import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';

class VraceniBaterieProvider extends BaseApi {
  filter(params?: Record<string, unknown>): Response {
    return this.fetch(`${this.apiPath}filter`);
  }
}

export const apiProvider = new VraceniBaterieProvider(NAME);
