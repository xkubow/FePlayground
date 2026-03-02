import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { NAME as NAME_CISELNIKY } from '../../constants';
import { NAME as NAME_AUTOMATICKE_SPRACOVANI_TESTU } from '../constants';
import { NAME } from './constants';

class ResultyProvider extends BaseApi {
  filter(): Response {
    return {} as Response;
  }
  default(params?: Record<string, unknown> | undefined): Response {
    return {} as Response;
  }
}

export const apiProvider = new ResultyProvider(NAME, `${NAME_CISELNIKY}/${NAME_AUTOMATICKE_SPRACOVANI_TESTU}`);
