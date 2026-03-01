import { Table } from '@/template/components/table';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { EnumStatusIo } from '@/views/chyby/constants';

export type Row = {
	ibnNazev: string;
	statusIoEnum: EnumStatusIo;
	pocet: number;
};

export const table = new Table<Row>({
	rows: [],
	name: 'semafor',
	operations: OperationFlags.DEFAULT,
	rowKey: 'ibnNazev',
	gridId: 1,
	filterMapper: (payload) => ({ knr: payload.serverData.knr ?? -1 })
});
