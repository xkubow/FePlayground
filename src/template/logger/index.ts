import type { AxiosError } from 'axios';
import type { NotificationOptions } from 'element-plus/lib/components/notification/index';
import { nextTick } from 'vue';
import type { UserMessage } from '../api/api';
import { showNotification } from '../mixins/notifications';
import { LogLevel, LogLevelNames } from './constants';
import { useStore } from './store';
import type { AxiosErrorMessageResponse, ErrorTypes } from './type';

export function useLogger() {
	function log(message: string, options: Partial<NotificationOptions> = { type: 'error' }) {
		const store = useStore();
		const type = LogLevelNames.findIndex((i) => i === options.type);
		store.log({ message, type });
		showNotification(message, options);
	}
	function logCatch(err: any) {
		const e = err as Error;
		const ae = err as AxiosError<AxiosErrorMessageResponse>;
		if (ae) logAxiosError(ae);
		else if (e) logError(e);
		else log(`Unknown error to log : ${typeof err}, ${e} `);
	}

	function logError(error: Error, message?: string): void {
		const store = useStore();
		store.log({
			message: `${error.message}`,
			type: LogLevel.error,
		});
		showNotification(error.message, { type: 'error' });
	}
	function logAxiosError(error: AxiosError<AxiosErrorMessageResponse>): void {
		const { status, statusText } = error.response || { status: 0, statusText: '' };
		const store = useStore();

		const data: { userMessageList: UserMessage[] } | undefined = error.response?.data;

		const offset = 40 + store.list.length * 10;
		if (data && data.userMessageList) {
			data.userMessageList.forEach((d) => {
				store.log(d);
				nextTick(() => {
					showNotification(d.message, { type: LogLevelNames[d.type ?? 0] as ErrorTypes, offset });
				});
			});
		} else {
			store.log({
				message: `${status}(${statusText}) - ${error.message}`,
				type: LogLevel.error,
				httpError: error,
			});
			showNotification(error.message, { type: 'error', offset });
		}
	}
	return { log, logAxiosError, logError, logCatch };
}
