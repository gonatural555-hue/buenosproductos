export type SpecRow = {
  label: string;
  value: string;
};

/** Parse "Label: value" feature lines into table rows. */
export function parseFeatureSpecRows(lines: string[]): SpecRow[] {
  return lines.map((line) => {
    const colon = line.indexOf(":");
    if (colon > 0 && colon < line.length - 1) {
      return {
        label: line.slice(0, colon).trim(),
        value: line.slice(colon + 1).trim(),
      };
    }
    return { label: line.trim(), value: "—" };
  });
}
