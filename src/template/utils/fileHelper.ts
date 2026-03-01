import { Parser, type FieldInfo } from '@json2csv/plainjs';
import { useI18n } from 'vue-i18n';
import type { HTMLInputEvent } from '../components/@types/input.d';

export function forceFileDownload(url: string, name = 'file.csv'): void {
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', name);
	document.body.appendChild(link);
	link.click();
}
export function parseObj2Csv(dataForExport: Readonly<unknown> | readonly unknown[], fields: FieldInfo<object, unknown>[]): string {
	const parser = new Parser({ fields });
	const csv = parser.parse(dataForExport);
	return csv;
}

export function renameKeys(obj: Record<string, unknown>): Record<string, unknown> {
	const { t } = useI18n();
	Object.keys(obj).forEach((key, index) => {
		if (index === 0) {
			delete obj[key];
		}
		const newKey = t(key);
		// eslint-disable-next-line no-prototype-builtins
		if (obj.hasOwnProperty(key)) {
			obj[newKey] = obj[key];
			delete obj[key];
		}
	});
	return obj;
}
/**
 * Will read the content of the file and return it as Blob
 * @param  {File} file
 * @returns Promise<Blob>
 */
export function readFileContent(file: File): Promise<Blob> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
			if (readerEvent.target) {
				const content = readerEvent.target.result as ArrayBuffer; // this is the content!
				resolve(new Blob([content]));
			}
		};
		reader.readAsArrayBuffer(file);
	});
}

/**
 * It generate HtmlInputElement to get file from system
 * @param  {String} accept type of file to accept
 * @param  {String} capture type of environment to be used
 * @returns Promise<{ name: string; content: Blob; size: number }>
 */
export function getFileContent(accept = '*', capture?: string): Promise<{ name: string; content: Blob; size: number }> {
	return new Promise((resolve) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = accept;
		capture && (input.capture = capture);
		input.onchange = async (ev: Event) => {
			const files = (ev as HTMLInputEvent)?.target?.files;
			const file = files?.item(0) ?? null;
			if (file) {
				const content = await readFileContent(file);
				resolve({ name: file.name, content, size: file.size });
			}
		};

		input.click();
	});
}
