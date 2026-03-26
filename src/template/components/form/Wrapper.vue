<template>
  <k-col v-bind="colBind">
    <k-form-item v-if="wrapp" v-bind="{ label: labelCmp, disabled, required, prop: validationProperty }">
      <slot />
    </k-form-item>
    <slot v-else />
    <slot name="colsuffix" />
  </k-col>
</template>

<script lang="ts">
  import { computed, defineComponent, toRefs, useAttrs } from 'vue';
  import { baseProps } from '../base/base';

  export default defineComponent({
    name: 'k-wrapper',
    inheritAttrs: false,
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
      const attrs = useAttrs();
      const { showLabel, label, span, sm, xs } = toRefs(props);
      const labelCmp = computed((): string | undefined => (showLabel.value ? label.value : undefined));

      const colBind = computed(() => ({
        xs: xs.value,
        sm: sm.value,
        span: span.value,
        class: attrs.class as string | Record<string, boolean> | undefined,
        style: attrs.style as string | Record<string, string> | undefined,
      }));

      return { labelCmp, colBind };
    },
  });
</script>

<style lang="scss" scoped></style>
