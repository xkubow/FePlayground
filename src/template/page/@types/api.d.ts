export interface TableOptions {
  sorting?: string;
  paging?: {
    skip?: number;
    count: number;
  };
}

export type Options = { showError: boolean; cancelPrevious: boolean };
