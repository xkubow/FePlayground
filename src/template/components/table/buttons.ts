import { PageMode } from '@/template/page/providers/pageMode';
import { openEdit } from '@/template/router/path';
import { OperationFlags } from '@/template/utils/operationFlags';
import type { ClickActionFunctions, ExtraButton, OnClick, Row, RowButtons } from './@types/table';
import { deleteButton, editButton, processButton, selectButton, viewButton } from './tableOperations';

export class InitButtons {
	public buttonsWithActions: Record<RowButtons, ExtraButton>;

	constructor(public clickActions: Record<ClickActionFunctions, OnClick>, public extraButtons: ExtraButton[] = []) {
		this.buttonsWithActions = {
			edit: editButton(clickActions.editClickAction),
			view: viewButton(clickActions.viewClickAction),
			select: selectButton(clickActions.selectClickAction),
			process: processButton(clickActions.processClickAction),
			delete: deleteButton(clickActions.deleteClickAction),
		};
	}

	public rowButtons(operations: number | undefined): ExtraButton[] {
		if (operations === undefined) return [];
		const result = [];
		OperationFlags.SELECT & operations && result.push(this.buttonsWithActions.select);
		OperationFlags.VIEW & operations && !(OperationFlags.EDIT & operations) && result.push(this.buttonsWithActions.view);
		OperationFlags.EDIT & operations && result.push(this.buttonsWithActions.edit);
		OperationFlags.PROCESS & operations && result.push(this.buttonsWithActions.process);
		OperationFlags.DELETE & operations && result.push(this.buttonsWithActions.delete);

		return result;
	}

	public static rowButtonsCount(operations: number | undefined): number {
		if (operations === undefined) return 0;
		let count = 0;
		OperationFlags.SELECT & operations && count++;
		OperationFlags.VIEW & operations && !(OperationFlags.EDIT & operations) && count++;
		OperationFlags.EDIT & operations && count++;
		OperationFlags.PROCESS & operations && count++;
		OperationFlags.DELETE & operations && count++;

		return count;
	}
}

export function initButtons(NAME: string, extraButtons?: ExtraButton[], emit?: (event: typeof buttonEmits[number], ...args: any[]) => void): InitButtons {
	const actionFunction: Record<ClickActionFunctions, OnClick> = {
		editClickAction: (e: Event, row: Row, rowKey?: string) => {
			emit && emit('row-edit', row);
			openEdit(NAME, PageMode.EDIT, { id: row[rowKey ?? 0] as number });
		},
		viewClickAction: (e: Event, row: Row, rowKey?: string) => {
			openEdit(NAME, PageMode.VIEW, { id: row[rowKey ?? 0] as number });
		},
		selectClickAction: (e: Event, row: Row, rowKey?: string) => {
			emit && emit('row-add-to', row);
			console.log('clicked selectClickAction', e, row);
		},
		processClickAction: (e: Event, row: Row, rowKey?: string) => {
			console.log('clicked processClickAction', e, row);
			openEdit(NAME, PageMode.EDIT, { id: row[rowKey ?? 0] as number });
		},
		deleteClickAction: (e: Event, row: Row, rowKey?: string) => {
			emit && emit('row-delete', row);
			// openEdit(NAME, PageMode.VIEW, { id: row[rowKey ?? 0] as number });
		},
	};
	return new InitButtons(actionFunction, extraButtons);
}

export const buttonEmits = ['row-add-to', 'row-delete', 'row-edit'];
