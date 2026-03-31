// src/api/mutator/custom-instance.ts
import { axiosInstance } from '@/template/api/axiosInstance';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    ...config,
    ...options,
  });
};

export type ErrorType<Error> = AxiosError<Error>;