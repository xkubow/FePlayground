<!-- <span class="el-tag is-closable el-tag--info el-tag--default el-tag--light"><span class="el-tag__content"><span class="el-select__tags-text" style="max-width: 396.156px;">0. série</span></span><i class="el-icon el-tag__close"><svg class="icon" width="200" height="200" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592L512 466.88 259.712 214.592a31.936 31.936 0 00-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1045.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0045.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 10-45.12-45.184z"></path></svg></i></span> -->
<template>
	<table class="description_table">
		<caption>
			{{
				t('popis')
			}}
		</caption>
		<tbody>
		<tr class="d-n">
			<th>{{ t('text') }}</th>
			<th>{{ t('hodnota') }}</th>
		</tr>
		<template v-if="!hideKnrStitok">
			<tr>
				<td>{{ t('knr') }} :</td>
				<td>{{ vozidlo?.knr }}</td>
			</tr>
			<tr>
				<td>{{ t('stitok') }} :</td>
				<td>
					<K-stitok v-for="stitek in stitky" :key="stitek">
						{{ stitek }}
					</K-stitok>
				</td>
			</tr>
		</template>
		<tr>
			<td>{{ t('rokATydenVyroby') }} :</td>
			<td>{{ vozidlo?.vyrobaDatum?.toLocaleString(actualLocale) }}</td>
		</tr>
		<tr>
			<td>{{ t('vyrobniLinka') }} :</td>
			<td>{{ vozidlo?.linka }}</td>
		</tr>
		<tr>
			<td>{{ t('model') }} :</td>
			<td>{{ vozidlo?.modelText }}</td>
		</tr>
		<tr>
			<td>{{ t('m100CisloZavesu') }} :</td>
			<td>{{ `${vozidlo?.m100CisloZavesu ?? ''}` }}</td>
		</tr>
		<tr>
			<td>{{ t('motorText') }} :</td>
			<td>{{ vozidlo?.motorText }}</td>
		</tr>
		<tr>
			<td>{{ t('zakladniMotorText') }} :</td>
			<td>{{ vozidlo?.zakladniMotorText }}</td>
		</tr>
		<tr>
			<td>{{ t('prevodovkaText') }} :</td>
			<td>{{ vozidlo?.prevodovkaText }}</td>
		</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import { actualLocale } from '@/template/utils/date';
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Vozidlo } from '../type';

export interface Props {
	vozidlo?: Vozidlo;
	stitky?: string[];
	hideKnrStitok?: boolean;
}

const props = defineProps<Props>();
const { vozidlo, hideKnrStitok } = toRefs(props);

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>
