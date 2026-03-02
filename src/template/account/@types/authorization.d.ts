import type { ComputedRef } from 'vue';

export interface Mixin {
  isAuthorized: ComputedRef<boolean>;
  authorize(payload: { login: string; password: string }): Promise<unknown>;
  uid: ComputedRef<string | null>;
  isUnauthorizeVisible: ComputedRef<boolean>;
  checkUid(uid: string): Promise<void>;
  unAuthorize(): Promise<string | undefined>;
  passwordReset(): void;
  passwordExpired(): void;
  user: ComputedRef<AuthUser | null>;
  checkApiResponse(error: AxiosError): void;
  checkAuthorized(): Promise<unknown>;
  initFromSessionStorage(): Promise<void>;
  isPanel: ComputedRef<boolean>;
  isMobile: ComputedRef<boolean>;
}

export type AuthUser = {
  zobrazeneJmeno: string;
  uzivatelId: string;
  department: string;
  employeeNumber: string;
  preferredLanguage: string;
  groups: string[];
  vyrobniLinkaId: number;
};
