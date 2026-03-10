type SizeRangeInput = {
  startSize: number;
  endSize: number;
  includeHalfSizes: boolean;
};

function formatSize(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function generateSizeRange({
  startSize,
  endSize,
  includeHalfSizes,
}: SizeRangeInput): string[] {
  if (!Number.isFinite(startSize) || !Number.isFinite(endSize)) return [];
  if (startSize > endSize) return [];

  if (!includeHalfSizes && (!Number.isInteger(startSize) || !Number.isInteger(endSize))) {
    return [];
  }

  const step = includeHalfSizes ? 0.5 : 1;
  const sizes: string[] = [];
  const seen = new Set<string>();

  for (let value = startSize; value <= endSize + 0.000001; value += step) {
    const rounded = Math.round(value * 10) / 10;
    const formatted = formatSize(rounded);

    if (!seen.has(formatted)) {
      seen.add(formatted);
      sizes.push(formatted);
    }
  }

  return sizes;
}
