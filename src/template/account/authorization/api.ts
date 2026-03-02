import type { Response } from '@/template/api/api.d';
import { checkError, HttpRequest } from '../../api/httpRequest';
import { NAME } from '../constants';
import type { DevUserRespose } from '../types';

export class AuthorizationProvider extends HttpRequest {
  authorize(payload: { login: string; password: string }): Response {
    const methodName = `${NAME}/login`;
    return this.post(methodName, { Login: payload.login, Password: payload.password, signal: this.cancelPrevious(methodName) });
  }
  stationIdReset(): Response<{ stationId: string }> {
    const methodName = '/auth/station/reset';
    return this.axiosInstance.post<{ stationId: string }>(methodName);
  }
  async checkUser() {
    try {
      const methodName = '/uzivatel';
      // const response = await this.axiosInstance.get(methodName, { maxRedirects: 0, signal: this.cancelPrevious(methodName) });
      const response = await this.axiosInstance.get(methodName, { maxRedirects: 0 });
      return response;
    } catch (error) {
      checkError(error);
    }
  }
  async station(userId: string, stationId: string) {
    const methodName = '/auth/station/login';
    return this.axiosInstance.post(methodName, { id: userId, key: stationId, signal: this.cancelPrevious(methodName) });
  }
  developmentAuthorize<T = DevUserRespose>(payload: { login: string; password: string }): Response<T> {
    const methodName = 'auth/developmentLogin';
    return this.post(methodName, { Login: payload.login, Password: payload.password, signal: this.cancelPrevious(methodName) }) as Response<T>;
  }
}

export const apiProvider = new AuthorizationProvider();
