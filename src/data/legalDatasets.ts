// src/data/legalDatasets.ts
import { z } from "zod";

export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY" | "DC";

export const ALL_STATES: StateCode[] = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

// ---------- Zod Schemas (strict shapes & runtime validation) ----------

export const PublicRecordsEntrySchema = z.object({
  name: z.string(),
  statute: z.string(),
  displayTime: z.string().default("Promptly / reasonable time"), // human-friendly
  responseWindow: z
    .object({ type: z.enum(["business_days","calendar_days","none"]).default("none"), value: z.number().nullable().default(null) })
    .default({ type: "none", value: null }),
  updates: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});
export type PublicRecordsEntry = z.infer<typeof PublicRecordsEntrySchema>;

export const StopAndIdEntrySchema = z.object({
  stopAndID: z.boolean(),
  law: z.string(),
  idRequired: z.string().default("Context-specific: driving/arrest/licensed activities"),
  recording: z.string().default("One-party consent or state-specific rule"),
  sourceUrl: z.string().url().optional(),
});
export type StopAndIdEntry = z.infer<typeof StopAndIdEntrySchema>;

export const CannabisEntrySchema = z.object({
  status: z.string(), // e.g., "Recreational & Medical"
  enacted: z.string(),
  possession: z.string().default("See statute"),
  details: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});
export type CannabisEntry = z.infer<typeof CannabisEntrySchema>;

export const NoticeGovTortSchema = z.object({
  timeLimit: z.string(),
  statute: z.string(),
  requirements: z.string(),
});
export type NoticeGovTort = z.infer<typeof NoticeGovTortSchema>;

export const NoticeMedMalSchema = z.object({
  timeLimit: z.string(),
  statute: z.string(),
  requirements: z.string(),
});
export type NoticeMedMal = z.infer<typeof NoticeMedMalSchema>;

export const NoticeCeaseDesistSchema = z.object({
  requirements: z.string(),
  mandatoryNotice: z.string().optional(),
  penalties: z.string().optional(),
});
export type NoticeCeaseDesist = z.infer<typeof NoticeCeaseDesistSchema>;

export const NoticeEntrySchema = z.object({
  govTortClaim: NoticeGovTortSchema.optional(),
  medMalpractice: NoticeMedMalSchema.optional(),
  ceaseDesist: NoticeCeaseDesistSchema.optional(),
});
export type NoticeEntry = z.infer<typeof NoticeEntrySchema>;

export type PublicRecordsMap = Partial<Record<StateCode, PublicRecordsEntry>>;
export type StopAndIdMap = Partial<Record<StateCode, StopAndIdEntry>>;
export type CannabisMap = Partial<Record<StateCode, CannabisEntry>>;
export type NoticeMap = Partial<Record<StateCode, NoticeEntry>>;

// ---------- Baseline datasets (safe defaults; expand/verify as needed) ----------

