export function roundTo(num: number, precision: number): number {
  const to = precision * 10;
  return to !== 0 ? Math.round((num + Number.EPSILON) * to) / to : Math.floor(num);
}

export function formatBytes(a: number, b = 2, k = 1024) {
  const d = Math.floor(Math.log(a) / Math.log(k));
  return 0 == a ? '0 Bytes' : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d];
}
