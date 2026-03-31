import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isNil } from 'lodash-es';
import qs from 'qs';
import { TOKEN_HEADER_NAME } from '../account/authorization/constants';
import { useAuthorization } from '../account/authorization/provider';
import { useLogger } from '../logger';
import { useStore as loggerStore } from '../logger/store';
import type { AxiosErrorMessageResponse } from '../logger/type';
import { parseUserMessageError, showAlert } from '../mixins/notifications';
import type { ApiResponse } from './api.d';
import { getCancelSignal } from './requestCancellation';

export function checkUId(response: AxiosResponse) {
  if (import.meta.env.VITE_APP_DEVELOPMENT_LOGIN === 'true') return;
  const auth = useAuthorization();

  const uid = response.headers[TOKEN_HEADER_NAME];
  return auth.checkUid(uid);
}

export function checkUserMessage<T = unknown>(response: AxiosResponse<T>) {
  const apiResponse = response.data as T & ApiResponse;

  if (!isNil(apiResponse.userMessageList) && apiResponse.userMessageList.length > 0) {
    const logger = loggerStore();
    const alert = parseUserMessageError(apiResponse.userMessageList);
    logger.log({ message: alert.message, title: alert.title, type: apiResponse.userMessageList[0].type, apiUrl: response.config.url });
    showAlert(alert);
  }
}

export function checkError(error: unknown) {
  const logger = useLogger();
  if (!logger) throw Error('logger mixin is not defined');
  const axError = error as AxiosError<AxiosErrorMessageResponse>;
  logger.logAxiosError(axError);

  const authorization = useAuthorization();
  if (!authorization) throw Error('authorization mixin is not defined');
  authorization.checkApiResponse(axError);
}

export type RequestOptions = {
  showError?: boolean;
  cancelPrevious?: boolean;
};

export function createRequestConfig(requestName: string, { showError = true, cancelPrevious = true }: RequestOptions = {}): AxiosRequestConfig {
  return {
    withCredentials: true,
    paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat', allowDots: true }),
    maxRedirects: 0,
    signal: cancelPrevious ? getCancelSignal(requestName) : undefined,
    showUserMessages: showError,
  };
}

export async function runRequest<T = unknown>(request: Promise<T>): Promise<T | undefined> {
  try {
    const response = await request;
    return response;
  } catch (error: unknown) {
    const domExceptio = error as AxiosError & { __CANCEL__: boolean };
    if (domExceptio?.__CANCEL__) return;
    checkError(error);
  }
}

export async function executeRequest<T>(
  requestName: string,
  request: (config: AxiosRequestConfig) => Promise<AxiosResponse<T>>,
  options?: RequestOptions,
): Promise<AxiosResponse<T> | undefined> {
  try {
    return await request(createRequestConfig(requestName, options));
  } catch (error) {
    const domExceptio = error as AxiosError & { __CANCEL__: boolean };
    if (domExceptio?.__CANCEL__) return;
    checkError(error);
  }
}
