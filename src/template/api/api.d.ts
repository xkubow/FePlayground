import type { AxiosResponse } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** When false, skip `checkUserMessage` for this response (default: show messages). */
    showUserMessages?: boolean;
  }
}

export type ApiResponse = {
  userMessageList: UserMessage[];
};

export type UserMessage = { message: string; title: string; type: number };

export type Response<T = unknown> = Promise<AxiosResponse<T> | undefined>;
