import type { UpdateStatus } from '../table';
import type kTable from '../table/Table.vue';
export { UpdateStatus } from '../table';

export type KTable = typeof kTable;

export type IdUpdateStatus = { id: string; updateStatus: UpdateStatus | null };

export class Interval<T = Date> {
  od: T | null = null;
  do: T | null = null;
}
