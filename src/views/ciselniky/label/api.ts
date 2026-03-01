import type { Response } from '@/template/api/api.d';
import type { Options } from '@/template/page/@types/api';
import { BaseApi } from '@/template/page/api';
import { NAME as NAME_CISELNIKY } from '../constants';
import { NAME } from './constants';
import { router } from '@/template/router';
import { PageMode } from '@/template/page/providers/pageMode';

class LabelProvider extends BaseApi {
	filter(): Response {
		return {} as Response;
	}
	getApiPath(): string {
		const pageName: string = (router.currentRoute.value.name! as string).replace('label', '').replace(PageMode.EDIT, '').replace(PageMode.CREATE, '');

		return `${NAME_CISELNIKY}/${pageName}/${NAME}/`;
	}

	loadEntity<T>(id: string | number, options: Options = { showError: true, cancelPrevious: true }): Response<T> {
		const resp = this.fetch<T>(`${this.getApiPath()}${id}`, undefined, options);
		return resp;
	}
	createEntity<T = string>(data?: Record<string, unknown>): Response<T> {
		const resp = this.post<T>(this.getApiPath(), data);
		return resp;
	}

	updateEntity(id: string | number, data?: Record<string, unknown>): Response {
		const resp = this.update(this.getApiPath(), id, data);
		return resp;
	}

	deleteEntity(id: string | number): Response {
		const resp = this.delete(this.getApiPath(), { id });
		return resp;
	}
	default(params?: Record<string, unknown> | undefined): Response<unknown> {
		return {} as Response;
	}
}

export const apiProvider = new LabelProvider(NAME, NAME_CISELNIKY);
