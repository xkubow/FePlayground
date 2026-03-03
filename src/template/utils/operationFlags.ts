import { PageMode } from '@/template/page/providers/pageMode';

 
export enum UserOperationFlags {
  NONE = 0,
  CREATE = 1,
  READ = 2,
  UPDATE = 4,
  DELETE = 8,
}

export enum OperationFlags {
  DEFAULT = 0,
  CREATE = 1,
  VIEW = 2,
  EDIT = 4,
  DELETE = 8,
  PROCESS = 16,
  SELECT = 32,
  EXPORT = 64,
  PRINT = -128,
  PREVIEW = -256,
}

/**
 * Returns operations allowed in page mode `mode`.
 *
 * @param mode - page mode.
 * @param operations - operations mask, by default `~0` (all ones in binary).
 */
export function getModeOperations(mode: PageMode, operations: number = ~0): number {
  switch (mode) {
    case PageMode.LIST:
      return operations & (OperationFlags.EDIT | OperationFlags.VIEW | OperationFlags.PROCESS);
    case PageMode.SELECT_LIST:
      return operations | OperationFlags.SELECT;
    case PageMode.CREATE:
      return 0;
    case PageMode.EDIT:
      return (
        operations &
        (OperationFlags.EDIT | OperationFlags.VIEW | OperationFlags.PROCESS | OperationFlags.CREATE | OperationFlags.EXPORT | OperationFlags.DELETE)
      );
    case PageMode.VIEW:
      return operations & (OperationFlags.VIEW | OperationFlags.EXPORT);
    default:
      return 0;
  }
}
