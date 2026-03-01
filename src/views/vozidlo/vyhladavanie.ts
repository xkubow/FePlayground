import { useAuthorization } from '@/template/account/authorization/provider';
import type { Table } from '@/template/components/table';
import { useLogger } from '@/template/logger';
import { PageMode, STORE_TABLE } from '@/template/page/constants';
import { openEdit } from '@/template/router/path';
import { useI18n } from 'vue-i18n';
import { apiProvider } from './api';
import { NAME } from './constants';
import type { Vozidlo } from './type';

export function useVyhladavanie() {
	const logger = useLogger();
	const { user } = useAuthorization();
	const { t } = useI18n();

	async function openVozidlo(id: string) {
		const isKnr = id.length === 13;
		let corectedKnr: string | null = null;

		switch (id.length) {
			case 8:
				corectedKnr = id.substring(0, 7);
				break;
			case 13:
				corectedKnr = id;
				break;
			case 14:
				corectedKnr = id.substring(0, 13);
				break;
			case 17:
				corectedKnr = id.substring(0, 13);
				break;
		}

		if (corectedKnr === null) {
			logger.log(`${t('vyrobniLinkaId')}: ${user.value?.vyrobniLinkaId}, ${t('zleKnr')}: ${id}`);
			return;
		}

		isKnr && openEdit(NAME, PageMode.EDIT, { id: corectedKnr });

		const response = await apiProvider.tableData<Table<Vozidlo>>({
			tableName: STORE_TABLE,
			filter: { knr: corectedKnr, vyrobniLinkaId: user.value?.vyrobniLinkaId ?? null },
		});
		if (response?.data?.rows) {
			const firstKnr = response?.data?.rows.find((i) => i.knr?.toString().endsWith(corectedKnr!));
			if (!firstKnr?.knr) {
				logger.log(`${t('vyrobniLinkaId')}: ${user.value?.vyrobniLinkaId}, ${t('zleKnr')}: ${corectedKnr}`);
				return;
			}
			openEdit(NAME, PageMode.EDIT, { id: firstKnr.knr });
		}
	}

	function decode(decodedString: string) {
		if (decodedString) {
			const id = decodedString.replace('/+s/g', '');

			openVozidlo(id);
		}
	}

	return { openVozidlo, decode };
}
