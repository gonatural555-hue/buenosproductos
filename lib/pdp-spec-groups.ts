import type { SpecRow } from "@/lib/pdp-spec-rows";

export const SPEC_PREVIEW_LIMIT = 6;

export type SpecGroupId =
  | "power"
  | "dimensions"
  | "use"
  | "content"
  | "origin"
  | "general";

export type SpecGroup = {
  id: SpecGroupId;
  rows: SpecRow[];
};

const GROUP_ORDER: SpecGroupId[] = [
  "power",
  "dimensions",
  "use",
  "content",
  "origin",
  "general",
];

export const SPEC_GROUP_I18N_KEYS: Record<SpecGroupId, string> = {
  power: "goodIdeas.pdp.dtc.specsGroupPower",
  dimensions: "goodIdeas.pdp.dtc.specsGroupDimensions",
  use: "goodIdeas.pdp.dtc.specsGroupUse",
  content: "goodIdeas.pdp.dtc.specsGroupContent",
  origin: "goodIdeas.pdp.dtc.specsGroupOrigin",
  general: "goodIdeas.pdp.dtc.specsGroupGeneral",
};

function inferSpecGroupId(label: string): SpecGroupId {
  const l = label.toLowerCase();

  if (
    /potencia|power|volt|watt|\bw\b|enchufe|plug|frecuencia|frequency|amper|corriente/.test(
      l
    )
  ) {
    return "power";
  }

  if (
    /capacidad|capacity|tanque|tank|dimension|tamaño|size|peso|weight|litro|liter|ml|cm|mm/.test(
      l
    )
  ) {
    return "dimensions";
  }

  if (
    /incluye|kit|contenido|content|opción|option|package|accesorio|accessory/.test(
      l
    )
  ) {
    return "content";
  }

  if (
    /origen|origin|marca|brand|proveedor|supplier|certif|rohs|ce |clasificación|classification/.test(
      l
    )
  ) {
    return "origin";
  }

  if (
    /uso|use|función|function|tipo de producto|product type|ideal|apto|compatible|nivel|level|protección|protection|anti/.test(
      l
    )
  ) {
    return "use";
  }

  return "general";
}

export function groupSpecRows(rows: SpecRow[]): SpecGroup[] {
  const buckets = new Map<SpecGroupId, SpecRow[]>();

  for (const row of rows) {
    const id = inferSpecGroupId(row.label);
    const list = buckets.get(id) ?? [];
    list.push(row);
    buckets.set(id, list);
  }

  return GROUP_ORDER.filter((id) => (buckets.get(id)?.length ?? 0) > 0).map(
    (id) => ({
      id,
      rows: buckets.get(id) ?? [],
    })
  );
}

export function flattenSpecRows(groups: SpecGroup[]): SpecRow[] {
  return groups.flatMap((group) => group.rows);
}

export function takeSpecPreviewRows(
  rows: SpecRow[],
  limit = SPEC_PREVIEW_LIMIT
): SpecRow[] {
  return rows.slice(0, limit);
}

export function needsSpecExpandToggle(
  rows: SpecRow[],
  limit = SPEC_PREVIEW_LIMIT
): boolean {
  return rows.length > limit;
}
