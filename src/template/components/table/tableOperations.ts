import type { UnknownObject } from '@/template/@types/kTemplate';
import {
	Check as CheckIcon,
	Close as CloseIcon,
	Delete as DeleteIcon,
	Download as DownloadIcon,
	Edit as EditIcon,
	Finished as FinishedIcon,
	Message as MessageIcon,
	Plus as PlusIcon,
	Printer as PrinterIcon,
	Tickets as TicketsIcon,
	View as ViewIcon,
} from '@element-plus/icons-vue';
import type { ExtraButton, OnClick, OperationFunction } from './@types/table';

export const SAVE = 'SAVE';
export const PRINT = 'PRINT';
export const EMAIL = 'EMAIL';
export const PREVIEW = 'PREVIEW';
export const DELETE = 'DELETE';
export const CREATE = 'CREATE';
export const EDIT = 'EDIT';
export const VIEW = 'VIEW';
export const SELECT = 'SELECT';
export const PROCESS = 'PROCESS';
export const CHECK = 'CHECK';
export const CANCEL = 'CANCEL';

export const createButton: OperationFunction = (f: OnClick) => ({
	icon: PlusIcon,
	onClickAction: f,
	value: CREATE,
	type: 'primary',
	isVisible: () => true,
});

export const printButton: OperationFunction = (f: OnClick) => ({
	icon: PrinterIcon,
	onClickAction: f,
	value: PRINT,
	isVisible: () => true,
});

export function saveButton<T extends UnknownObject = UnknownObject>(f: OnClick<T>): ExtraButton<T> {
	return { icon: FinishedIcon, onClickAction: f, value: SAVE, isVisible: () => true };
}
export function downloadButton<T extends UnknownObject = UnknownObject>(f: OnClick<T>): ExtraButton<T> {
	return { icon: DownloadIcon, onClickAction: f, value: SAVE, isVisible: () => true };
}

export const emailButton: OperationFunction = (f: OnClick) => ({
	icon: MessageIcon,
	onClickAction: f,
	value: EMAIL,
	isVisible: () => true,
});

export const previewButton: OperationFunction = (f: OnClick) => ({
	icon: ViewIcon,
	onClickAction: f,
	value: PREVIEW,
	isVisible: () => true,
});

export function deleteButton<T extends UnknownObject = UnknownObject>(f: OnClick<T>): ExtraButton<T> {
	return { icon: DeleteIcon, onClickAction: f, value: DELETE, isVisible: () => true };
}

export function editButton<T extends UnknownObject = UnknownObject>(f: OnClick<T>): ExtraButton<T> {
	return { icon: EditIcon, onClickAction: f, value: EDIT, isVisible: () => true };
}
export function cancelButton<T extends UnknownObject = UnknownObject>(f: OnClick<T>): ExtraButton<T> {
	return { icon: CloseIcon, onClickAction: f, value: CANCEL, isVisible: () => true };
}

export const viewButton: OperationFunction = (f: OnClick) => ({
	icon: ViewIcon,
	onClickAction: f,
	value: VIEW,
	isVisible: () => true,
});

export const selectButton: OperationFunction = (f: OnClick) => ({
	icon: PlusIcon,
	onClickAction: f,
	value: SELECT,
	isVisible: () => true,
});

export const processButton: OperationFunction = (f: OnClick) => ({
	icon: TicketsIcon,
	onClickAction: f,
	value: PROCESS,
	isVisible: () => true,
});

export const checkButton: OperationFunction = (f: OnClick) => ({
	icon: CheckIcon,
	onClickAction: f,
	value: CHECK,
	isVisible: () => true,
});
