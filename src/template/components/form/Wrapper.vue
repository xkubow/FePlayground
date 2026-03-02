<template>
  <k-col v-bind="{ ...$attrs, ...$props }">
    <k-form-item v-if="wrapp" v-bind="{ label: labelCmp, disabled, required, prop: validationProperty }">
      <slot />
    </k-form-item>
    <slot v-else />
    <slot name="colsuffix" />
  </k-col>
</template>

<script lang="ts">
  import { computed, defineComponent, toRefs } from 'vue';
  import { baseProps } from '../base/base';

  export default defineComponent({
    name: 'k-wrapper',
    props: {
      ...baseProps,
      showLabel: { type: Boolean, default: true },
      wrapp: { type: Boolean, default: true },
      validationProperty: String,
      validationRules: [Object, Array],
      required: { type: Boolean, default: false },
      disabled: Boolean,
    },
    setup(props) {
      const { showLabel, label, span } = toRefs(props);
      const labelCmp = computed((): string | undefined => (showLabel.value ? label.value : undefined));

      return { labelCmp };
    },
  });
</script>

<style lang="scss" scoped></style>
