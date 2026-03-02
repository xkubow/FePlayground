String.prototype.localeInclude = function (query: string | null | undefined): boolean {
  if (!query) return false;
  const queryLength = query.length;
  for (let j = this.length; j >= queryLength; j--) {
    const subStr = this.substring(j - queryLength, j);
    if (subStr.localeCompare(query, 'cz-CS', { sensitivity: 'base' }) === 0) return true;
  }
  return false;
};
