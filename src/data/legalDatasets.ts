// src/data/legalDatasets.ts
// Stub dataset + legal constants used across the app.
// NOTE: Demo values only. Replace with authoritative data before production.

export interface LegalDataset {
  id: string;
  name: string;
  description: string;
  source: string; // short source label
  url?: string;
  license?: string;
  tags?: string[];
  updatedAt?: string; // ISO date string
}

// -----------------------------
// States
// -----------------------------
const STATE_NAMES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
} as const;

export type StateCode = keyof typeof STATE_NAMES;

export const ALL_STATES: Array<{ code: StateCode; name: string }> = Object.entries(STATE_NAMES).map(
  ([code, name]) => ({ code: code as StateCode, name })
);

// -----------------------------
// Legal Topics (placeholder shapes)
// -----------------------------
export type LawEntry = {
  title: string;
  summary: string; // human-friendly note
  citation?: string;
  url?: string;
  updatedAt?: string; // ISO date
};

function buildDefaultRecord(title: string, summary: string): Record<StateCode, LawEntry> {
  return Object.keys(STATE_NAMES).reduce((acc, k) => {
    acc[k as StateCode] = { title, summary };
    return acc;
  }, {} as Record<StateCode, LawEntry>);
}

// Defaults across all states
const DEFAULT_PUBLIC_RECORDS = buildDefaultRecord(
  "Public records",
  "Demo only: public-records summary pending."
);
const DEFAULT_STOP_AND_ID = buildDefaultRecord(
  "Stop-and-ID",
  "Demo only: stop-and-identify summary pending."
);
const DEFAULT_CANNABIS = buildDefaultRecord(
  "Cannabis",
  "Demo only: cannabis possession/use summary pending."
);
const DEFAULT_NOTICE_RULES = buildDefaultRecord(
  "Notice rules",
  "Demo only: notice requirements summary pending."
);

// A few illustrative overrides so UI has non-empty content
function override<T extends Record<StateCode, LawEntry>>(base: T, entries: Partial<T>): T {
  return { ...base, ...entries };
}

export const PUBLIC_RECORDS: Record<StateCode, LawEntry> = override(DEFAULT_PUBLIC_RECORDS, {
  CA: {
    title: "Public records (CA)",
    summary: "Demo: CPRA/Gov. Code framework; confirm before use.",
    url: "https://example.com/ca-public-records",
  },
  NY: {
    title: "Public records (NY)",
    summary: "Demo: FOIL framework; confirm before use.",
  },
});

export const STOP_AND_ID: Record<StateCode, LawEntry> = override(DEFAULT_STOP_AND_ID, {
  TX: { title: "Stop-and-ID (TX)", summary: "Demo: limited requirements; verify." },
  FL: { title: "Stop-and-ID (FL)", summary: "Demo: context-specific; verify." },
});

export const CANNABIS: Record<StateCode, LawEntry> = override(DEFAULT_CANNABIS, {
  CO: { title: "Cannabis (CO)", summary: "Demo: legalized with limits; verify." },
  WA: { title: "Cannabis (WA)", summary: "Demo: legalized with limits; verify." },
});

export const NOTICE_RULES: Record<StateCode, LawEntry> = override(DEFAULT_NOTICE_RULES, {
  MA: { title: "Notice (MA)", summary: "Demo: certain notices required; verify." },
});

// -----------------------------
// Datasets registry (demo content)
// -----------------------------
export const legalDatasets: LegalDataset[] = [
  {
    id: "us-federal-cases-sample",
    name: "US Federal Cases (Sample)",
    description: "Small illustrative set of federal case summaries for demos and local dev.",
    source: "demo",
    tags: ["cases", "usa", "sample"],
    updatedAt: "2025-01-01",
  },
  {
    id: "state-statutes-sample",
    name: "State Statutes (Sample)",
    description: "Example state statute excerpts with titles and sections.",
    source: "demo",
    tags: ["statutes", "usa", "sample"],
    updatedAt: "2025-01-01",
  },
  {
    id: "contracts-clauses-sample",
    name: "Contracts Clauses (Sample)",
    description: "Common contract clause snippets (NDA, indemnity, termination).",
    source: "demo",
    tags: ["contracts", "clauses", "sample"],
    updatedAt: "2025-01-01",
  },
];

export const DATASETS_BY_ID: Record<string, LegalDataset> = Object.fromEntries(
  legalDatasets.map((d) => [d.id, d])
);

export function getDatasetById(id: string) : LegalDataset | undefined {
  return DATASETS_BY_ID[id];
}

export default legalDatasets;
