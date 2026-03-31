import { useStore as useStoreAuthorization } from '@/template/account/authorization/store';
import { useLogger } from '@/template/logger';
import type { AxiosErrorMessageResponse } from '@/template/logger/type';
import type { AxiosError } from 'axios';
import { ElLoading } from 'element-plus';
import { computed, nextTick } from 'vue';
import type { Router } from 'vue-router';
import type { AuthUser, Mixin } from '../@types/authorization.d';
import { apiProvider } from './api';

// HELP https://www.danvega.dev/blog/2020/02/12/vue3-ref-vs-reactive/
export const useAuthorization = (options?: { router?: Router }): Mixin => {
  const storeAuthorization = useStoreAuthorization();
  const logger = useLogger();
  const isUnauthorizeVisible = computed(() => storeAuthorization.enableUnAuthorized);
  const isAuthorized = computed((): boolean => {
    if (!storeAuthorization.authorized && storeAuthorization.userToken) storeAuthorization.checkAuthorization();
    return storeAuthorization.authorized;
  });
  const uid = computed(() => storeAuthorization.userToken);
  async function initFromSessionStorage() {
    storeAuthorization.setUserToken(sessionStorage.getItem('userToken'));
    storeAuthorization.setLocalKey(sessionStorage.getItem('localKey'));
  }
  function checkUid(uid: string) {
    return storeAuthorization.checkUId(uid);
  }
  function checkAuthorized() {
    return storeAuthorization.checkAuthorization();
  }
  function authorize(payload: { login: string; password: string }): Promise<unknown> {
    return storeAuthorization.authorize(payload);
  }
  async function unAuthorize(): Promise<string | undefined> {
    const loadingInstance = ElLoading.service({ fullscreen: true });
    try {
      const response = await apiProvider.stationIdReset();
      if (!response?.data || !('stationId' in response.data)) {
        logger.log('stationId response is not correct');
        return;
      }
      const { stationId } = response.data;
      return stationId;
    } catch (err) {
      logger.logCatch(err);
    } finally {
      options?.router && (await options.router.push({ path: '/' }));
      storeAuthorization.clearStore();
      nextTick(() => {
        loadingInstance?.close();
      });
    }
  }
  function passwordReset(): void {
    // store.commit(`${NAME}/${MutationTypes.AUTHORIZE}`, { isAuthorized: false, passwordReset: true });
  }
  function passwordExpired(): void {
    // store.commit(`${NAME}/${MutationTypes.AUTHORIZE}`, { isAuthorized: false, passwordExpired: true });
  }
  const user = computed((): null | AuthUser => {
    return storeAuthorization.user;
  });
  async function checkApiResponse(error: AxiosError) {
    if (error && error.response && error.response.status && (error.response.status === 401 || (error.response.status === 403 && storeAuthorization.isPanel))) {
      try {
        await unAuthorize();
        storeAuthorization.clearStore();
      } catch (err) {
        logger.logAxiosError(err as AxiosError<AxiosErrorMessageResponse>);
      }
    }
    //  else {
    // 	throw error;
    // }
  }

  const isPanel = computed((): boolean => {
    return storeAuthorization.isPanel;
  });
  const isMobile = computed((): boolean => {
    return storeAuthorization.isMobile;
  });

  return {
    isAuthorized,
    authorize,
    unAuthorize,
    passwordReset,
    passwordExpired,
    user,
    checkApiResponse,
    checkAuthorized,
    uid,
    checkUid,
    initFromSessionStorage,
    isUnauthorizeVisible,
    isPanel,
    isMobile,
  };
};
