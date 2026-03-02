<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  // import { QrcodeStream } from 'vue3-qrcode-reader';
  import { useVyhladavanie } from './vyhladavanie';

  export interface Props {
    id: string;
  }

  const props = defineProps<Props>();

  onMounted(() => {
    if (props.id) vyhladavani.decode(props.id as string);
  });

  const vyhladavani = useVyhladavanie();
</script>

<style lang="scss" scoped></style>
