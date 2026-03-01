<template>
	<div>
		<k-row>
			<k-checkbox v-model="checkModel.baterka" :label="t('EskalaceCheckModel.Baterka')" />
		</k-row>
		<k-row>
			<k-checkbox v-model="checkModel.svorkovnice" :label="t('EskalaceCheckModel.Svorkovnice')" />
		</k-row>
		<k-row>
			<k-checkbox v-model="checkModel.poistky" :label="t('EskalaceCheckModel.Poistky')" />
		</k-row>
		<k-row>
			<k-checkbox v-model="checkModel.kostra" :label="t('EskalaceCheckModel.Kostra')" />
		</k-row>
		<k-row>
			<k-checkbox v-model="checkModel.svazky" :label="t('EskalaceCheckModel.Svazky')" />
		</k-row>
		<k-row>
			<k-upload ref="uploadRef" action="#" :auto-upload="false" :http-request="uoloadFile" :limit="1" style="margin: 8px 0px" accept=".html">
				<k-button :icon="PlusIcon" label-key="DokumentOdis" />
			</k-upload>
		</k-row>
	</div>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch } from 'vue';
import { Plus as PlusIcon } from '@element-plus/icons-vue';
import type { UploadRequestOptions, UploadInstance } from 'element-plus';
import { isArray } from 'lodash';
import { apiProviderEskalace } from '@/views/prilohy/api';
import { useI18n } from 'vue-i18n';

export interface Props {
	allMandatoryDone: boolean;
	eskalaceId?: number | null;
}
const { t } = useI18n();
const uploadRef = ref<UploadInstance>();
const props = defineProps<Props>();
const propsRef = toRefs(props);
const emits = defineEmits(['update:allMandatoryDone']);

const checkModel = ref({
	baterka: false,
	svorkovnice: false,
	poistky: false,
	kostra: false,
	svazky: false,
});

const allDone = computed(
	() =>
		checkModel.value.baterka &&
		checkModel.value.svorkovnice &&
		checkModel.value.poistky &&
		checkModel.value.kostra &&
		checkModel.value.svazky &&
		uploadRef.value?.fileList.length === 1,
);

watch(allDone, (isDone) => {
	isDone && emits('update:allMandatoryDone', isDone);
});

function uoloadFile(option: UploadRequestOptions) {
	console.log('UploadFile', option);

	const formData = new FormData();
	if (option.data) {
		for (const [key, value] of Object.entries(option.data)) {
			if (isArray(value) && value.length) formData.append(key, ...(value as [Blob, string]));
			else formData.append(key, value);
		}
	}
	formData.append(option.filename, option.file, option.file.name);
	apiProviderEskalace.create(propsRef.eskalaceId?.value as number, formData);
}

function upload() {
	const tt = uploadRef.value!.$refs.uploadRef as UploadInstance;
	tt.submit();
}

function clear() {
	checkModel.value.baterka = false;
	checkModel.value.svorkovnice = false;
	checkModel.value.poistky = false;
	checkModel.value.kostra = false;
	checkModel.value.svazky = false;
	const tt = uploadRef.value!.$refs.uploadRef as UploadInstance;
	tt.clearFiles();
}

defineExpose({
	upload,
	clear,
});
</script>

<style scoped></style>
