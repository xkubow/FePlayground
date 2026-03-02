import { Page } from '@/template/page/@types/page';
import { pageStoreFactory } from '@/template/page/store';
import { NAME } from './constants';

const serverData = {
  id: null as number | null,
  name: null as string | null,
};

export type ServerData = typeof serverData;

const page = new Page(NAME, serverData, {}, {}, {});

export const useStore = pageStoreFactory({ name: NAME, page, extraGetters: {}, extraActions: {} });
