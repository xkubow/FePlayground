<template>
  <table>
    <caption>
      {{
        t('semafor')
      }}
    </caption>
    <tbody>
      <tr v-for="item in modelValue" :key="item.ibnNazev">
        <td class="text">{{ item.ibnNazev }}</td>
        <td :style="statusBacground(item.statusIoEnum)" class="text">{{ item.pocet }}</td>
      </tr>
      <tr key="fin">
        <td class="text">Fin</td>
        <td :style="statusFinBacground(fin)" class="text">
          <span v-if="!isFinNull">
            <CheckIcon v-if="fin" />
            <Warning v-else />
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
  import type { Row } from '@/template/components/table/@types/table';
  import { EnumStatusIo } from '@/views/chyby/constants';
  import { useLocale } from 'element-plus';
  import { isNil } from 'lodash-es';
  import type { Row as RowSemafor } from '../tables/semafor';
  import { Check as CheckIcon, Warning } from '@element-plus/icons-vue';
  import { computed } from 'vue';

  export interface Props {
    modelValue: Row<RowSemafor>[];
    fin: boolean | null;
  }

  const { t } = useLocale();

  const props = defineProps<Props>();

  const isFinNull = computed(() => isNil(props.fin));

  const statusFinBacground = (fin: boolean | null) => {
    const bgColor = isNil(fin) ? 'white' : fin ? '#9bd1a7' : 'red';

    return `background-color: ${bgColor}`;
  };

  const statusBacground = (stav: EnumStatusIo) => {
    const bgColor = isNil(stav) || stav === EnumStatusIo.bezChyb ? 'white' : stav === EnumStatusIo.neopraveno ? 'red' : '#9bd1a7';

    return `background-color: ${bgColor}`;
  };
</script>

<style scoped>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    border: 3px solid black;
    width: 100%;
  }

  td,
  th {
    border: 1px solid black;
    padding: 3px !important;
    min-width: 30px;
    text-align: end;
  }

  .text {
    background-color: #dcdcdc;
    padding-right: 4px;
  }
</style>
