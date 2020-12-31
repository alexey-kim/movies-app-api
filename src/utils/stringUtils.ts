export function toInt(value: unknown): number | undefined {
  if (typeof value === 'number') {
    value = value.toString();
  }
  return typeof value === 'string' && /^(-|\+)?([0-9]+)$/.test(value.trim())
    ? Number(value)
    : undefined;
}
