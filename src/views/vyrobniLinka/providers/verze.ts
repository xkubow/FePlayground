import type { Ref } from 'vue';
import type { VerzeDropDownItem } from '../type';

export function useVerze(verzeList: Ref<VerzeDropDownItem[]>) {
  function verzeFilter(vyrobniLinkaId: number) {
    return verzeList.value.filter((v) => v.vyrobniLinkaId === vyrobniLinkaId);
  }

  return { verzeFilter };
}
