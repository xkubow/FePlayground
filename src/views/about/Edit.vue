<template>
  <div class="ml-10 mt-10" :style="{ width: '700px' }">
    <table class="description_table first_td-400">
      <caption>
        {{
          t('oAplikacii')
        }}
      </caption>
      <tbody>
        <tr>
          <th>{{ t('text') }}</th>
          <th>{{ t('hodnota') }}</th>
        </tr>
        <tr>
          <td>
            <span>FE</span>
          </td>
          <td>{{ feVersion }}</td>
          <td>
            <time>{{ feVersionDate }}</time>
          </td>
        </tr>
        <tr v-for="(ver, index) in versionArray" :key="index">
          <td>
            <span>{{ t(`${ver.key}`) }}</span>
          </td>
          <td>{{ ver.version }}</td>
          <td>
            <time>{{ ver.versionDate }}</time>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { useLogger } from '@/template/logger';
  import type { AxiosError } from 'axios';
  import { mapValues } from 'lodash-es';
  import { computed, onBeforeMount, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { apiProvider } from './api';
  import type { ServicesVersion } from './type';

  const { t } = useI18n();
  const logger = useLogger();

  const feVersion = computed(() => import.meta.env.VITE_APP_VERSION);
  const feVersionDate = computed(() => import.meta.env.VITE_APP_VERSION_DATE);
  const versions = ref<Record<string, ServicesVersion> | null>(null);

  const versionArray = computed(() => mapValues(versions.value, (keyValue, key: string) => ({ key, ...keyValue })));

  onBeforeMount(async () => {
    try {
      const versionResponse = await apiProvider.version();
      versionResponse?.data && (versions.value = versionResponse.data);
    } catch (err) {
      logger.logAxiosError(err as AxiosError);
    }
  });
</script>

<style scoped lang="scss">
  .first_td-400 {
    tr td:first-child {
      width: 200px;
    }
  }
</style>
