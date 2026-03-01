import { useStore as useCacheStore } from '@/template/cache';
import { useLogger } from '@/template/logger';
import { defineStore } from 'pinia';
import type { AuthUser } from '../../@types/authorization';
import { apiProvider } from '../api';
import { KLIENT_HEADER_NAME, NAME, TOKEN_HEADER_NAME } from '../constants';

// https://github.com/websanova/vue-auth

export const useStore = defineStore(NAME, {
	state: () => ({
		passwordReset: false,
		passwordExpired: false,
		user: null as AuthUser | null,
		userQrId: null as string | null,
		userToken: null as string | null,
		localKey: null as string | null,
		isMobile: false,
		isPanel: false,
	}),
	getters: {
		authorized() {
			if (this.userToken) {
				return true;
			} else {
				return false;
			}
		},
		enableUnAuthorized() {
			if (this.localKey) {
				return true;
			} else {
				return false;
			}
		},
	},
	actions: {
		setUserToken(uid: string | null) {
			this.userToken = uid;
			if (uid) {
				sessionStorage.setItem('userToken', uid);
			} else {
				sessionStorage.removeItem('userToken');
			}
		},
		setLocalKey(key: string | null) {
			this.localKey = key;
			if (key) {
				sessionStorage.setItem('localKey', key);
			} else {
				sessionStorage.removeItem('localKey');
			}
		},
		async checkUId(uid: string) {
			const isInCorectUid = uid !== this.userToken;
			if (isInCorectUid || this.user === null) {
				await this.checkAuthorization();
			}
		},
		async checkAuthorization() {
			const logger = useLogger();
			try {
				const response = await apiProvider.checkUser();
				if (response?.status === 200) {
					this.user = response.data as AuthUser;
					const uid = import.meta.env.VITE_APP_DEVELOPMENT_LOGIN === 'true' ? this.user.uzivatelId : response.headers[TOKEN_HEADER_NAME];
					this.isMobile = response.headers[KLIENT_HEADER_NAME] === 'mobile';
					this.isPanel = response.headers[KLIENT_HEADER_NAME] === 'ad'; // federace active dirtectory
					await this.setUserToken(uid);
					Promise.resolve();
				} else {
					logger.log('response checkUser is not 200 OK');
					return Promise.reject();
				}
			} catch (error) {
				logger.logError(error as Error);
				this.clearStore();
				return Promise.reject();
			}
		},
		async authorize(payload: { login: string; password: string }) {
			try {
				const response = await apiProvider.developmentAuthorize({ login: payload.login, password: payload.password });
				if (response?.data) {
					this.user = { zobrazeneJmeno: response.data.zobrazeneJmeno, uzivatelId: response.data.uzivatelId } as AuthUser;
					this.setUserToken(this.user.uzivatelId);
					this.setLocalKey(response.data.token);
					this.checkAuthorization();

					const cacheStore = useCacheStore();
					await cacheStore.loadCache();
					Promise.resolve();
				}
				// }
			} catch (error) {
				this.clearStore();
				return Promise.reject();
			}
		},
		clearStore() {
			this.setUserToken(null);
			this.setLocalKey(null);
			this.user = null;
			sessionStorage.clear();
			const cacheStore = useCacheStore();
			cacheStore.clear();
			return;
		},
	},
});
