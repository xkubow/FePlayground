import type { AxiosError } from 'axios';
import type { LogLevel } from './constants';
import type { UserMessage } from '../api/api';

export type Log = {
	title?: string;
	message: string;
	type: LogLevel;
	apiUrl?: string;
	httpError?: AxiosError;
};

export type Options = {
	useStore: boolean;
	logTypeRedirection: LogLevel;
};

export type State = {
	list: Log[];
	options: Options;
};

export type AxiosErrorMessageResponse = { userMessageList: UserMessage[] };

export type ErrorTypes = "" | "error" | "success" | "warning" | "info";
