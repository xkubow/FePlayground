import { Page } from '@/template/page/@types/page';
import { listName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { apiProvider } from '../api';
import { NAME } from '../constants';
import { table } from '../tables/prehled';
// import tableData from '../tables/prehled.json';
import { Table } from '@/template/components/table';
import type { DropdownItem } from '@/template/page/@types/mode';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { useAuthorization } from '@/template/account/authorization/provider';
import { apiProvider as apiProviderSegment } from '@/views/vyrobniLinka/segment/api';
import { Interval } from '@/template/components/@types';

export const server = {
	VozidloZavadaId: null as number | null,
	modelovaTridaKod: [] as string[],
	modelovaSkupinaKod: [] as string[],
	vyrobniLinkaId: null as number | null,
	vyrobniLinkaSegmentId: null as number | null,
	vstupDatum: new Interval(),
};

export const local = {
	vyrobniLinkaSegmentList: [] as DropdownItem[],
};

export const props = {};

export const tables = {
	[STORE_TABLE]: table,
	// [STORE_TABLE]: new Table({ ...table, rows: tableData.rows }),
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

type ExtraActions = { loadOnLinkaChange(): Promise<void> } & PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
	async filter(filter: Record<string, unknown>) {
		const { user } = useAuthorization();
		if (!this.last) return;
		this.last.serverData.vyrobniLinkaId = user.value?.vyrobniLinkaId ?? null;
		this.loadOnLinkaChange();
	},
	async loadOnLinkaChange() {
		if (this.last) {
			const { vyrobniLinkaId } = this.last.serverData;
			if (!vyrobniLinkaId) return;
			const respondSegment = await apiProviderSegment.getDropDownList({ vyrobniLinkaId });
			this.last.localData.vyrobniLinkaSegmentList = respondSegment?.data ?? [];
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
