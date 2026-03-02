<template>
  <k-layout-edit v-bind="{ leaving, canDelete: false, canSave: false }" v-on="{ ...layoutListeners }">
    <k-card class="options-card">
      <k-row>
        <k-input v-model="prilohaVelikostMax" disabled label-key="prilohaVelikostMax" />
      </k-row>
      <k-row>
        <k-check-box v-model="isMobile" label-key="isMobile" />
        <k-check-box v-model="isPanel" label-key="isPanel" />
        <k-check-box v-model="isSwKeyboard" label-key="isSwKeyboard" />
        <k-button @click="clearLocaleStore" label-key="znamzLocalStore" />
      </k-row>
    </k-card>
  </k-layout-edit>
</template>

<script lang="ts">
  import { useStore as useAuthStore } from '@/template/account/authorization/store';
  import { useStore as useCacheStore } from '@/template/cache';
  import { editName } from '@/template/page/constants';
  import { init } from '@/template/page/providers/edit';
  import { mapValues } from '@/template/page/providers/store_v2';
  import { computed, defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NAME } from './constants';
  import { useStore } from './store/edit';
  import type { Nastaveni } from './type';
  import { USE_SW_KEYBOARD } from '@/template/constants';

  export default defineComponent({
    name: editName(NAME),
    setup() {
      const store = useStore();
      const authStore = useAuthStore();
      const cacheStore = useCacheStore();

      const { t } = useI18n();
      const entita = NAME;

      const edit = init(NAME, store);
      const mapedLast = {
        ...mapValues(store.entityDefault.serverData, store, 'serverData'),
        ...mapValues(store.entityDefault.localData, store, 'localData'),
        ...mapValues(store.entityDefault, store),
      };

      const isMobile = computed({
        get() {
          return authStore.isMobile;
        },
        set(val: boolean) {
          authStore.isMobile = val;
        },
      });
      const isPanel = computed({
        get() {
          return authStore.isPanel;
        },
        set(val: boolean) {
          authStore.isPanel = val;
        },
      });
      const isSwKeyboard = computed({
        get() {
          return cacheStore.nastaveni?.useSwKeyboard ?? false;
        },
        set(val: boolean) {
          localStorage.setItem(USE_SW_KEYBOARD, val.toString());
          if (!cacheStore.nastaveni) cacheStore.nastaveni = { prilohaVelikostMax: null, useSwKeyboard: val } as Nastaveni;
          else cacheStore.nastaveni.useSwKeyboard = val;
        },
      });

      function clearLocaleStore() {
        localStorage.clear();
      }

      return {
        ...mapedLast,
        ...edit,
        t,
        entita,
        isMobile,
        isPanel,
        isSwKeyboard,
        clearLocaleStore,
      };
    },
  });
</script>

<style scoped>
  .options-card {
    max-width: 600px;
  }
</style>
