import _ from 'lodash';
import type { UnknownObject } from '../@types/kTemplate';

export const emptyFunc = () => {
  //empty
};

const dateMapper = (value: unknown, key: string) => {
  /** re-typed form data: "date string" to "Date object" type */
  if (key.endsWith('Datum') && value) {
    if (typeof value === 'object' && 'Od' in value && 'Do' in value) {
      const Od = value.Od ? new Date(value.Od) : null;
      const Do = value.Do ? new Date(value.Do) : null;
      if (!Number.isNaN(Od) && !Number.isNaN(Do)) {
        return { Od, Do };
      }
    } else {
      const dateVal = new Date(value);
      if (!Number.isNaN(dateVal)) {
        return dateVal;
      }
    }
    throw Error(`wrong date value: ${key}, ${value}`);
  }
  return value;
};

export const valueMapper = (value: unknown, key: string) => dateMapper(value, key);

export const dataMapper = (state: UnknownObject, data: UnknownObject) => _.assign(state, _.mapValues(data, valueMapper));

export function removeWhiteSpaceToClipboard(evt: ClipboardEvent) {
  evt.stopPropagation();
  evt.preventDefault();
  const selection = window.getSelection();
  const knrInerText = (evt.target as HTMLElement).innerText;
  const correctedText = knrInerText.substring(selection?.anchorOffset ?? 0, selection?.focusOffset).replace(/\s/g, '');

  navigator.clipboard.writeText(correctedText);
}
