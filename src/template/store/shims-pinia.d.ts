import 'pinia';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    resetAllStores: () => void;
    resetAllPages: () => void;
  }
}
