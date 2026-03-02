import { ref } from 'vue';
import type { Localization } from './@types/localization';

export const localization: Localization = {
  language: ref('cz'),
  localize: (key: string) => `??${key}`,
};
