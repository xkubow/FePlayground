export type FilterListeners = { filterClick: () => Promise<void>; toggleFilter: () => void; filterResetClick: () => void };

export type FilterInit = {
  loadFilterData: () => void;
  filterListeners: FilterListeners;
  saveFilterToLocalStore: () => void;
  setFilterFromLocalStore: () => void;
} & FilterListeners;
