import type { ElUpload } from 'element-plus';
import type { UploadFile } from 'element-plus/lib/components/upload/src/upload.type';

export type Priloha = {
	id: string;
	celyNazev: string;
	velikost?: number;
	vstupDatum: number;
	uid?: number;
};

export type UploadInstance = InstanceType<typeof ElUpload>;

export type FileItem = UploadFile | UploadedFiles;

export type UploadedFiles = {
	id: string;
	name: string;
	url: string;
	uid?: number;
};
