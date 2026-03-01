import { useAuthorization } from '@/template/account/authorization/provider';
import type { Table } from '@/template/components/table';
import { useLogger } from '@/template/logger';
import type { TableOptions } from '@/template/page/@types/api';
import type { DropdownItem } from '@/template/page/@types/mode';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { listName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { apiProvider as apiProviderKontrolniBod } from '@/views/vyrobniLinka/kontrolniBod/api';
import { apiProvider as apiProviderSegment } from '@/views/vyrobniLinka/segment/api';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables';
import type { Blikacka } from '../type';

export const server = {
	vyrobniLinkaId: null as number | null,
	vyrobniLinkaSegmentId: null as number | null,
	vyrobniLinkaKontrolniBodId: [] as number[],
	modelovyKlicKod: [] as string[],
};

export const local = {
	vyrobniLinkaSegmentList: [] as DropdownItem[],
	vyrobniLinkaKontrolniBodList: [] as DropdownItem[],
};

export const props = {};

export const tables = {
	table,
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

const { log } = useLogger();
type ExtraActions = { loadLinkaDropDowns(vyrobniLinkaId: number): Promise<void> } & PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
	async filter(filter: Record<string, unknown>) {
		const userStore = useAuthorization();
		if (!this.last) return;
		this.last.serverData.vyrobniLinkaId = userStore.user.value?.vyrobniLinkaId ?? null;
		if (this.last.serverData.vyrobniLinkaId) {
			await this.loadLinkaDropDowns(this.last.serverData.vyrobniLinkaId);
			await this.tableData({ tableName: STORE_TABLE });
			this.last.mainCollapse = this.last.localData.vyrobniLinkaKontrolniBodList.map((i) => `${i.value}`);
		}
	},
	async loadLinkaDropDowns(vyrobniLinkaId: number) {
		if (this.last) {
			const segmentResponse = await apiProviderSegment.getDropDownList({ vyrobniLinkaId });
			this.last.localData.vyrobniLinkaSegmentList = segmentResponse?.data ?? [];
			const kontrolniBodResponse = await apiProviderKontrolniBod.getDropDownList({ vyrobniLinkaId });
			this.last.localData.vyrobniLinkaKontrolniBodList = kontrolniBodResponse?.data ?? [];
		}
	},
	async tableData(
		{ filter, tableName }: { filter?: Record<string, unknown>; tableName: string } = {
			tableName: STORE_TABLE,
		},
	) {
		const entity = this.last;
		if (!entity) throw new Error('Entity doesnt exists');
		const table: Table = entity.tables.table;
		if (!table) throw new Error('Table doesnt exists');
		try {
			table.startLoading();

			let tableFilter: Record<string, unknown> | undefined = { vyrobniLinkaId: entity.serverData.vyrobniLinkaId };
			if (table.filterMapper) {
				tableFilter = table.filterMapper({ ...entity });
			}
			if (!tableFilter.vyrobniLinkaId) return;

			const tableOptions: TableOptions = { ...table.tableOptions(), sorting: 'vyrobaDatum desc' };
			const response = await apiProvider?.tableData<Table<Blikacka>>({
				tableName,
				filter: tableFilter,
				tableOptions,
			});
			if (response && response.data) {
				table.rows = response.data.rows;
				'operations' in response.data && (table.operations = response.data.operations);
			}
			return response;
		} finally {
			table.endLoading();
		}
	},
} as ActionOptions<typeof name, Server, Local, Props, Tables, ExtraGetters, ExtraActions>;

const name = listName(NAME);

const page = new Page(name, server, local, props, tables);

export const useStore = pageStoreFactory({
	name,
	apiProvider,
	page,
	extraGetters: {},
	extraActions,
});
