import { useLogger } from '@/template/logger';
import type { AxiosError, AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios';
import axios from 'axios';
import _ from 'lodash';
import { useStore as loggerStore } from '@/template/logger/store';
import qs from 'qs';
import { TOKEN_HEADER_NAME } from '../account/authorization/constants';
import { useAuthorization } from '../account/authorization/provider';
import { useStore } from '../account/authorization/store';
import { parseUserMessageError, showAlert } from '../mixins/notifications';
import type { ApiResponse, Response } from './api.d';
import type { AxiosErrorMessageResponse } from '../logger/type';

export function checkUId(response: AxiosResponse) {
  if (import.meta.env.VITE_APP_DEVELOPMENT_LOGIN === 'true') return;
  const auth = useAuthorization();

  const uid = response.headers[TOKEN_HEADER_NAME];
  return auth.checkUid(uid);
}

export function checkUserMessage<T = unknown>(response: AxiosResponse<T>) {
  const apiResponse = response.data as T & ApiResponse;

  if (!_.isNil(apiResponse.userMessageList) && apiResponse.userMessageList.length > 0) {
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

export async function doRequest<T = unknown>(request: Promise<AxiosResponse<T>>, showError = true): Response<T> {
  try {
    const response = await request;
    await checkUId(response);
    showError && checkUserMessage(response);
    return response;
  } catch (error: unknown) {
    const domExceptio = error as AxiosError & { __CANCEL__: boolean };
    if (domExceptio?.__CANCEL__) return;
    checkError(error);
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL as string,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const store = useStore();
    if (store.localKey && config.headers) {
      if (import.meta.env.VITE_APP_DEVELOPMENT_LOGIN === 'true') config.headers['Authorization'] = `Bearer ${store.localKey}`;
      else config.headers['x-local-key'] = store.localKey;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

class HttpRequest {
  axiosInstance: AxiosInstance;
  abordControlers = new Map<string, AbortController>();

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  actionUri(uri: string) {
    return uri.replace(/\/\//g, '/');
  }

  cancelPrevious(methodName: string) {
    let abortControlerInstance: AbortController | undefined = this.abordControlers.get(methodName);
    abortControlerInstance && abortControlerInstance.abort();
    abortControlerInstance = new AbortController();
    this.abordControlers.set(methodName, abortControlerInstance);
    return abortControlerInstance.signal;
  }

  async fetchReport(
    reportName: string,
    data?: unknown,
    { showError = true, cancelPtr = null }: { showError?: boolean; cancelPtr?: { value: CancelTokenSource | null } | null } = {},
  ): Response {
    return this.fetchPdf(`/Reports/Reports/${reportName}`, data, { showError });
  }

  async fetch<T = unknown>(
    methodName: string,
    data?: unknown,
    { showError, cancelPrevious }: { showError: boolean; cancelPrevious: boolean } = { showError: true, cancelPrevious: true },
  ): Response<T> {
    const request: Promise<AxiosResponse<T>> = this.axiosInstance.get<T>(this.actionUri(methodName), {
      params: data,
      paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat', allowDots: true }),
      maxRedirects: 0,
      signal: cancelPrevious ? this.cancelPrevious(methodName) : undefined,
    });

    return doRequest<T>(request, showError);
  }

  fetchExport(
    methodName: string,
    data: { filter: Record<string, unknown>; options: { accept: string } },
    { showError = true }: { showError?: boolean } = {},
  ): Response {
    return doRequest(
      this.axiosInstance.get(methodName, {
        params: data.filter,
        paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat' }),
        responseType: 'arraybuffer',
        headers: {
          Accept: data.options.accept,
        },
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  fetchPdf(methodName: string, data?: unknown, { showError = true }: { showError?: boolean } = {}): Response {
    return doRequest(
      this.axiosInstance.get(methodName, {
        params: data,
        paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat' }),
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  fetchBlobs(methodName: string, data?: unknown, { showError = true }: { showError?: boolean } = {}): Response {
    return doRequest(
      this.axiosInstance.get(methodName, {
        params: data,
        responseType: 'blob',
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  postBlobs(methodName: string, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, data, {
        responseType: 'blob',
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  postPdf(methodName: string, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, data, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  uploadMultipart(methodName: string, formData: FormData, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  async post<T = unknown>(
    methodName: string,
    data?: unknown,
    { showError = true, cancelPtr = null }: { showError?: boolean; cancelPtr?: { value: CancelTokenSource | null } | null } = {},
  ): Response<T> {
    cancelPtr && !cancelPtr.value && (cancelPtr.value = axios.CancelToken.source());

    return doRequest(
      this.axiosInstance.post<T>(methodName, data, {
        withCredentials: true,
        maxRedirects: 0,
        cancelToken: cancelPtr?.value?.token,
        paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat' }),
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  postQuery(methodName: string, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, null, {
        withCredentials: true,
        params: data,
        paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat' }),
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }

  update(methodName: string, id?: string | number, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.put(this.actionUri(`${methodName}${id ? `/${id}` : ''}`), data, { signal: this.cancelPrevious(methodName) }),
      showError,
    );
  }

  delete(methodName: string, data?: unknown, showError = true): Response {
    let id = null;
    if (data && typeof data === 'object') {
      const values = Object.values(data);
      values.length === 1 && (id = values[0]);
    }
    return doRequest(
      this.axiosInstance.delete(`${methodName}${id ? id : ''}`, {
        params: id ? {} : data,
        paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat' }),
        signal: this.cancelPrevious(methodName),
      }),
      showError,
    );
  }
}

export { HttpRequest };
export const httpRequest = new HttpRequest();
