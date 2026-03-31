import type { AxiosError, AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios';
import axios from 'axios';
import qs from 'qs';
import type { Response } from './api.d';
import { axiosInstance } from './axiosInstance';
import { getCancelSignal } from './requestCancellation';
import { checkError } from './requestHelpers';

export async function doRequest<T = unknown>(request: Promise<AxiosResponse<T>>): Response<T> {
  try {
    const response = await request;
    return response;
  } catch (error: unknown) {
    const domExceptio = error as AxiosError & { __CANCEL__: boolean };
    if (domExceptio?.__CANCEL__) return;
    checkError(error);
  }
}

class HttpRequest {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  actionUri(uri: string) {
    return uri.replace(/\/\//g, '/');
  }

  async fetchReport(
    reportName: string,
    data?: unknown,
    { showError = true, cancelToken = null }: { showError?: boolean; cancelToken?: { value: CancelTokenSource | null } | null } = {},
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
      signal: cancelPrevious ? getCancelSignal(methodName) : undefined,
      showUserMessages: showError,
    });

    return doRequest<T>(request);
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
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
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
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }

  fetchBlobs(methodName: string, data?: unknown, { showError = true }: { showError?: boolean } = {}): Response {
    return doRequest(
      this.axiosInstance.get(methodName, {
        params: data,
        responseType: 'blob',
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }

  postBlobs(methodName: string, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, data, {
        responseType: 'blob',
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }

  postPdf(methodName: string, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, data, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }

  uploadMultipart(methodName: string, formData: FormData, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
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
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }

  postQuery(methodName: string, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.post(methodName, null, {
        withCredentials: true,
        params: data,
        paramsSerializer: (paramsData: unknown) => qs.stringify(paramsData, { arrayFormat: 'repeat' }),
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }

  update(methodName: string, id?: string | number, data?: unknown, showError = true): Response {
    return doRequest(
      this.axiosInstance.put(this.actionUri(`${methodName}${id ? `/${id}` : ''}`), data, {
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
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
        signal: getCancelSignal(methodName),
        showUserMessages: showError,
      }),
    );
  }
}

export { HttpRequest };
export const httpRequest = new HttpRequest();
