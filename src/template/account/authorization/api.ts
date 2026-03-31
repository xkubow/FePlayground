import type { LoginResponse } from '@/api/generated/model';
import type { PrihlasenyUzivatelDto } from '@/api/generated/model/prihlasenyUzivatelDto';
import { postApiAuthDevelopmentLogin } from '@/api/generated/user-authentication/user-authentication';
import { getApiUzivatel } from '@/api/generated/uzivatel/uzivatel';
import type { Response } from '@/template/api/api.d';
import { executeRequest } from '@/template/api/requestHelpers';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpRequest } from '../../api/httpRequest';

export class AuthorizationProvider extends HttpRequest {
  stationIdReset(): Response<{ stationId: string }> {
    const methodName = '/auth/station/reset';
    return this.axiosInstance.post<{ stationId: string }>(methodName);
  }
  async checkUser(): Promise<AxiosResponse<PrihlasenyUzivatelDto> | undefined> {
      const methodName = '/uzivatel';
      const request = (config: AxiosRequestConfig) => getApiUzivatel(config);
      return executeRequest<PrihlasenyUzivatelDto>(methodName, request);
  }
  developmentAuthorize(payload: { login: string; password: string }): Promise<AxiosResponse<LoginResponse> | undefined> {
    const methodName = 'auth/developmentLogin';
    return executeRequest<LoginResponse>(methodName, (config: AxiosRequestConfig) => postApiAuthDevelopmentLogin({ login: payload.login, password: payload.password },config));
  }
}

export const apiProvider = new AuthorizationProvider();

