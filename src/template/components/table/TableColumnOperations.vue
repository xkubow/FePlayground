<template>
	<el-table-column v-bind="{ ...$attrs, ...$props, label: labelText, headerAlign: 'center', width, align: 'center' }">
		<template #header>
			<slot name="header">
				<k-table-column-header v-bind="{ labelKey }" />
			</slot>
		</template>
		<template #default="scope">
			<slot :row="scope.row">
				<!-- {{ scope.row }} -->
				<k-button
					v-for="btn in buttons.rowButtons(useRowOperations ? scope.row.operations : operations)"
					:disabled="btnDisabled(btn)"
					:key="btn.value"
					@click.stop="btn.onClickAction($event, scope.row, rowKey)"
				>
					<el-icon :size="20">
						<component :is="btn.icon"></component>
					</el-icon>
				</k-button>
				<k-button
					v-for="btn in btnsVisible(scope.row)"
					v-show="btn.isVisible(scope.row)"
					:key="btn.value"
					@click="btn.onClickAction($event, scope.row, rowKey)"
				>
					<el-icon :size="20">
						<component :is="btn.icon"></component>
					</el-icon>
				</k-button>
			</slot>
		</template>
	</el-table-column>
</template>

<script lang="ts">
import { removesuffixFromName } from '@/template/page/constants';
import { defineComponent, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { baseProps, useBase } from '../base/base';
import type { ExtraButton, Row } from './@types/table';
import { buttonEmits, initButtons } from './buttons';
import KTableColumnHeader from './TableColumnHeader.vue';
import { VIEW } from './tableOperations';

export default defineComponent({
	name: 'k-table-column',
	components: {
		KTableColumnHeader,
	},
	props: {
		...baseProps,
		width: { type: Number, default: 70 },
		extraButtons: { type: Object as () => ExtraButton[] },
		objectName: { type: String },
		operations: Number,
		rowKey: { type: String, default: '0' },
		useRowOperations: Boolean,
	},
	emits: buttonEmits,
	setup(props, { emit }) {
		const router = useRouter();

		const propsRef = toRefs(props);
		const baseInit = useBase(propsRef);
		const name = router.currentRoute.value.name as string;
		const NAME = propsRef.objectName.value ?? removesuffixFromName(name);
		const buttons = initButtons(NAME, props.extraButtons, emit);

		function btnsVisible(row: Row) {
			return buttons.extraButtons.filter((b) => b.isVisible(row));
		}

		function btnDisabled(btn: ExtraButton) {
			return btn.value === VIEW ? false : undefined;
		}

		return { ...baseInit, buttons, btnsVisible, btnDisabled };
	},
});
</script>

<style scoped></style>
