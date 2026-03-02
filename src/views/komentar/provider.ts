import type { InitTables } from '@/template/page/@types/page';
import { apiProvider, apiProviderEskalaceKomentar, apiProviderVraceniBaterieKomentar } from './api';
import type { ComputedRef, Ref } from 'vue';
import { NAME } from './constants';
import type { Komentar, LoadEskalaceKomentar } from './type';
import type { Eskalace } from '../eskalace/type';

export function useVozidloKomentar(edit: InitTables, knr: Ref<number | null>) {
  const addKomentar = async function ({ text }: { text: string }) {
    if (!knr.value) throw new Error('knr not exists');
    await apiProvider.createEntity({ text, knr: knr.value });
    edit.fetchTableData({ tablesToFetch: [NAME], filter: { knr: knr.value } });
  };
  async function updateKomentar(komentar: Komentar) {
    if (!knr.value) throw new Error('knr not exists');
    await apiProvider.updateKomentarEntity(komentar);
    edit.fetchTableData({ tablesToFetch: [NAME], filter: { knr: knr.value } });
  }
  async function deleteKomentar(komentar: Komentar) {
    if (!knr.value) throw new Error('knr not exists');
    await apiProvider.deleteEntity(komentar.id);
    edit.fetchTableData({ tablesToFetch: [NAME], filter: { knr: knr.value } });
  }

  return { addKomentar, updateKomentar, deleteKomentar };
}

export function useEskalaceKomentar(loadEskalaceKomentar: LoadEskalaceKomentar, eskalaceRef: ComputedRef<Eskalace>) {
  const addEskalaceKomentar = async function ({ text }: { text: string }) {
    if (!eskalaceRef.value) throw new Error('knr not exists');
    await apiProviderEskalaceKomentar.createEntity({ text, eskalaceId: eskalaceRef.value.id });
    loadEskalaceKomentar(eskalaceRef.value.id);
  };
  async function updateEskalaceKomentar(komentar: Komentar) {
    await apiProvider.updateKomentarEntity(komentar);
    loadEskalaceKomentar(eskalaceRef.value.id);
  }
  async function deleteEskalaceKomentar(komentar: Komentar) {
    await apiProvider.deleteEntity(komentar.id);
    loadEskalaceKomentar(eskalaceRef.value.id);
  }

  return { addEskalaceKomentar, updateEskalaceKomentar, deleteEskalaceKomentar };
}

export function useVraceniBaterieKomentar(edit: InitTables, vraceniBaterieId: Ref<number | null>) {
  const addKomentar = async function ({ text }: { text: string }) {
    if (!vraceniBaterieId.value) throw new Error('knr not exists');
    await apiProviderVraceniBaterieKomentar.createEntity({ text, vraceniBaterieId: vraceniBaterieId.value });
    edit.fetchTableData({ tablesToFetch: [NAME], filter: { vraceniBaterieId: vraceniBaterieId.value } });
  };
  async function updateKomentar(komentar: Komentar) {
    if (!vraceniBaterieId.value) throw new Error('knr not exists');
    await apiProviderVraceniBaterieKomentar.updateKomentarEntity(komentar);
    edit.fetchTableData({ tablesToFetch: [NAME], filter: { vraceniBaterieId: vraceniBaterieId.value } });
  }
  async function deleteKomentar(komentar: Komentar) {
    if (!vraceniBaterieId.value) throw new Error('knr not exists');
    await apiProviderVraceniBaterieKomentar.deleteEntity(komentar.id);
    edit.fetchTableData({ tablesToFetch: [NAME], filter: { vraceniBaterieId: vraceniBaterieId.value } });
  }

  return { addKomentar, updateKomentar, deleteKomentar };
}
