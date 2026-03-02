import type { Ref } from 'vue';

export interface Localization {
  language: Ref<string | null>;

  localize(key: string): string;
}
