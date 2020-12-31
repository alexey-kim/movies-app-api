export function joinNotEmptyNorWhitespace(items: Array<string | undefined>, separator: string): string {
  return items.filter(x => x?.trim()).join(separator);
}
