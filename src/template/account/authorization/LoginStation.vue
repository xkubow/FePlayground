<template>
  <div class="envelop">
    <p class="login-label-font">{{ t('PrilozteKartu') }}</p>
    <div class="login-input-hide">
      <el-input ref="uidInput" v-bind="{ disabled: false, wrapp: false }" v-model="userId" @keyup.enter="authorize" autofocus v-on="{ blur }" />
    </div>
    <k-button v-if="isMobile" @click="loadQr" size="Large" label-key="loadQr" :disabled="false" />
  </div>
</template>

<script setup lang="ts">
  import { useStore } from '@/template/account/authorization/store';
  import { checkError } from '@/template/api/httpRequest';
  import { useStore as useCacheStore } from '@/template/cache';
  import type ElInput from 'element-plus/lib/components/input';
  import { computed, nextTick, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { apiProvider } from './api';
  import { useRouter } from 'vue-router';

  const userId = ref('');

  const refs = defineProps<{ stationId: string }>();
  const uidInput = ref<typeof ElInput | undefined>();
  const store = useStore();
  const router = useRouter();
  store.clearStore();
  const { t } = useI18n();

  async function authorize() {
    try {
      const uid = userId.value;
      userId.value = '';
      let response = await apiProvider.station(uid, refs.stationId);
      store.setLocalKey(response?.data.token ?? null);
      await store.checkAuthorization();
    } catch (error) {
      checkError(error);
    } finally {
      if (store.authorized) {
        const cacheStore = useCacheStore();
        await cacheStore.loadCache();
      }
    }
  }

  function loadQr() {
    router.push({ name: 'BarcodeScennerVozidlo', params: { isLoginStation: 'true' } });
  }

  const isMobile = computed(() => store.isMobile);

  onMounted(() => {
    nextTick(() => {
      uidInput?.value?.focus();
    });
    if (store.userQrId != null) {
      userId.value = store.userQrId;
      authorize();
    }
  });

  function blur() {
    uidInput?.value?.focus();
  }
</script>

<style lang="scss" scoped>
  .envelop {
    padding-top: 20vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-label-font {
    font-size: 500%;
  }
  .login-input-hide {
    position: absolute;
    top: -100px;
  }
</style>
