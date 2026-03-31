import type { AxiosRequestConfig } from 'axios';
import { createRequestConfig, runRequest, type RequestOptions } from './requestHelpers';

export const postRequest = <T = unknown>(
  requestName: string,
  request: (config: AxiosRequestConfig) => Promise<T>,
  options?: RequestOptions,
): Promise<T | unknown> => {
  const config = createRequestConfig(`${requestName}`, { ...options, cancelPrevious: false });
  return runRequest<T>(request(config));
};

export const fetchRequest = async <T = unknown>(
  requestName: string,
  request: (config: AxiosRequestConfig) => Promise<T>,
  options?: RequestOptions,
): Promise<T | unknown> => {
  const config = createRequestConfig(`${requestName}`, options);
  return runRequest<T>(request(config));
};

export const updateRequest = async <T = unknown>(
  requestName: string,
  request: (config: AxiosRequestConfig) => Promise<T>,
  options?: RequestOptions,
): Promise<T | unknown> => {
  const config = createRequestConfig(`${requestName}`, { ...options, cancelPrevious: false });
  return runRequest<T>(request(config));
};

export const deleteRequest = async <T = unknown>(
  requestName: string,
  request: (config: AxiosRequestConfig) => Promise<T>,
  options?: RequestOptions,
): Promise<T | unknown> => {
  const config = createRequestConfig(`${requestName}`, { ...options, cancelPrevious: false });
  return runRequest<T>(request(config));
};
