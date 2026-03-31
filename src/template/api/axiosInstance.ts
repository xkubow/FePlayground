// src/template/http/axiosInstance.ts
import axios from 'axios';
import { useStore } from '../account/authorization/store';
import { checkUId, checkUserMessage } from './requestHelpers';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL as string,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const store = useStore();

    if (store.localKey && config.headers) {
      if (import.meta.env.VITE_APP_DEVELOPMENT_LOGIN === 'true') {
        config.headers.Authorization = `Bearer ${store.localKey}`;
      } else {
        config.headers['x-local-key'] = store.localKey;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  async (response) => {
    await checkUId(response);
    if (response.config.showUserMessages !== false) {
      checkUserMessage(response);
    }
    return response;
  },
);
