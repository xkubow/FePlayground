<template>
  <div class="bordered pl-10">
    <k-row>
      <k-input-number label-key="dobaOpravyMinuty" :modelValue="dobaOpravyMinutyCmp" :span="4" :required="required" @update:modelValue="setDobaOpravyMinuty" />
      <k-date-interval
        :modelValue="intervalCmp"
        label-key="Od-Do"
        v-bind="{ type: 'datetime', format: 'DD.MM.YYYY HH:mm', required: true }"
        isHiddenLabel
        overwriteHiddenLabel
        :span="16"
        @update:modelValue="setInterval"
        validationProperty="intervalOpravy"
      />
    </k-row>
    <k-row>
      <k-input label-key="text" validationProperty="casOpravyText" v-model="textCmp" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
    </k-row>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRefs, ref } from 'vue';
  import { Interval } from '@/template/components/@types';
  import dayjs from 'dayjs';

  export interface Props {
    knr?: number | null;
    dobaOpravyMinuty: number | null;
    intervalOpravy: Interval<Date | null>;
    text: string | null;
    required?: boolean | null;
  }

  const emit = defineEmits(['update:dobaOpravyMinuty', 'update:intervalOpravy', 'update:text']);

  const props = defineProps<Props>();
  const propsRef = toRefs(props);

  const dobaOpravyMinutyCmp = computed(() => {
    const { od, do: to } = propsRef.intervalOpravy.value;
    if (!od || !to) return 0;
    return Math.max(0, dayjs(to).diff(dayjs(od), 'minute'));
  });

  function setDobaOpravyMinuty(min: number) {
    const to = propsRef.intervalOpravy.value.do;
    if (!to) return;
    const safe = Math.max(0, min || 0);
    emit('update:intervalOpravy', {
      od: dayjs(to).subtract(safe, 'minute').toDate(),
      do: to,
    });
    emit('update:dobaOpravyMinuty', min);
  }

  // user edits interval (e.g., via a picker)
  function setInterval(val: Interval) {
    if (val.do && (!val.od || val.do < val.od)) {
      val = { ...val, od: val.do };
    }
    emit('update:intervalOpravy', val);
    const minutes = dayjs(val.do).diff(dayjs(val.od), 'minute');
    emit('update:dobaOpravyMinuty', minutes);
  }

  const intervalCmp = computed(() => propsRef.intervalOpravy.value);

  const textCmp = computed({
    get() {
      return propsRef.text.value;
    },
    set(val) {
      emit('update:text', val);
    },
  });
</script>

<style scoped>
  .demo-radius .title {
    color: var(--el-text-color-regular);
    font-size: 18px;
    margin: 10px 0;
  }

  .demo-radius .value {
    color: var(--el-text-color-primary);
    font-size: 16px;
    margin: 10px 0;
  }

  .demo-radius .radius {
    height: 40px;
    width: 70%;
    border: 1px solid var(--el-border-color);
    border-radius: 0;
    margin-top: 20px;
  }
</style>
