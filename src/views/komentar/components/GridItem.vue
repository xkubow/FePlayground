<template>
	<div class="mb-10">
		<div class="comment-header">
			<p>{{ modelValue.vstupUzivatelZobrazeneJmeno }} - {{ toLocale(modelValue.vstupDatum) }}</p>
		</div>
		<k-row class="coment-item">
			<k-rich-text v-if="edit" v-model="novyKomentar" v-bind="{ baseUrl }" />
			<!-- <k-input v-if="edit" v-model="novyKomentar" v-bind="{ wrapp: false, type: 'textarea', rows: 4, labelKey: 'NovyKomentar' }" /> -->
			<span v-dompurify-html="modelValue.text" class="p-2" v-else></span>
		</k-row>
		<k-row v-if="editable">
			<span v-if="edit">
				<k-button @click="save" size="small" :icon="FinishedIcon" />
				<k-button @click="edit = false" size="small" :icon="CloseIcon" />
				<k-button size="small" :icon="ConnectionIcon" />
			</span>
			<span v-else>
				<k-button v-if="visibleEdit" @click="editKoment" size="small" :icon="EditIcon" />
				<k-button v-if="visibleDelete" @click="deleteKoment" size="small" :icon="DeleteIcon" />
			</span>
		</k-row>
	</div>
	<el-divider style="margin: 15px 0px" />
</template>

<script setup lang="ts">
import { toLocale } from '@/template/utils/date';
import { Close as CloseIcon, Connection as ConnectionIcon, Delete as DeleteIcon, Edit as EditIcon, Finished as FinishedIcon } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { computed, onUnmounted, ref, toRefs, watch } from 'vue';
import { NAME as NAME_PRILOHY } from '../../prilohy/constants';
import type { Komentar } from '../type';

export interface Props {
	modelValue: Komentar;
	visibleEdit?: boolean;
	visibleDelete?: boolean;
	entita: string;
	knr?: number | null;
}
const props = defineProps<Props>();
const propsRef = toRefs(props);

const edit = ref(false);
const editable = computed(() => !now.value.isAfter(dayjs(propsRef.modelValue.value.vstupDatum).add(5, 'm')));
const novyKomentar = ref('');
const now = ref(dayjs());

const intervalRef = ref<number | null>(null);

function startNowInterval() {
	if (intervalRef.value) {
		clearInterval(intervalRef.value);
	}
	intervalRef.value = window.setInterval(() => {
		now.value = dayjs();
	}, 30000);
}

if (propsRef.visibleEdit?.value) {
	startNowInterval();
}

watch(() => propsRef.visibleEdit?.value, (v) => {
	if (v) startNowInterval();
	else if (intervalRef.value) {
		clearInterval(intervalRef.value);
		intervalRef.value = null;
	}
});

onUnmounted(() => {
	if (intervalRef.value) {
		clearInterval(intervalRef.value);
		intervalRef.value = null;
	}
});

const emits = defineEmits(['save', 'delete']);

function editKoment() {
	novyKomentar.value = propsRef.modelValue.value.text;
	edit.value = true;
}
function deleteKoment() {
	emits('delete', propsRef.modelValue.value);
}
function save() {
	emits('save', { ...propsRef.modelValue.value, text: novyKomentar.value });
	edit.value = false;
}

const baseUrl = computed(() => {
	return `${import.meta.env.VITE_APP_API_BASE_URL}/${props.entita}/${NAME_PRILOHY}?knr=${props.knr}`;
});
</script>

<style lang="scss" scoped></style>
