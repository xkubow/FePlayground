import { HttpRequest } from '@/template/api/httpRequest';
import type { ServicesVersion } from './type';

export class AboutProvider extends HttpRequest {
	version() {
		return this.fetch<Record<string, ServicesVersion>>('version');
	}
}

export const apiProvider = new AboutProvider();
