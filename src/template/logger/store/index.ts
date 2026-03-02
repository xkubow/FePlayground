import { defineStore } from 'pinia';
import { LogLevel, LOG_LENGTH } from '../constants';
import type { Log, Options } from '../type';

export const useStore = defineStore('logger', {
  state: () => ({
    list: [] as Log[],
    options: {
      useStore: false,
      logTypeRedirection: LogLevel.off,
    },
  }),
  getters: {},
  actions: {
    log(payload: Log) {
      this.list.push(payload);
      if (this.list.length > LOG_LENGTH) this.list.shift();
    },
    optionsSet(payload: Partial<Options>) {
      Object.assign(this.options, payload);
    },
    remove({ index, size = 1 }: { index: number; size: number }) {
      this.list = [...this.list.slice(0, index), ...this.list.slice(index + size)];
    },
  },
});
