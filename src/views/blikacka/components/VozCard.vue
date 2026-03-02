<template>
  <div class="car_card" :style="vehicleStyle(voz)" @click="carClicked(voz)">
    <div class="at-c">{{ voz.knr }}</div>
    <div class="at-c"><span class="dot" :style="`background-color: ${barvaKod(voz.uiBarvaKod)}`"></span>{{ voz.model }}</div>
  </div>
</template>

<script lang="ts">
  import { PageMode } from '@/template/page/providers/pageMode';
  import { openEdit } from '@/template/router/path';
  import { Vozidlo } from '@/views/vozidlo';
  import { defineComponent, toRefs, type PropType } from 'vue';
  import type { Blikacka } from '../type';

  export default defineComponent({
    props: {
      voz: { type: Object as PropType<Blikacka>, required: true },
      isEditMode: Boolean,
    },
    setup(props) {
      const propsRefs = toRefs(props);
      const vehicleStyle = (voz: Blikacka) => {
        if (voz.oprava) {
          return { background: '#f58c8c' };
        }
        return;
      };
      const carClicked = (voz: Blikacka) => {
        openEdit(Vozidlo.name, propsRefs.isEditMode.value ? PageMode.EDIT : PageMode.VIEW, { id: voz.knr });
      };

      function barvaKod(uiBarvaKod: number) {
        if (uiBarvaKod) {
          let barva = uiBarvaKod.toString(16);
          const zeroCount = 6 - barva.length;
          for (let i = 0; i < zeroCount; i++, barva = `0${barva}`);
          return `#${barva}`;
        }
        return undefined;
      }

      return { vehicleStyle, carClicked, barvaKod };
    },
  });
</script>

<style scoped>
  .car_card {
    border: solid 1px gray;
    border-radius: 10px;
    /* box-shadow: 2px 5px 5px #888888; */
    padding: 4px;
    margin: 2px;
    background-color: white;
    cursor: pointer;
    width: 120px;
    height: 60px;
  }

  .dot {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    vertical-align: middle;
  }
</style>
