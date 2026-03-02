export function countOnes(i: number): number {
  const str = i.toString(2);
  let n;
  let count = 0;
  for (n = 0; n < str.length; ++n) {
    if (str[n] === '1') {
      ++count;
    }
  }
  return count;
}
