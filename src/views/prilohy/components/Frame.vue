<template>
  <div class="">
    <k-button @click="uploadImg">
      <k-icon :class="clickableClass" :size="30"><CameraIcon /></k-icon>
    </k-button>
  </div>
  <div>
    <k-upload
      ref="uploadRef"
      :action="actionUrl"
      drag
      :httpRequest="uploadFile"
      :on-success="sucess"
      :on-error="onError"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :file-list="fileList"
      :show-file-list="false"
      :tip="`${t('prilohaVelikostMax')} ${formatBytes(cache.nastaveni?.prilohaVelikostMax ?? 0)}`"
    >
      <div class="'upload-icon'">
        <k-icon><PlusIcon /></k-icon>
      </div>
    </k-upload>
    <div class="odd-color" :span="24" v-for="file in fileList" :key="file.name">
      <k-icon :class="clickableClass" @click="handleRemove(file)"><Delete /></k-icon>
      <span :class="clickableClass" @click="handlePreview(file)">{{ file.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  //https://github.com/element-plus/element-plus/blob/dev/packages/components/upload/src/upload-list.vue
  import { useStore as useCacheStore } from '@/template/cache';
  import { useLogger } from '@/template/logger';
  import { getFileContent, readFileContent } from '@/template/utils/fileHelper';
  import { formatBytes } from '@/template/utils/math';
  import { Delete, Plus as PlusIcon } from '@element-plus/icons-vue';
  import type { Awaitable } from '@vueuse/core';
  import type { AxiosError } from 'axios';
  import { dayjs, type UploadFile, type UploadRawFile, type UploadRequestOptions } from 'element-plus';
  import { Camera as CameraIcon } from '@element-plus/icons-vue';

  import _ from 'lodash';
  import { computed, ref, toRefs } from 'vue';
  import { DatetimeFormat, useI18n } from 'vue-i18n';
  import { NAME as NAME_PRILOHY } from '../../prilohy/constants';
  import { NAME as NAME_ESKALACE } from '@/views/eskalace/constants';
  import { NAME as NAME_VRACENI_ND } from '@/views/vraceniBaterie/constants';
  import { apiProviderVozidlo, apiProviderEskalace } from '../api';
  import type { FileItem, Priloha, UploadInstance } from '../type';
  import { useDisabled } from '@/template/components/base/base';
  import { showAlert } from '@/template/mixins/notifications';
  import type { AxiosErrorMessageResponse } from '@/template/logger/type';

  export interface Props {
    modelValue: Priloha[];
    entita: string;
    parentId?: string | number | null;
    tip?: string;
    operationDeletePriloha?: boolean | null;
    beforeRemove?: (uploadFile: FileItem) => Awaitable<boolean>;
  }
  const props = defineProps<Props>();
  const propsRef = toRefs(props);
  const emits = defineEmits(['update:modelValue', 'refres']);
  const logger = useLogger();
  const { t } = useI18n();
  const { isDisabled } = useDisabled();

  const cache = useCacheStore();
  const uploadRef = ref<UploadInstance>();
  const fileList = computed<FileItem[]>(() => {
    const uploaded = propsRef.modelValue.value
      // .filter((f) => !f.status)
      .map((f) => ({
        id: f.id,
        name: f.celyNazev,
        url: `${baseUrl.value}${separator.value}guid=${f.id}`,
        uid: f.uid,
      }));

    return [...uploaded];
  });

  const isEskalace = computed(() => propsRef.entita.value === NAME_ESKALACE);
  const isVraceniBaterie = computed(() => propsRef.entita.value === NAME_VRACENI_ND);

  const apiProvider = computed(() => (isEskalace.value ? apiProviderEskalace : apiProviderVozidlo));

  const clickableClass = computed(() => (!isDisabled.value ? ['cursor-p', 'hover-color'] : []));

  // const isDisabled = computed(() => disabledProvider.isDisabled.value);

  const paramIdName = computed(() => (isEskalace.value ? 'eskalaceId' : isVraceniBaterie.value ? 'vraceniBaterieId' : 'knr'));

  const baseUrl = computed(() => `${propsRef.entita.value}/${NAME_PRILOHY}?${paramIdName.value}=${propsRef.parentId.value}`);
  const actionUrl = computed(() => `${import.meta.env.VITE_APP_API_BASE_URL}/${baseUrl.value}`);

  async function handleRemove(file: FileItem) {
    const fileValue = propsRef.modelValue.value.find((p) => p.id === file.id);
    if (fileValue && !propsRef.operationDeletePriloha?.value) {
      const vstupDat = dayjs(new Date(fileValue.vstupDatum)).add(5, 'm');
      if (dayjs(new Date(fileValue.vstupDatum)).add(5, 'm').isBefore(dayjs())) {
        showAlert({ message: `${t('nelzeZmazat')} soubor ${file.name}` });
        return;
      }
    }
    let doRemove = true;
    if (propsRef.beforeRemove?.value) {
      doRemove = await propsRef.beforeRemove.value(file);
    }
    if (!doRemove) return;
    try {
      const fileToDelete = 'id' in file ? file : (fileList.value.find((f) => f.uid === file.uid) as FileItem);
      fileToDelete && 'id' in fileToDelete && (await apiProvider.value.delete(`${baseUrl.value}${separator.value}guid=${fileToDelete.id}`));
      removeItem(file);
    } catch (error) {
      console.log(error);
      logger.logAxiosError(error as AxiosError<AxiosErrorMessageResponse>);
    }
  }

  function removeItem(file: FileItem) {
    const updated = [...propsRef.modelValue.value];
    _.remove(updated, (i) => ('id' in file ? i.id === file.id : i.uid === file.uid));
    emits('update:modelValue', updated);
  }

  const separator = computed(() => (baseUrl.value.includes('?') ? '&' : '?'));

  const handlePreview = async (uploadFile: FileItem) => {
    if (!props.parentId || !('url' in uploadFile)) return;

    try {
      const response = await apiProvider.value.fetchBlobs(`${baseUrl.value}${separator.value}guid=${uploadFile.id}`);
      if (!response?.data) return;
      const contentDisposition = response.headers['content-disposition'] as string;
      // Extract the filename
      let fileName = 'default_attachment'; // default filename
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(contentDisposition);

      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
        fileName = decodeURIComponent(fileName.trim());
      }
      let file = new File([response.data as Blob], fileName, { type: 'application/octet-stream' });
      console.log('file', file.name);

      var _url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = _url;
      a.setAttribute('target', '_blank'); //TODO not working correctly. It should open image in new window. Probably it is possible just in dialog.
      a.setAttribute('rel', 'noopener noreferrer');
      a.rel = 'noopener noreferrer';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      logger.logCatch(err);
    }
  };

  function beforeUpload(rawFile: UploadRawFile) {
    const maxFileSize = cache.nastaveni?.prilohaVelikostMax;
    if (maxFileSize && maxFileSize > 0) {
      const isOverSize = rawFile.size > maxFileSize;
      isOverSize && logger.log(`${t('prilohaVelikostMax')} ${t('prekrocena')}`, { type: 'error' });
      return !isOverSize;
    } else {
      return true;
    }
  }

  function sucess(response: any, uploadFile: UploadRawFile) {
    emits('update:modelValue', [
      ...propsRef.modelValue.value,
      { id: response, celyNazev: uploadFile.name, velikost: uploadFile.size, vstupDatum: new Date(), uid: uploadFile.uid },
    ]);
  }

  const onError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
    logger.log(`${uploadFile.name}`, { title: `${t('chyba')} ${t('nahrani suboru')}` });
  };

  async function uploadImg() {
    try {
      const fileContent = await getFileContent('image/*', 'environment');
      const data: FormData = new FormData();
      data.append('file', fileContent.content, fileContent.name);
      const response = await apiProvider.value.uploadMultipart(baseUrl.value, data);
      if (!response) return;
      const uploadedFile = { id: response.headers.location, celyNazev: fileContent.name, velikost: fileContent.size, vstupDatum: new Date() };
      emits('update:modelValue', [...propsRef.modelValue.value, uploadedFile]);
    } catch (err) {
      logger.logCatch(err);
    }
  }

  async function uploadFile(options: UploadRequestOptions) {
    try {
      const fileContent = await readFileContent(options.file);
      const data: FormData = new FormData();
      data.append('file', fileContent, options.file.name);
      const response = await apiProvider.value.uploadMultipart(baseUrl.value, data);
      return response?.headers.location;

      // if (!response) return;
      // const uploadedFile = { id: response.headers.location, celyNazev: fileContent.name, velikost: fileContent.size, vstupDatum: new Date() };
      // emits('update:modelValue', [...propsRef.modelValue.value, uploadedFile]);
    } catch (err) {
      logger.logCatch(err);
    }
  }
</script>

<style scoped>
  .upload-icon {
    margin: 10px;
  }
</style>
