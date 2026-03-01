import type { Response } from '@/template/api/api.d';
import { BaseApi } from '@/template/page/api';
import { NAME } from './constants';

class VozidloProvider extends BaseApi {
	filter(): Response {
		return {} as Response;
	}
}

export const apiProvider = new VozidloProvider(NAME);
