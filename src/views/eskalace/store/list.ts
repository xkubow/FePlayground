import { Interval } from '@/template/components/@types';
import type { Table } from '@/template/components/table';
import { useLogger } from '@/template/logger';
import type { DropdownItem } from '@/template/page/@types/mode';
import { Page } from '@/template/page/@types/page';
import type { ActionOptions, PageActionsGlobal, PageGetters } from '@/template/page/@types/store';
import { listName, STORE_TABLE } from '@/template/page/constants';
import { pageStoreFactory } from '@/template/page/store';
import { apiProvider as uzivatelSkupinaApiProvider } from '@/views/uzivatel/skupina/api';
import type { Skupina } from '@/views/uzivatel/skupina/type';
import type { Uzivatel } from '@/views/uzivatel/type';
import _ from 'lodash';
import { apiProvider } from '../api';
import { EnumEskalaceStatus, eskalaceStatusEnumList, NAME } from '../constants';
import { table } from '../tables/table';

export const server = {
	knr: null as number | null,
	vin: null as string | null,
	modelovaTridaKod: [] as string[],
	eskalaceStatusEnum: [] as EnumEskalaceStatus[],
	vyrobniLinkaId: null as number | null,
	prirazenaSkupinaUzivateluId: [] as number[],
	prirazenyUzivatelId: [] as string[],
	hledejPresSkupinu: true as boolean | null,
	vstupDatum: new Interval(),
	editDatum: new Interval(),
	RidiciJednotkaId: [] as number[],
};

export const local = {
	eskalaceStatusEnumList,
	prirazenaSkupinaUzivateluIdList: [] as DropdownItem[],
	prirazenyUzivatelIdList: [] as Uzivatel[],
};

export const props = {};

export const tables = {
	[STORE_TABLE]: table,
};

type Server = typeof server;
type Local = typeof local;
type Props = typeof props;
type Tables = typeof tables;

type ExtraActions = PageActionsGlobal<Server, Local, Props, Tables>;
type ExtraGetters = PageGetters<Server, Local, Props, Tables>;

const extraActions = {
	async filter(filter: Record<string, unknown>) {
		const { log } = useLogger();
		try {
			this.startLoading();
			const entity = this.last;
			if (!entity) return;
			const uzivatelSkupinaResponse = await uzivatelSkupinaApiProvider.tableData<Table<Skupina>>({ tableName: STORE_TABLE });
			entity.localData.prirazenaSkupinaUzivateluIdList = uzivatelSkupinaResponse?.data.rows.map((i) => ({ value: i.id, text: i.text })) ?? [];
			// const response = await apiProvider?.filter(filter);
			// response?.data && _.merge(entity.serverData, response.data);
			return;
		} catch (error) {
			log('filter');
		} finally {
			this.endLoading();
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
