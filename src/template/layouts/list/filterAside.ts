import { ref } from 'vue';

export function useFilterAside() {
  const showFilter = ref(false);

  return { showFilter };
}
