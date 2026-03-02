import type { AxiosResponse } from 'axios';

export type ApiResponse = {
  userMessageList: UserMessage[];
};

export type UserMessage = { message: string; title: string; type: number };

export type Response<T = unknown> = Promise<AxiosResponse<T> | undefined>;
