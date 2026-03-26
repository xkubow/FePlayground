import type { Table } from '@/template/components/table';
import { STORE_TABLE } from '@/template/page/constants';
import { ref, type Ref, type WritableComputedRef } from 'vue';
import { apiProvider } from './api';
import type { Uzivatel, UzivatelPrirazeno } from './type';
import type { DropdownItem } from '@/template/page/@types/mode';
import { apiProvider as uzivatelApiProvider } from '../uzivatel/api';

export function useUzivatel(payload: { filter?: { selectedId?: Ref<string | null>; selectedIds?: Ref<string[]>; filteredList: Ref<Uzivatel[]> } }) {
  const remoteFilterLoading = ref(false);
  async function remoteFilter(query: string) {
    if (!payload.filter) return;
    if (query && query.length >= 2) {
      try {
        remoteFilterLoading.value = true;
        const skupinaPredaniResponse = await apiProvider.tableData<Table<Uzivatel>>({ filter: { zobrazeneJmeno: query }, tableName: STORE_TABLE });
        const tableResponse: Table<Uzivatel> = skupinaPredaniResponse?.data as Table<Uzivatel>;
        const filter = (i: Uzivatel) =>
          payload.filter?.selectedId ? payload.filter?.selectedId?.value === i.id : payload.filter?.selectedIds?.value.includes(i.id);
        const selected = payload.filter.filteredList.value.filter(filter);

        payload.filter.filteredList.value = [...selected, ...tableResponse.rows];
      } finally {
        remoteFilterLoading.value = false;
      }
    } else {
      payload.filter.filteredList.value = [];
    }
  }

  return { remoteFilterLoading, remoteFilter };
}

export const uzivatelPrirazeno = {
  uzivatelPrirazeno: [] as string[],
  uzivatelPrirazenoDropDownList: [] as DropdownItem<string>[],
} as UzivatelPrirazeno;

export function useUzivatelPrirazeno(uzivatelPrirazeno: Ref<string[]>, uzivatelPrirazenoDropDownList: Ref<DropdownItem<string>[]>) {
  const predaniLoading = ref(false);
  async function predaniRemoteMethod(query: string) {
    if (query && query.length >= 2) {
      try {
        predaniLoading.value = true;
        const skupinaPredaniResponse = await uzivatelApiProvider.tableData<Table<Uzivatel>>({ filter: { zobrazeneJmeno: query }, tableName: STORE_TABLE });
        const tableResponse: Table<Uzivatel> = skupinaPredaniResponse?.data as Table<Uzivatel>;
        const selected = uzivatelPrirazenoDropDownList.value.filter((i) => uzivatelPrirazeno.value.includes(i.value));
        uzivatelPrirazenoDropDownList.value = [...selected, ...tableResponse.rows.map((i) => ({ value: i.id, text: i.zobrazeneJmeno }))];
      } finally {
        predaniLoading.value = false;
      }
    } else {
      uzivatelPrirazenoDropDownList.value = [];
    }
  }

  return {
    predaniLoading,
    predaniRemoteMethod,
  };
}
