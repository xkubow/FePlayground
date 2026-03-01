import _ from 'lodash';

export const fieldAccess = {
	setField(fildName: string, value: any): void {
		_.setWith(this, fildName, value);
	},
};
