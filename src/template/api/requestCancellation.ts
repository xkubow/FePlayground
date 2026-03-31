const abortControllers = new Map<string, AbortController>();

export function getCancelSignal(key: string, cancelPrevious = true): AbortSignal | undefined {
  if (!cancelPrevious) return undefined;

  let abortController = abortControllers.get(key);
  abortController?.abort();

  abortController = new AbortController();
  abortControllers.set(key, abortController);

  return abortController.signal;
}