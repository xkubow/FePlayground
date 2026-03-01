export type BreadCrumb = {
	url?: string | (() => string);
	type: RouteType;
	label: string;
};

export enum RouteType {
	url, // Route represented by URL. Opened in new tab.
	name, // Represented by unmodified name in Vuex Router routes.
	listName, // Represented by name appended with 'List' in Vuex Router routes.
	method, // Route represented by custom method which returns string.
}
