<template>
  <div class="qr-scaner_wrapper">
    <div class="qr-scaner">
      <!-- <qrcode-stream @decode="onDecode" @init="logErrors"> </qrcode-stream> -->
      <StreamBarcodeReader data-type="scanner" @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
    </div>
    <span class="colse-fixed">
      <k-button circle plain size="large" :disabled="false" @click.once="back">
        <k-icon :size="30">
          <close-icon />
        </k-icon>
      </k-button>
    </span>
  </div>
</template>

<script lang="ts">
  import { useLogger } from '@/template/logger';
  import { PageMode, STORE_TABLE } from '@/template/page/constants';
  import { openEdit } from '@/template/router/path';
  import { Close as CloseIcon } from '@element-plus/icons-vue';
  import { computed, defineComponent, ref, toRefs, onBeforeUnmount } from 'vue';
  import { StreamBarcodeReader } from 'vue-barcode-reader';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { useStore as useAuthStore } from '@/template/account/authorization/store';
  import type { Table } from '@/template/components/table';
  import { apiProvider } from '../vozidlo/api';
  import type { Vozidlo } from '../vozidlo/type';
  import { NAME as VOZDILO_NAME } from '@/views/vozidlo/constants';

  export default defineComponent({
    components: {
      CloseIcon,
      StreamBarcodeReader,
    },
    props: {
      isLoginStation: String,
    },
    setup(props) {
      const router = useRouter();
      const logger = useLogger();
      const { t } = useI18n();

      const authStore = useAuthStore();
      const propsRef = toRefs(props);

      const previousDecodetString = ref<string | null>(null);
      const processScan = ref(true);

      let reenableTimeout: number | null = null;

      async function openVozidlo(id: string) {
        const corectedKnr = id.length === 8 ? id.substring(0, 7) : id.length > 13 ? id.substring(0, 13) : id;
        const isKnr = corectedKnr.length === 13;

        isKnr && openEdit(VOZDILO_NAME, PageMode.EDIT, { id: corectedKnr });

        const response = await apiProvider.tableData<Table<Vozidlo>>({
          tableName: STORE_TABLE,
          filter: { knr: corectedKnr, vyrobniLinkaId: authStore?.user?.vyrobniLinkaId ?? null },
        });
        if (response?.data?.rows) {
          const firstKnr = response?.data?.rows.find((i) => i.knr?.toString().endsWith(corectedKnr));
          if (!firstKnr?.knr) {
            logger.log(`${t('vyrobniLinkaId')}: ${authStore?.user?.vyrobniLinkaId}, ${t('zleKnr')}: ${corectedKnr}`);
            return;
          }
          openEdit(VOZDILO_NAME, PageMode.EDIT, { id: firstKnr.knr });
        }
      }

      async function openLoginStation(id: string) {
        authStore && (authStore.userQrId = id);
        router.back();
      }
      const isLoginStation = computed(() => router.currentRoute.value.params.isLoginStation === 'true');

      function onDecode(decodedString: string) {
        if (!processScan.value) return;
        if (previousDecodetString.value === decodedString) {
          if (reenableTimeout) {
            clearTimeout(reenableTimeout);
          }
          reenableTimeout = window.setTimeout(() => {
            processScan.value = true;
            reenableTimeout = null;
          }, 1000);
          processScan.value = false;
        }
        previousDecodetString.value = decodedString;

        if (decodedString) {
          const id = decodedString.replace('/+s/g', '');
          if (isLoginStation.value) openLoginStation(id);
          else openVozidlo(id);
        }
      }
      function logErrors(promise: Promise<unknown>) {
        promise.catch(console.error);
      }
      function onLoaded(_e: Event) {
      }

      const visible = ref(true);

      function back() {
        router.back();
      }

      onBeforeUnmount(() => {
        if (reenableTimeout) {
          clearTimeout(reenableTimeout);
          reenableTimeout = null;
        }
      });

      return { onDecode, logErrors, visible, CloseIcon, back, onLoaded };
    },
  });
</script>

<style lang="scss" scoped>
  .colse-fixed {
    position: fixed;
    top: 0;
    right: 0;
    overflow: hidden;
    margin-top: 10px;
    margin-right: 10px;
    button {
      background-color: inherit !important;
      i {
        margin: 0px;
      }
    }
  }
  .qr-scaner_wrapper {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0);
    overflow: auto;
    justify-content: space-evenly;

    @media screen and (orientation: portrait) {
      flex-direction: column;
    }
    @media screen and (orientation: landscape) {
      flex-direction: row;
    }
  }
  .qr-scaner {
  }
</style>
