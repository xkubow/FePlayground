import { setWith } from 'lodash-es';

export const fieldAccess = {
  setField(fildName: string, value: any): void {
    setWith(this, fildName, value);
  },
};
