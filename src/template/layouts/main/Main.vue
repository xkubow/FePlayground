<template>
  <template v-if="unVerifiedRouter">
    <router-view />
  </template>
  <el-config-provider v-else :size="size">
    <div class="main-container" v-loading="loading">
      <template v-if="appInicialized">
        <k-container direction="vertical" class="k-main">
          <k-header id="page-head">
            <slot name="header">
              <k-main-header v-model:toggleMenu="toggleMenu" v-on="{ unauthorize }" />
            </slot>
          </k-header>
          <k-container>
            <k-aside width="auto" class="k-aside">
              <slot name="asaid">
                <k-main-menu v-bind="{ toggleMenu }" v-on="{ select }" />
              </slot>
            </k-aside>
            <k-container direction="vertical">
              <k-main width="auto" class="k-main full-content-height-container">
                <router-view />
              </k-main>
            </k-container>
          </k-container>
        </k-container>
      </template>
      <template v-else>
        <slot name="login">
          <k-login v-if="developmentLogin" />
          <div v-else class="d-f w-100 h-100 at-c">
            <h1>{{ t('unauthorized') }}</h1>
          </div>
        </slot>
      </template>
    </div>
    <k-virtual-keyboard-vue v-bind="{ keyboard }" />
  </el-config-provider>
</template>

<script lang="ts">
import LoginVue from '@/template/account/authorization/Login.vue';
import { useAuthorization as useProviderAuthorization } from '@/template/account/authorization/provider';
import { useStore as useAuthorizationStore } from '@/template/account/authorization/store';
import { useStore as useCacheStore } from '@/template/cache';
import KVirtualKeyboardVue from '@/template/components/form/KVirtualKeyboard/KVirtualKeyboard.vue';
import { useKeyboard } from '@/template/components/form/KVirtualKeyboard/keyboard';
import { DEFAULT, LARGE } from '@/template/constants';
import { computed, defineComponent, onBeforeMount, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Header from './components/Header.vue';

  export default defineComponent({
    name: 'k-layout-main',
    components: {
      'k-main-header': Header,
      'k-login': LoginVue,
      KVirtualKeyboardVue,
    },
    setup() {
      const router = useRouter();
      const authorizationStore = useAuthorizationStore();
      const providerAuthorization = useProviderAuthorization({ router });
      const cacheStore = useCacheStore();
      const { t } = useI18n();

      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      const stationIdParam = params.get('stationId');

      const stationId = ref(stationIdParam ?? undefined);

      const toggleMenu = ref(false);

      if (stationId.value !== undefined) {
        router.replace('/');
      }

      async function initApplication() {
        await providerAuthorization.checkAuthorized();
        if (providerAuthorization.isAuthorized.value) {
          await cacheStore.loadCache();
        }
      }

      const unVerifiedRouter = computed(() => router.currentRoute.value.name === 'BarcodeScennerVozidlo');

      const appInicialized = computed(() => providerAuthorization.isAuthorized.value && cacheStore.cacheLoaded);

      const loading = computed(() => cacheStore.loading);

      const developmentLogin = computed(() => import.meta.env.VITE_APP_DEVELOPMENT_LOGIN === 'true');

      onBeforeMount(async () => {
        await providerAuthorization.initFromSessionStorage();
        if (developmentLogin.value) {
          providerAuthorization.isAuthorized.value && (await initApplication());
        } else {
          if (providerAuthorization.isAuthorized.value || stationId.value === undefined) {
            await initApplication();
          }
        }
      });

      const size = computed(() => (authorizationStore.isMobile ? LARGE : DEFAULT));

      function select() {
        if (authorizationStore.isMobile) {
          toggleMenu.value = true;
        }
      }

      async function unauthorize() {
        stationId.value = await providerAuthorization.unAuthorize();
      }
      const keyboard = useKeyboard();

      provide('changeKeyboardOptions', keyboard.changeOptions);

      return {
        ...providerAuthorization,
        t,
        stationId,
        developmentLogin,
        toggleMenu,
        size,
        select,
        unauthorize,
        keyboard,
        appInicialized,
        loading,
        unVerifiedRouter,
      };
    },
  });
</script>

<style scoped lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: gray;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
