<template>
	<el-card :style="{ overflow: setOverflowClass }">
		<template #header v-if="isHeaderSlot || isHeaderText">
			<div>
				<slot name="header">
					<span v-if="isHeaderText">{{ headerLocalizationText }}</span>
					<div class="action-buttons">
						<!-- user defined buttons in slot -->
						<slot name="userDefinedButtons" />
					</div>
				</slot>
			</div>
		</template>
		<k-row v-if="row" v-bind="{ gutter }">
			<slot />
		</k-row>
		<slot v-else />
	</el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'k-card',
	props: {
		gutter: { type: Number, default: 10 },
		headerLocalizationKey: { type: String, required: false },
		headerText: { type: String, required: false },
		row: { type: Boolean, default: false },
	},
	computed: {
		isHeaderText() {
			return this.headerLocalizationKey || this.headerText;
		},
		isHeaderSlot() {
			return !!this.$slots.header;
		},
		headerLocalizationText() {
			return this.headerText ? this.headerText : 'todo LocalizePopisostatni'; //this.LocalizePopisostatni(this.headerLocalizationKey);
		},
		setOverflowClass() {
			return this.row ? 'visible' : 'hidden';
		},
	},
});
</script>

<style lang="scss" scoped>
.action-buttons {
	float: right;
	margin-top: -4px;
}
</style>
