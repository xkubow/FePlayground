<script setup lang="ts">
  import { apiProvider } from '@/views/eskalace/api';
  import { NAME as ESKALCE_NAME } from '@/views/eskalace/constants';
  import type { AxiosError } from 'axios';
  import _ from 'lodash';
  import { computed, onBeforeUnmount, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { RouteMeta, RouteParams } from 'vue-router';
  import { useLogger } from '../logger';
  import { PageMode } from '../page/providers/pageMode';
  import { UriType } from './constants';
  import type { MenuItem } from './menu.d';
  import { menuTree } from './menuTree';
  import DOMPurify from 'dompurify';
  import type { AxiosErrorMessageResponse } from '../logger/type';

  const { t } = useI18n();
  const { logAxiosError } = useLogger();
  const menu = menuTree.menu;

  const eskalkaceMenuItem = menu.find((i) => i.to === ESKALCE_NAME);

  async function pocetNezpracovanych() {
    try {
      const response = await apiProvider.pocetNezpracovanych();
      response?.data && (eskalaceCount.value = response.data);
    } catch (err) {
      logAxiosError(err as AxiosError<AxiosErrorMessageResponse>);
    }
  }

  eskalkaceMenuItem && (eskalkaceMenuItem.dynamicValue = computed(() => (_.isNumber(eskalaceCount.value) ? `${eskalaceCount.value}` : null)));

  // Need to be , meta: {createNewModule: 'true', clearAllPages: 'true' } implemented in the route definition to work correctly
  function getRoute(item: MenuItem): { name: string; params?: RouteParams; meta?: RouteMeta } | string {
    switch (item.uriType) {
      case UriType.NAME:
        return { name: item.to as string };
      case UriType.EDIT:
        return {
          name: `${item.to}${PageMode.CLEAR_ALL_EDIT}`,
          params: { mode: PageMode.EDIT, id: item.id?.toString() ?? '' },
        };
      case UriType.CREATE:
        return { name: `${item.to}${PageMode.EDIT}`, params: { mode: PageMode.CREATE } };
      case UriType.PATH:
        return (item.to as string).replace('<origin>', window.location.origin);
      case UriType.LIST:
        return { name: `${item.to}${PageMode.CLEAR_ALL_LIST}`, params: { mode: PageMode.LIST } };
      default:
        return { name: `${item.to}${PageMode.CLEAR_ALL_LIST}`, params: { mode: PageMode.LIST } };
    }
  }
  function getHrefRoute(item: MenuItem): string {
    const replacetOrgin = (item.to as string).replace('<origin>', window.location.origin);
    return DOMPurify.sanitize(replacetOrgin);
  }

  function menuText(item: MenuItem): string {
    let itemText = item.i18nKey ? t(item.i18nKey) : item.text;
    item.dynamicValue && !_.isNil(item.dynamicValue.value) && (itemText = `${itemText} (${item.dynamicValue.value})`);
    return itemText ?? 'undefined';
  }

  const eskalaceCount = ref<number | null>(null);
  pocetNezpracovanych();
  const interval = window.setTimeout(() => {
    pocetNezpracovanych();
  }, 300_000);

  onBeforeUnmount(() => {
    clearTimeout(interval);
  });
</script>

<template>
  <template v-for="(item, index) in menu" :key="index">
    <template v-if="item.menuType === undefined">
      <el-menu-item v-if="item.uriType === UriType.PATH" :index="`${index}`">
        <a class="menu-item" :href="getHrefRoute(item)">{{ menuText(item) }}</a>
      </el-menu-item>
      <router-link v-else :to="getRoute(item)">
        <el-menu-item :index="`${index}`">
          {{ menuText(item) }}
        </el-menu-item>
      </router-link>
    </template>
    <el-sub-menu v-else :index="`${index}`">
      <template #title>{{ t(item.i18nKey ?? '') }}</template>
      <router-link v-for="(subItem, subIndex) in item.items" :key="subIndex" :to="getRoute(subItem)">
        <el-menu-item :index="`${index}-${subIndex}`">
          {{ menuText(subItem) }}
        </el-menu-item>
      </router-link>
    </el-sub-menu>
  </template>
</template>

<style lang="scss" scoped>
  .menu-item {
    color: white;
  }
</style>