export const PUBLIC_RECORDS: PublicRecordsMap = {
  AL: { name: "Alabama", statute: "Alabama Open Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  AK: { name: "Alaska", statute: "Alaska Public Records Act" , displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  AZ: { name: "Arizona", statute: "Arizona Public Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  AR: { name: "Arkansas", statute: "Arkansas Freedom of Information Act", displayTime: "3 business days", responseWindow: { type: "business_days", value: 3 } },
  CA: { name: "California", statute: "California Public Records Act (Gov. Code §§ 7920.000 et seq.)", displayTime: "10 calendar days", responseWindow: { type: "calendar_days", value: 10 }, updates: "Recodified under AB 473 (2023)" },
  CO: { name: "Colorado", statute: "Colorado Open Records Act (CORA)", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  CT: { name: "Connecticut", statute: "Freedom of Information Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  DE: { name: "Delaware", statute: "Delaware Freedom of Information Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  FL: { name: "Florida", statute: "Florida Public Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  GA: { name: "Georgia", statute: "Georgia Open Records Act", displayTime: "3 business days (acknowledge/produce or explain)", responseWindow: { type: "business_days", value: 3 } },
  HI: { name: "Hawaii", statute: "Uniform Information Practices Act (UIPA)", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  ID: { name: "Idaho", statute: "Idaho Public Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  IL: { name: "Illinois", statute: "Illinois Freedom of Information Act", displayTime: "5 business days (typical)", responseWindow: { type: "business_days", value: 5 } },
  IN: { name: "Indiana", statute: "Access to Public Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  IA: { name: "Iowa", statute: "Iowa Open Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  KS: { name: "Kansas", statute: "Kansas Open Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  KY: { name: "Kentucky", statute: "Kentucky Open Records Act", displayTime: "5 business days (acknowledge)", responseWindow: { type: "business_days", value: 5 } },
  LA: { name: "Louisiana", statute: "Louisiana Public Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  ME: { name: "Maine", statute: "Freedom of Access Act (FOAA)", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  MD: { name: "Maryland", statute: "Public Information Act (PIA)", displayTime: "10 business days (acknowledge)", responseWindow: { type: "business_days", value: 10 } },
  MA: { name: "Massachusetts", statute: "Public Records Law", displayTime: "10 business days (acknowledge)", responseWindow: { type: "business_days", value: 10 } },
  MI: { name: "Michigan", statute: "Michigan Freedom of Information Act", displayTime: "5 business days (typical)", responseWindow: { type: "business_days", value: 5 } },
  MN: { name: "Minnesota", statute: "Government Data Practices Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  MS: { name: "Mississippi", statute: "Public Records Act", displayTime: "7 working days (typical)", responseWindow: { type: "business_days", value: 7 } },
  MO: { name: "Missouri", statute: "Sunshine Law", displayTime: "3 business days (acknowledge)", responseWindow: { type: "business_days", value: 3 } },
  MT: { name: "Montana", statute: "Montana Public Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  NE: { name: "Nebraska", statute: "Nebraska Public Records Statutes", displayTime: "4 business days (acknowledge)", responseWindow: { type: "business_days", value: 4 } },
  NV: { name: "Nevada", statute: "Nevada Public Records Act", displayTime: "5 business days (acknowledge)", responseWindow: { type: "business_days", value: 5 } },
  NH: { name: "New Hampshire", statute: "Right-to-Know Law", displayTime: "5 business days (acknowledge)", responseWindow: { type: "business_days", value: 5 } },
  NJ: { name: "New Jersey", statute: "Open Public Records Act (OPRA)", displayTime: "7 business days (typical)", responseWindow: { type: "business_days", value: 7 } },
  NM: { name: "New Mexico", statute: "Inspection of Public Records Act (IPRA)", displayTime: "3 business days (acknowledge)", responseWindow: { type: "business_days", value: 3 } },
  NY: { name: "New York", statute: "Freedom of Information Law (FOIL)", displayTime: "5 business days (acknowledge)", responseWindow: { type: "business_days", value: 5 } },
  NC: { name: "North Carolina", statute: "Public Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  ND: { name: "North Dakota", statute: "Open Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  OH: { name: "Ohio", statute: "Ohio Public Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  OK: { name: "Oklahoma", statute: "Oklahoma Open Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  OR: { name: "Oregon", statute: "Oregon Public Records Law", displayTime: "5 business days (acknowledge)", responseWindow: { type: "business_days", value: 5 } },
  PA: { name: "Pennsylvania", statute: "Right-to-Know Law", displayTime: "5 business days (typical)", responseWindow: { type: "business_days", value: 5 } },
  RI: { name: "Rhode Island", statute: "Access to Public Records Act (APRA)", displayTime: "10 business days (typical)", responseWindow: { type: "business_days", value: 10 } },
  SC: { name: "South Carolina", statute: "Freedom of Information Act", displayTime: "10 business days (typical)", responseWindow: { type: "business_days", value: 10 } },
  SD: { name: "South Dakota", statute: "Open Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  TN: { name: "Tennessee", statute: "Public Records Act", displayTime: "7 business days (acknowledge)", responseWindow: { type: "business_days", value: 7 } },
  TX: { name: "Texas", statute: "Public Information Act", displayTime: "10 business days (acknowledge)", responseWindow: { type: "business_days", value: 10 } },
  UT: { name: "Utah", statute: "Government Records Access and Management Act (GRAMA)", displayTime: "10 business days (typical)", responseWindow: { type: "business_days", value: 10 } },
  VT: { name: "Vermont", statute: "Public Records Act", displayTime: "3 business days (acknowledge)", responseWindow: { type: "business_days", value: 3 } },
  VA: { name: "Virginia", statute: "Virginia Freedom of Information Act", displayTime: "5 working days (typical)", responseWindow: { type: "business_days", value: 5 } },
  WA: { name: "Washington", statute: "Public Records Act", displayTime: "5 business days (acknowledge)", responseWindow: { type: "business_days", value: 5 } },
  WV: { name: "West Virginia", statute: "Freedom of Information Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  WI: { name: "Wisconsin", statute: "Public Records Law", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  WY: { name: "Wyoming", statute: "Public Records Act", displayTime: "Promptly / reasonable time", responseWindow: { type: "none", value: null } },
  DC: { name: "District of Columbia", statute: "D.C. FOIA (D.C. Code § 2-531 et seq.)", displayTime: "15 business days", responseWindow: { type: "business_days", value: 15 } },
};

export const STOP_AND_ID: StopAndIdMap = {
  AL: { stopAndID: true, law: "Ala. Code § 15-5-30", idRequired: "Name/address/explanation if felony/public offense suspicion", recording: "One-party consent" },
  CA: { stopAndID: false, law: "No general stop-and-ID statute; ID required when driving/under arrest/licensed activities", idRequired: "Only when driving/under arrest/licensed activities", recording: "Two-party consent" },
  NY: { stopAndID: true, law: "N.Y. Crim. Proc. Law § 140.50 (stop/question/frisk)", idRequired: "Name/address/explanation of conduct when lawfully stopped", recording: "One-party consent" },
  DC: { stopAndID: true, law: "Terry-stop authority (case law / rules)", idRequired: "Identification upon lawful stop (context-dependent)", recording: "One-party consent" },
};

export const CANNABIS: CannabisMap = {
  CA: { status: "Recreational & Medical", enacted: "2016", possession: "Up to 1 oz flower; 6 plants; 8g concentrates", details: "Prop 64" },
  NY: { status: "Recreational & Medical", enacted: "2021", possession: "Up to 3 oz flower; 6 plants", details: "MRTA" },
  AL: { status: "Medical Only", enacted: "2021", possession: "Qualified patients only", details: "Compassion Act" },
};

export const NOTICE_RULES: Partial<Record<StateCode, NoticeEntry>> = {
  AL: {
    govTortClaim: { timeLimit: "1 year", statute: "Ala. Code § 11-47-190", requirements: "Written notice required to municipality" },
    medMalpractice: { timeLimit: "90 days", statute: "Ala. Code § 6-5-484", requirements: "Pre-suit notice with expert affidavit" },
    ceaseDesist: { requirements: "No specific statutory requirements; rely on common law + specific cause statutes" },
  },
  CA: {
    govTortClaim: { timeLimit: "6 months", statute: "Gov. Code § 911.2", requirements: "Claim within 6 months of accrual; specific form requirements" },
    medMalpractice: { timeLimit: "90 days", statute: "CCP § 364", requirements: "90-day notice; expert declaration typical in practice" },
    ceaseDesist: { requirements: "Use applicable Civil Code section(s) for the violation (defamation, privacy, IP, etc.)" },
  },
};

// ---------- CSV/JSON loader utilities (for bulk updates via admin UI) ----------

export type PublicRecordsCsvRow = {
  code: StateCode; name: string; statute: string; displayTime?: string; responseType?: string; responseValue?: string; sourceUrl?: string; updates?: string;
};

export function upsertPublicRecords(rows: PublicRecordsCsvRow[]): PublicRecordsMap {
  const next: PublicRecordsMap = { ...PUBLIC_RECORDS };
  rows.forEach(r => {
    const type = (r.responseType as any) || "none";
    const value = r.responseValue ? Number(r.responseValue) : null;
    next[r.code] = PublicRecordsEntrySchema.parse({
      name: r.name,
      statute: r.statute,
      displayTime: r.displayTime || "Promptly / reasonable time",
      responseWindow: { type, value: value ?? null },
      updates: r.updates,
      sourceUrl: r.sourceUrl,
    });
  });
  return next;
}

export function coveragePercent(map: Partial<Record<StateCode, unknown>>): number {
  const have = Object.keys(map).length;
  return Math.round((have / ALL_STATES.length) * 100);
}