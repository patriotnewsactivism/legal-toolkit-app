/*
  File: src/components/LegalToolkit.jsx
  Purpose: Production-ready Civil Rights Legal Toolkit Pro (fixed + enhanced)

  BUILD-FIX + ENHANCEMENTS — PSEUDOCODE PLAN
  -------------------------------------------------
  1) Fix build/runtime issues
     - Replace undefined generateIDRightsCard() with reusable <IDCard/> component.
     - Harden clipboard/print/PNG helpers with guards and fallbacks.
     - Add missing setter for `damages` and related inputs.
     - Sort states and support filtering; ensure dropdown renders reliably.
  2) UX & polish
     - Quick Mode toggle preserved; add hotkeys (Ctrl/Cmd+Enter = Generate).
     - Add Reset, Print, and Download JSON buttons.
     - Persist all inputs to localStorage (auto-save/restore).
     - Professional spacing, consistent paddings, bolder headers, subtle shadows.
  3) Capabilities
     - FOIA / PRR / Cease & Desist / Notice of Claim / Pre-Suit / Subpoena / Discovery.
     - ID Rights Card: on-screen preview + PNG export + wallet print.
     - Deadline calculator from statutory labels.
  4) Safety
     - Graceful fallbacks for missing per-state data.
     - Avoid SSR pitfalls with window/document checks.

  Notes: Pure React (no external UI deps). Keep CRA/Netlify friendly.
*/

import React, { useEffect, useMemo, useState } from "react";

// --- THEME ---------------------------------------------------------------
const theme = {
  brand1: "#1e3c72",
  brand2: "#2a5298",
  ok: "#27ae60",
  warn: "#f39c12",
  danger: "#e74c3c",
  info: "#3498db",
  ink: "#2c3e50",
  paper: "#ffffff",
  subtle: "#f8f9fa",
};

const styles = {
  appShell: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${theme.brand1} 0%, ${theme.brand2} 100%)`,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: 20,
  },
  card: {
    maxWidth: 1200,
    margin: "0 auto",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  h1wrap: {
    textAlign: "center",
    marginBottom: 24,
    borderBottom: `3px solid ${theme.brand1}`,
    paddingBottom: 16,
  },
  h1: {
    color: theme.brand1,
    fontSize: "2.2rem",
    fontWeight: 800,
    margin: "0 0 8px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.08)",
  },
  sub: { color: "#5f6b7a", margin: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  label: { display: "block", marginBottom: 8, fontWeight: 700, color: theme.ink },
  text: (ok = false) => ({
    width: "100%",
    padding: 12,
    border: `2px solid ${ok ? theme.ok : theme.info}`,
    borderRadius: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: ok ? "#f8fff8" : "#fff",
  }),
  area: {
    width: "100%",
    height: 180,
    padding: 12,
    border: `2px solid ${theme.info}`,
    borderRadius: 12,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fff",
    resize: "vertical",
    lineHeight: 1.5,
  },
  cta: {
    width: "100%",
    padding: 16,
    backgroundColor: theme.info,
    color: "#fff",
    border: 0,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
  },
  subtleBtn: {
    padding: 10,
    borderRadius: 10,
    border: "2px solid #e1e7ef",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  panel: (accent) => ({
    backgroundColor: "#fff",
    border: `2px solid ${accent}`,
    borderRadius: 14,
    padding: 16,
    boxShadow: `0 4px 15px ${accent}22`,
  }),
  note: (accentBg, accentBorder, color) => ({
    marginTop: 12,
    padding: 12,
    background: accentBg,
    border: `1px solid ${accentBorder}`,
    borderRadius: 10,
    fontSize: 14,
    color,
  }),
};

// --- DATA: PUBLIC RECORDS (abbrev), CANNA, ID RIGHTS ---------------------
// Keep maps concise with graceful fallbacks.

const statePublicRecordsData = {
  AL: {
    name: "Alabama",
    statute: "Ala. Code § 36-12-40 (Open Records)",
    timeLimit: "7-10 business days",
  },
  AK: {
    name: "Alaska",
    statute: "AS § 40.25.110-220 (Public Records)",
    timeLimit: "10 business days",
  },
  AZ: {
    name: "Arizona",
    statute: "A.R.S. § 39-121 (Public Records)",
    timeLimit: "Promptly",
  },
  AR: {
    name: "Arkansas",
    statute: "A.C.A. § 25-19-101 (FOIA)",
    timeLimit: "3 business days",
  },
  CA: {
    name: "California",
    statute: "Gov. Code §§ 7920.000+ (CPRA)",
    timeLimit: "10 calendar days",
    updates: "Recodified under AB 473 (2023)",
  },
  CO: { name: "Colorado", statute: "C.R.S. § 24-72-201 (CORA)", timeLimit: "3 business days" },
  CT: { name: "Connecticut", statute: "C.G.S. § 1-200 (FOI)", timeLimit: "4 business days" },
  DE: { name: "Delaware", statute: "29 Del. C. § 10001 (FOIA)", timeLimit: "15 business days" },
  FL: { name: "Florida", statute: "F.S. Ch. 119 (Sunshine)", timeLimit: "Reasonable time" },
  GA: { name: "Georgia", statute: "O.C.G.A. § 50-18-70 (Open Records)", timeLimit: "3 business days" },
  HI: { name: "Hawaii", statute: "HRS § 92F (UIPA)", timeLimit: "10 business days" },
  ID: { name: "Idaho", statute: "Idaho Code § 74-101 (Public Records)", timeLimit: "3 business days" },
  IL: { name: "Illinois", statute: "5 ILCS 140/ (FOIA)", timeLimit: "5 business days" },
  IN: { name: "Indiana", statute: "IC § 5-14-3 (APRA)", timeLimit: "24h if readily available" },
  IA: { name: "Iowa", statute: "Iowa Code § 22", timeLimit: "As soon as reasonably possible" },
  KS: { name: "Kansas", statute: "K.S.A. § 45-215 (KORA)", timeLimit: "3 business days" },
  KY: { name: "Kentucky", statute: "KRS § 61.870 (Open Records)", timeLimit: "3 business days" },
  LA: { name: "Louisiana", statute: "R.S. 44:1 (Public Records)", timeLimit: "3 business days" },
  ME: { name: "Maine", statute: "1 M.R.S. § 401 (FOAA)", timeLimit: "Reasonable time" },
  MD: { name: "Maryland", statute: "GP § 4-101 (PIA)", timeLimit: "30 days" },
  MA: { name: "Massachusetts", statute: "M.G.L. c.66 (PRL)", timeLimit: "10 business days" },
  MI: { name: "Michigan", statute: "MCL § 15.231 (FOIA)", timeLimit: "5 business days" },
  MN: { name: "Minnesota", statute: "M.S. § 13.01 (Data Practices)", timeLimit: "Prompt" },
  MS: { name: "Mississippi", statute: "Miss. Code § 25-61-1 (Public Records)", timeLimit: "7 business days" },
  MO: { name: "Missouri", statute: "RSMo § 610.010 (Sunshine)", timeLimit: "3 business days" },
  MT: { name: "Montana", statute: "MCA § 2-6-1001 (Right to Know)", timeLimit: "Reasonable time" },
  NE: {
    name: "Nebraska",
    statute: "Neb. Rev. Stat. § 84-712 (Public Records)",
    timeLimit: "4 business days",
    updates: "LB 43 (2024) — first 8 hours free for residents",
  },
  NV: { name: "Nevada", statute: "NRS § 239 (NPRA)", timeLimit: "5 business days" },
  NH: { name: "New Hampshire", statute: "RSA § 91-A (Right-to-Know)", timeLimit: "5 business days" },
  NJ: { name: "New Jersey", statute: "N.J.S.A. § 47:1A-1 (OPRA)", timeLimit: "7 business days" },
  NM: { name: "New Mexico", statute: "NMSA § 14-2-1 (IPRA)", timeLimit: "3 business days" },
  NY: { name: "New York", statute: "POL § 84 (FOIL)", timeLimit: "5 business days" },
  NC: { name: "North Carolina", statute: "N.C.G.S. § 132-1", timeLimit: "Prompt" },
  ND: { name: "North Dakota", statute: "NDCC § 44-04-18", timeLimit: "3 business days" },
  OH: { name: "Ohio", statute: "R.C. § 149.43 (Public Records)", timeLimit: "Promptly" },
  OK: { name: "Oklahoma", statute: "51 O.S. § 24A.1", timeLimit: "5 business days" },
  OR: { name: "Oregon", statute: "ORS § 192.410", timeLimit: "Reasonable time" },
  PA: { name: "Pennsylvania", statute: "65 P.S. § 67.101 (RTKL)", timeLimit: "5 business days" },
  RI: { name: "Rhode Island", statute: "R.I.G.L. § 38-2-1 (APRA)", timeLimit: "10 business days" },
  SC: { name: "South Carolina", statute: "S.C. Code § 30-4-10 (FOIA)", timeLimit: "15 business days" },
  SD: { name: "South Dakota", statute: "SDCL § 1-27-1", timeLimit: "Reasonable" },
  TN: { name: "Tennessee", statute: "T.C.A. § 10-7-503", timeLimit: "7 business days" },
  TX: { name: "Texas", statute: "Gov. Code § 552 (PIA)", timeLimit: "10 business days" },
  UT: { name: "Utah", statute: "Utah Code § 63G-2-101 (GRAMA)", timeLimit: "5-10 business days" },
  VT: { name: "Vermont", statute: "1 V.S.A. § 315 (PRA)", timeLimit: "3 business days" },
  VA: { name: "Virginia", statute: "Va. Code § 2.2-3700 (FOIA)", timeLimit: "5 business days" },
  WA: { name: "Washington", statute: "RCW § 42.56 (PRA)", timeLimit: "5 business days" },
  WV: { name: "West Virginia", statute: "W. Va. Code § 29B-1-1", timeLimit: "5 business days" },
  WI: { name: "Wisconsin", statute: "Wis. Stat. § 19.31", timeLimit: "As practicable" },
  WY: { name: "Wyoming", statute: "Wyo. Stat. § 16-4-201", timeLimit: "3 business days" },
  DC: { name: "District of Columbia", statute: "D.C. Code § 2-531 (FOIA)", timeLimit: "15 business days" },
};

// Cannabis law snapshot (focus on possession/cultivation; concise; update as needed)
const cannabisLaws = {
  AK: { status: "Recreational & Medical", possession: "1 oz; 6 plants (3 mature)", cultivation: "Up to 6 plants", enacted: "2014" },
  AZ: { status: "Recreational & Medical", possession: "1 oz; 5g conc.", cultivation: "6 plants/adult", enacted: "2020" },
  CA: { status: "Recreational & Medical", possession: "1 oz; 8g conc.", cultivation: "6 plants/home", enacted: "2016" },
  CO: { status: "Recreational & Medical", possession: "1 oz", cultivation: "6 plants (3 mature)", enacted: "2012" },
  CT: { status: "Recreational & Medical", possession: "1.5 oz", cultivation: "6 plants/home", enacted: "2021" },
  DE: { status: "Recreational & Medical", possession: "1 oz", cultivation: "No home grow (rec)", enacted: "2023" },
  IL: { status: "Recreational & Medical", possession: "1 oz (residents)", cultivation: "Medical only", enacted: "2019" },
  ME: { status: "Recreational & Medical", possession: "2.5 oz", cultivation: "6 mature plants", enacted: "2016" },
  MD: { status: "Recreational & Medical", possession: "1.5 oz", cultivation: "2 plants/home", enacted: "2022" },
  MA: { status: "Recreational & Medical", possession: "1 oz; 10 oz home", cultivation: "6 plants/adult (12/house)", enacted: "2016" },
  MI: { status: "Recreational & Medical", possession: "2.5 oz; 10 oz home", cultivation: "12 plants/home", enacted: "2018" },
  MN: { status: "Recreational & Medical", possession: "2 oz public; 2 lb home", cultivation: "8 plants (4 mature)", enacted: "2023" },
  MO: { status: "Recreational & Medical", possession: "3 oz", cultivation: "6 plants (with card)", enacted: "2022" },
  MT: { status: "Recreational & Medical", possession: "1 oz", cultivation: "4 mature plants", enacted: "2020" },
  NV: { status: "Recreational & Medical", possession: "1 oz; 1/8 oz conc.", cultivation: "6 plants if 25+ miles from dispensary", enacted: "2016" },
  NJ: { status: "Recreational & Medical", possession: "1 oz", cultivation: "No home grow", enacted: "2020" },
  NM: { status: "Recreational & Medical", possession: "2 oz; 16g conc.", cultivation: "6 mature (12/house)", enacted: "2021" },
  NY: { status: "Recreational & Medical", possession: "3 oz; 24g conc.", cultivation: "6 plants/home", enacted: "2021" },
  OH: { status: "Recreational & Medical", possession: "2.5 oz; 15g conc.", cultivation: "6 plants/adult", enacted: "2023" },
  OR: { status: "Recreational & Medical", possession: "1 oz public; 8 oz home", cultivation: "4 plants/home", enacted: "2014" },
  RI: { status: "Recreational & Medical", possession: "1 oz; 10 oz home", cultivation: "3 mature plants", enacted: "2022" },
  VT: { status: "Recreational & Medical", possession: "1 oz", cultivation: "2 mature/4 immature", enacted: "2018" },
  VA: { status: "Recreational & Medical", possession: "1 oz", cultivation: "4 plants/home", enacted: "2021" },
  WA: { status: "Recreational & Medical", possession: "1 oz", cultivation: "Home grow: medical only", enacted: "2012" },
  DC: { status: "Recreational & Medical", possession: "2 oz", cultivation: "6 plants (3 mature)", enacted: "2014" },
  // Medical-only and others
  AL: { status: "Medical Only", possession: "Qualified patients", cultivation: "No home grow", enacted: "2021" },
  AR: { status: "Medical Only", possession: "2.5 oz/14 days (patients)", cultivation: "No home grow", enacted: "2016" },
  FL: { status: "Medical Only", possession: "State dosing limits", cultivation: "No home grow", enacted: "2016" },
  GA: { status: "Low-THC Medical", possession: "Low-THC oil", cultivation: "No home grow", enacted: "2015" },
  HI: { status: "Medical Only", possession: "4 oz; 7 plants", cultivation: "7 plants allowed", enacted: "2000" },
  LA: { status: "Medical Only", possession: "State program only", cultivation: "No home grow", enacted: "2015" },
  MS: { status: "Medical Only", possession: "3.5g/day; 2.5 oz/month (patients)", cultivation: "Home grow not allowed", enacted: "2022" },
  ND: { status: "Medical Only", possession: "3 oz (patients)", cultivation: "8 plants (card, if far)", enacted: "2016" },
  NH: { status: "Medical Only", possession: "2 oz/month", cultivation: "No home grow (rec)", enacted: "2013" },
  OK: { status: "Medical Only", possession: "3 oz; 8 oz home (patients)", cultivation: "6 mature + 6 seedlings", enacted: "2018" },
  PA: { status: "Medical Only", possession: "Program-limited", cultivation: "No home grow", enacted: "2016" },
  SD: { status: "Medical Only", possession: "3 oz (patients)", cultivation: "3 plants (conditions)", enacted: "2020" },
  UT: { status: "Medical Only", possession: "Program-limited", cultivation: "No home grow", enacted: "2018" },
  WV: { status: "Medical Only", possession: "3 oz/month", cultivation: "No home grow", enacted: "2017" },
  // CBD/Illegal
  IN: { status: "CBD Only", possession: "CBD <0.3% THC", cultivation: "No home grow", enacted: "2018" },
  IA: { status: "CBD/Low-THC", possession: "CBD for patients", cultivation: "No home grow", enacted: "2017" },
  KY: { status: "Medical (2025 start)", possession: "Program-limited", cultivation: "No home grow", enacted: "2023" },
  NC: { status: "Decriminalized", possession: "≤0.5 oz (civil)", cultivation: "No home grow", enacted: "—" },
  TN: { status: "CBD Only", possession: "Low-THC CBD", cultivation: "No home grow", enacted: "2015" },
  TX: { status: "CBD Only", possession: "Low-THC CBD", cultivation: "No home grow", enacted: "2015" },
  WI: { status: "CBD Only", possession: "CBD <0.3% THC", cultivation: "No home grow", enacted: "2017" },
  ID: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", enacted: "—" },
  KS: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", enacted: "—" },
  SC: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", enacted: "—" },
  WY: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", enacted: "—" },
};

// Stop-and-ID + recording rule snapshot (concise, not exhaustive)
const stateIDRights = {
  AL: { stopAndID: true, law: "Ala. Code § 15-5-30", recording: "One-party" },
  AK: { stopAndID: false, law: "—", recording: "One-party" },
  AZ: { stopAndID: true, law: "A.R.S. § 13-2412", recording: "One-party" },
  AR: { stopAndID: true, law: "A.C.A. § 5-71-213", recording: "One-party" },
  CA: { stopAndID: false, law: "— (CP 148 not ID)", recording: "Two-party" },
  CO: { stopAndID: true, law: "C.R.S. § 16-3-103", recording: "One-party" },
  CT: { stopAndID: false, law: "—", recording: "Two-party" },
  DE: { stopAndID: true, law: "11 Del. C. § 1902", recording: "Two-party" },
  FL: { stopAndID: true, law: "Varies (obstruction)", recording: "Two-party" },
  GA: { stopAndID: true, law: "O.C.G.A. § 16-11-36", recording: "One-party" },
  HI: { stopAndID: true, law: "HRS 291C-172 (traffic)", recording: "One-party" },
  ID: { stopAndID: false, law: "—", recording: "One-party" },
  IL: { stopAndID: true, law: "725 ILCS 5/107-14", recording: "Two-party" },
  IN: { stopAndID: true, law: "IC § 34-28-5-3.5", recording: "One-party" },
  IA: { stopAndID: false, law: "—", recording: "One-party" },
  KS: { stopAndID: true, law: "K.S.A. § 22-2402", recording: "One-party" },
  KY: { stopAndID: false, law: "—", recording: "One-party" },
  LA: { stopAndID: true, law: "La. R.S. § 14:108", recording: "One-party" },
  ME: { stopAndID: false, law: "—", recording: "One-party" },
  MD: { stopAndID: false, law: "—", recording: "Two-party" },
  MA: { stopAndID: false, law: "—", recording: "Two-party" },
  MI: { stopAndID: false, law: "—", recording: "One-party" },
  MN: { stopAndID: false, law: "—", recording: "One-party" },
  MS: { stopAndID: false, law: "—", recording: "One-party" },
  MO: { stopAndID: true, law: "RSMo § 84.710 (KC/STL)", recording: "One-party" },
  MT: { stopAndID: true, law: "MCA § 46-5-401", recording: "Two-party" },
  NE: { stopAndID: true, law: "Neb. Rev. Stat. § 29-829", recording: "One-party" },
  NV: { stopAndID: true, law: "NRS § 171.123", recording: "One-party" },
  NH: { stopAndID: true, law: "RSA § 594:2", recording: "Two-party" },
  NJ: { stopAndID: false, law: "—", recording: "One-party" },
  NM: { stopAndID: true, law: "NMSA § 30-22-3", recording: "One-party" },
  NY: { stopAndID: true, law: "CPL § 140.50", recording: "One-party" },
  NC: { stopAndID: false, law: "—", recording: "One-party" },
  ND: { stopAndID: true, law: "NDCC § 29-29-21", recording: "One-party" },
  OH: { stopAndID: true, law: "ORC § 2921.29", recording: "One-party" },
  OK: { stopAndID: false, law: "—", recording: "One-party" },
  OR: { stopAndID: false, law: "—", recording: "One-party (2-party in-person)" },
  PA: { stopAndID: false, law: "—", recording: "Two-party" },
  RI: { stopAndID: true, law: "R.I.G.L. § 12-7-1", recording: "One-party" },
  SC: { stopAndID: false, law: "—", recording: "One-party" },
  SD: { stopAndID: false, law: "—", recording: "One-party" },
  TN: { stopAndID: false, law: "—", recording: "One-party" },
  TX: { stopAndID: true, law: "Tex. Penal Code § 38.02", recording: "One-party" },
  UT: { stopAndID: true, law: "Utah Code § 77-7-15", recording: "One-party" },
  VT: { stopAndID: true, law: "24 V.S.A. § 1983 (muni)", recording: "One-party" },
  VA: { stopAndID: false, law: "—", recording: "One-party" },
  WA: { stopAndID: false, law: "—", recording: "Two-party" },
  WV: { stopAndID: false, law: "—", recording: "One-party" },
  WI: { stopAndID: true, law: "Wis. Stat. § 968.24", recording: "One-party" },
  WY: { stopAndID: false, law: "—", recording: "One-party" },
  DC: { stopAndID: false, law: "—", recording: "One-party" },
};

// Minimal state notice requirements (used for Notice/Pre-suit)
const stateNoticeRequirements = {
  CA: {
    govTortClaim: {
      timeLimit: "6 months",
      statute: "Gov. Code § 911.2",
      requirements: "Use gov claim form; timely presentment required.",
    },
    medMalpractice: {
      timeLimit: "90 days",
      statute: "CCP § 364",
      requirements: "Pre-suit notice to provider.",
    },
    ceaseDesist: { requirements: "Refer to Civ. Code; 93A-style notice not required." },
  },
  MA: {
    govTortClaim: {
      timeLimit: "2 years",
      statute: "M.G.L. c.258 § 4",
      requirements: "Presentment to executive officer.",
    },
    medMalpractice: {
      timeLimit: "182 days",
      statute: "M.G.L. c.231 § 60B",
      requirements: "Tribunal/offer of proof.",
    },
    ceaseDesist: {
      requirements:
        "Chapter 93A consumer demand letter requires 30-day notice before suit.",
      mandatoryNotice: "30 days",
      penalties: "Potential multiple damages for bad-faith refusal.",
    },
  },
  NJ: {
    govTortClaim: {
      timeLimit: "90 days",
      statute: "N.J.S.A. § 59:8-8",
      requirements: "Notice of claim with limited extension for extraordinary circumstances.",
    },
    medMalpractice: {
      timeLimit: "60 days",
      statute: "N.J.S.A. § 2A:53A-27",
      requirements: "Affidavit of merit.",
    },
    ceaseDesist: { requirements: "No fixed statutory C&D timeline in CFA." },
  },
  // Fallback example when selected state not in map
};

// --- HELPERS -------------------------------------------------------------
const safe = (val, fb) => (val ? val : fb);

const addBusinessDays = (start, n) => {
  const d = new Date(start);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
};

const calculateDeadlineFromLabel = (label) => {
  if (!label) return "";
  const today = new Date();
  const business = label.match(/(\d+)\s*business\s*days?/i);
  const calendar = label.match(/(\d+)\s*calendar\s*days?/i) || label.match(/(\d+)\s*days?/i);
  const months = label.match(/(\d+)\s*months?/i);
  const years = label.match(/(\d+)\s*years?/i);
  let dt = null;
  if (business) dt = addBusinessDays(today, parseInt(business[1], 10));
  else if (calendar) {
    dt = new Date(today);
    dt.setDate(dt.getDate() + parseInt(calendar[1], 10));
  } else if (months) {
    dt = new Date(today);
    dt.setMonth(dt.getMonth() + parseInt(months[1], 10));
  } else if (years) {
    dt = new Date(today);
    dt.setFullYear(dt.getFullYear() + parseInt(years[1], 10));
  } else {
    return "Contact the agency for deadline";
  }
  return dt ? dt.toLocaleDateString() : "Contact the agency for deadline";
};

// Pot Brothers at Law – 4 simple steps (concise phrasing)
const fourSteps = [
  "Why did you pull me over?",
  "I’m not discussing my day.",
  "Am I being detained, or am I free to go?",
  "I invoke the Fifth. I want a lawyer.",
];

// --- COMPONENT -----------------------------------------------------------
const LegalToolkit = () => {
  // Core state
  const [documentType, setDocumentType] = useState("FOIA Request");
  const [selectedState, setSelectedState] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [agency, setAgency] = useState("");
  const [recipient, setRecipient] = useState("");
  const [incident, setIncident] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [statute, setStatute] = useState("");

  // Litigation extra fields
  const [plaintiffName, setPlaintiffName] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [courtName, setCourtName] = useState("");
  const [discoveryType, setDiscoveryType] = useState("interrogatories");

  // Notices
  const [claimType, setClaimType] = useState("general");
  const [damages, setDamages] = useState("");
  const [violationType, setViolationType] = useState("harassment");

  // UX
  const [quickMode, setQuickMode] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  // Sorted state list with filter
  const statesSorted = useMemo(() => {
    return Object.entries(statePublicRecordsData)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .filter(([code, data]) =>
        stateFilter.trim() ? data.name.toLowerCase().includes(stateFilter.trim().toLowerCase()) || code.toLowerCase().includes(stateFilter.trim().toLowerCase()) : true
      );
  }, [stateFilter]);

  // Auto-prop based on state + document
  useEffect(() => {
    if (!selectedState) {
      setJurisdiction("");
      setTimeLimit("");
      setStatute("");
      return;
    }
    const st = statePublicRecordsData[selectedState];
    if (!st) return;

    if (documentType === "FOIA Request" || documentType === "State Public Records Request" || documentType === "ID Rights Card") {
      setJurisdiction(st.name);
      setTimeLimit(st.timeLimit || "—");
      setStatute(st.statute || "—");
    } else if (documentType === "Notice of Claim" && stateNoticeRequirements[selectedState]?.govTortClaim) {
      const req = stateNoticeRequirements[selectedState].govTortClaim;
      setJurisdiction(st.name);
      setTimeLimit(req.timeLimit);
      setStatute(req.statute);
    } else if (documentType === "Pre-Suit Notice" && stateNoticeRequirements[selectedState]?.medMalpractice) {
      const req = stateNoticeRequirements[selectedState].medMalpractice;
      setJurisdiction(st.name);
      setTimeLimit(req.timeLimit);
      setStatute(req.statute);
    } else {
      setJurisdiction(st.name);
      setTimeLimit("");
      setStatute("");
    }
  }, [selectedState, documentType]);

  const calculateResponseDate = useMemo(() => () => calculateDeadlineFromLabel(timeLimit), [timeLimit]);

  // Persist all fields to localStorage
  useEffect(() => {
    // why: keep user context even after refresh
    const payload = {
      documentType,
      selectedState,
      stateFilter,
      jurisdiction,
      agency,
      recipient,
      incident,
      timeLimit,
      statute,
      plaintiffName,
      defendantName,
      caseNumber,
      courtName,
      discoveryType,
      claimType,
      damages,
      violationType,
      quickMode,
    };
    try {
      window.localStorage.setItem("legalToolkitState", JSON.stringify(payload));
    } catch (_) {}
  }, [documentType, selectedState, stateFilter, jurisdiction, agency, recipient, incident, timeLimit, statute, plaintiffName, defendantName, caseNumber, courtName, discoveryType, claimType, damages, violationType, quickMode]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("legalToolkitState");
      if (raw) {
        const s = JSON.parse(raw);
        setDocumentType(s.documentType || "FOIA Request");
        setSelectedState(s.selectedState || "");
        setStateFilter(s.stateFilter || "");
        setJurisdiction(s.jurisdiction || "");
        setAgency(s.agency || "");
        setRecipient(s.recipient || "");
        setIncident(s.incident || "");
        setTimeLimit(s.timeLimit || "");
        setStatute(s.statute || "");
        setPlaintiffName(s.plaintiffName || "");
        setDefendantName(s.defendantName || "");
        setCaseNumber(s.caseNumber || "");
        setCourtName(s.courtName || "");
        setDiscoveryType(s.discoveryType || "interrogatories");
        setClaimType(s.claimType || "general");
        setDamages(s.damages || "");
        setViolationType(s.violationType || "harassment");
        setQuickMode(s.quickMode ?? true);
      }
    } catch (_) {}
  }, []);

  // Keyboard shortcut: Ctrl/Cmd+Enter = Generate
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        generateLetter();
        setStatusMsg("Generated via keyboard shortcut");
        setTimeout(() => setStatusMsg(""), 1800);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [documentType, timeLimit, statute, incident, selectedState]);

  // --- Generators --------------------------------------------------------
  const generateFOIARequest = () => {
    const today = new Date().toLocaleDateString();
    const st = selectedState ? statePublicRecordsData[selectedState] : null;
    const updates = st?.updates ? `\n\n**LEGISLATIVE UPDATE:** ${st.updates}` : "";

    return `[Your Name]
[Your Address]
[City, State, ZIP]
[Email] | [Phone]

${today}

${agency || "[Agency Name]"}
FOIA/Records Officer
[Address]

Re: Freedom of Information Act Request (Expedited)

Dear FOIA Officer,

Under 5 U.S.C. § 552 and ${st ? `${st.statute}` : "applicable state law"}, I request copies of:

SUBJECT: ${incident || "[Describe specific records, time range, people, keywords, formats]"}
JURISDICTION: ${jurisdiction || "[Jurisdiction]"}
${st ? `STATE TIMELINE: ${st.timeLimit}` : ""}${updates}

SCOPE:
• All formats (paper/electronic), including emails, messages, media, databases, and metadata.
• Time range: [exact dates].
• Preferred electronic delivery (searchable PDF/native with metadata).

FEES: Please waive fees in the public interest; otherwise, alert me if above $50.

SEGREGABILITY: If withholding, provide a Vaughn index and release all segregable non-exempt portions.

PRESERVATION: Suspend destruction schedules for responsive material.

Please confirm receipt and provide an estimated completion date.

Sincerely,
[Your Name]

—
Tracking: Request Date ${today} • Response due: ${calculateDeadlineFromLabel(st?.timeLimit) || "[By statute]"}`;
  };

  const generateCeaseDesistLetter = () => {
    const today = new Date().toLocaleDateString();
    const recRule = selectedState && stateIDRights[selectedState] ? stateIDRights[selectedState].recording : "One-party (verify local exceptions)";

    return `[Your Name]
[Your Address]
[City, State, ZIP]
[Email] | [Phone]

${today}

${recipient || "[Recipient]"}
[Address]

RE: FORMAL CEASE AND DESIST — ${jurisdiction || "[Jurisdiction]"}

You are demanded to CEASE AND DESIST from the unlawful conduct described below.

TYPE: ${violationType.replace(/_/g, " ")}

VIOLATIONS:
${incident || "[Dates, acts, links, witnesses]"}

LEGAL BASIS:
• Applicable federal/state laws; civil remedies.
• Recording rule in your state: ${recRule}.

DEMAND:
• Immediate cessation.
• Preserve evidence.
• Confirm compliance within ten (10) business days.

Failure to comply may result in injunctions, damages, and fees.

Sincerely,
[Your Name]

Generated: ${today}`;
  };

  const generateNoticeOfClaim = () => {
    const today = new Date().toLocaleDateString();
    const stReq = selectedState && stateNoticeRequirements[selectedState]?.govTortClaim;
    const timeReq = stReq?.timeLimit || "[Per statute]";

    return `[Your Name]
[Address]
[City, State, ZIP]
[Email] | [Phone]

${today}

${agency || recipient || "[Entity/Recipient]"}
Claims/Risk Management
[Address]

RE: NOTICE OF CLAIM — ${jurisdiction || "[Jurisdiction]"}

This serves as formal notice of claim for injuries and damages arising from the incident below.

CLAIM TYPE: ${claimType}

INCIDENT:
${incident || "[Date/Time, Location, Parties, Chronology, Conditions, Witnesses]"}

DAMAGES:
${damages || "[Medical costs, wage loss, property, non-economic, future care]"}

LEGAL BASIS: Negligence, dangerous condition of property, constitutional violations as applicable.

STATUTE: ${stReq ? `${stReq.statute} — filing within ${timeReq}` : "[Governing statute]"}.

Please acknowledge and provide claims handling instructions within 30 days.

Sincerely,
[Your Name]

Tracking: Notice date ${today} • Statutory deadline: ${timeReq}`;
  };

  const generatePreSuitNotice = () => {
    const today = new Date().toLocaleDateString();
    const med = selectedState && stateNoticeRequirements[selectedState]?.medMalpractice;

    return `[Your Name]
[Address]
[City, State, ZIP]
[Email] | [Phone]

${today}

${recipient || "[Provider/Professional]"}
[Address]

RE: PRE-SUIT NOTICE — ${jurisdiction || "[Jurisdiction]"}

This letter provides pre-suit notice of professional negligence.

CARE PERIOD: [Start → End].
FACTS: ${incident || "[Chronological narrative incl. specific acts/omissions]"}
DAMAGES: ${damages || "[Economic + non-economic]"}

REQUIREMENTS: ${med ? `${med.statute} — ${med.timeLimit}. ${med.requirements}` : "[State-specific pre-suit requirements]"}.

Settlement discussion invited within ${med?.timeLimit || "60 days"} of receipt.

Sincerely,
[Your Name]

Generated: ${today}`;
  };

  const generateSubpoenaDucesTecum = () => {
    const today = new Date().toLocaleDateString();
    return `${courtName || "[COURT]"}
${jurisdiction || "[JURISDICTION]"}

${plaintiffName || "[PLAINTIFF]"}, Plaintiff,

v.                                  Case No. ${caseNumber || "[CASE]"}

${defendantName || "[DEFENDANT]"}, Defendant.

SUBPOENA DUCES TECUM

TO: ${recipient || "[Witness]"} — [Address]

YOU ARE COMMANDED to appear and/or produce the documents described below:

APPEARANCE: Date [ ], Time [ ], Location [ ].

DOCUMENTS: ${incident || "[Specific categories, time periods, custodians, ESI formats]"}

FORMAT: Native with metadata; otherwise searchable PDF. Provide a privilege log for any withholding.

OBJECTIONS: Serve within [ ] days of service.

WITNESS FEES: As allowed by law.

Date: ${today}

__________________________
[Attorney Name], [Bar No.]
Counsel for ${plaintiffName || "[Plaintiff]"}`;
  };

  const generateDiscoveryRequest = () => {
    const today = new Date().toLocaleDateString();
    const title =
      discoveryType === "interrogatories"
        ? "INTERROGATORIES"
        : discoveryType === "requests_for_production"
        ? "REQUESTS FOR PRODUCTION"
        : discoveryType === "requests_for_admission"
        ? "REQUESTS FOR ADMISSION"
        : "DISCOVERY REQUESTS";

    return `${courtName || "[COURT]"}
${jurisdiction || "[JURISDICTION]"}

${plaintiffName || "[PLAINTIFF]"}, Plaintiff,

v.                                  Case No. ${caseNumber || "[CASE]"}

${defendantName || "[DEFENDANT]"}, Defendant.

${(plaintiffName || "[PLAINTIFF]").toUpperCase()}'S ${title} TO ${(defendantName || "[DEFENDANT]").toUpperCase()}
(SET 001)

TO: ${defendantName || "[Defendant]"}

YOU ARE REQUESTED to respond pursuant to the applicable rules of civil procedure.

DEFINITIONS/INSTRUCTIONS: "Document" includes ESI; these requests are continuing.

${
      discoveryType === "interrogatories"
        ? `INTERROGATORIES:
1. Identify yourself.
2. Identify all persons with knowledge of the facts.
3. Describe your actions regarding ${incident || "[subject]"}.
4. Identify all documents relating to ${incident || "[subject]"}.
5. State all facts supporting your denials.
6. Identify experts and expected testimony.
7. Describe all claimed damages.
8. Identify insurance policies.
9. State whether you have given any statements.
10. List lawsuits in which you were a party in the last ten years.`
        : discoveryType === "requests_for_production"
        ? `REQUESTS FOR PRODUCTION:
1. All documents supporting your interrogatory answers.
2. All documents relating to ${incident || "[subject]"}.
3. All communications with third parties re: ${incident || "[subject]"}.
4. All photos, video, audio relating to ${incident || "[subject]"}.
5. Policies/procedures in effect at the time.
6. Training materials and manuals.
7. Incident/accident reports.
8. Insurance policies and agreements.
9. Expert reports and analyses.
10. Relevant electronic communications (emails, texts, social).`
        : `REQUESTS FOR ADMISSION:
1. Admit you were present at the location of ${incident || "[incident]"}.
2. Admit you had knowledge of the facts alleged.
3. Admit the genuineness of attached exhibits.
4. Admit you received notice of ${incident || "[relevant event]"}.
5. Admit failure to follow applicable policies/procedures.
6. Admit your actions caused plaintiff's damages.
7. Admit absence of evidence supporting affirmative defenses.
8. Admit accuracy of statements attributed to you.
9. Admit existence of applicable insurance coverage.
10. Admit consultation with experts regarding ${incident || "[subject]"}.`
    }

PRIVILEGE LOG: Provide for any withheld material.
ESI: Produce in native with metadata; otherwise searchable PDF.

Applicable law: ${statute || "[Rules of Civil Procedure]"}

Responses due 30 days from service, unless modified.

Date: ${today}

__________________________
[Attorney Name]
Counsel for ${plaintiffName || "[Plaintiff]"}`;
  };

  // ID RIGHTS CARD (JSX) --------------------------------------------------
  const IDCard = () => {
    if (!selectedState)
      return <em style={{ color: "#666" }}>Select a state to generate the card.</em>;

    const stName = statePublicRecordsData[selectedState]?.name || "[STATE]";
    const idr = stateIDRights[selectedState] || { stopAndID: false, law: "—", recording: "—" };
    const canna = cannabisLaws[selectedState] || { status: "Unknown", possession: "See statute", cultivation: "See statute" };
    const foia = statePublicRecordsData[selectedState] || { statute: "—", timeLimit: "—" };

    const stopSteps = idr.stopAndID
      ? [
          "Stay calm. Keep hands visible.",
          "Provide your true full name (and info required by statute).",
          "Politely ask the legal basis for the stop.",
          "Do not consent to searches. Ask if you are free to go.",
        ]
      : [
          "Stay calm. Keep hands visible.",
          "You generally do not have to show ID unless driving, under arrest, or otherwise required by law.",
          "You may ask: ‘Am I being detained, or am I free to go?’.",
          "Do not consent to searches. If detained, remain silent and ask for a lawyer.",
        ];

    return (
      <div
        style={{
          width: 820,
          padding: 20,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${theme.brand1}, ${theme.brand2})`,
          color: "#fff",
          border: "2px solid #fff",
          boxShadow: "0 10px 24px rgba(0,0,0,.25)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", paddingBottom: 8, borderBottom: "1px solid #ffffff55" }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>{stName.toUpperCase()}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>CIVIL RIGHTS • LAWS • QUICK REFERENCE</div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
          <div>
            <Section title="Constitutional Rights">
              <List items={["I do not consent to searches.", "I choose to remain silent.", "I do not waive any rights.", "I want a lawyer if detained."]} />
            </Section>

            <Section title="State Laws (Quick Cite)">
              <KV k="Stop & ID" v={idr.stopAndID ? `YES — ${idr.law}` : "NO state stop-and-identify statute"} />
              <KV k="Recording Rule" v={idr.recording || "—"} />
              <KV k="FOIA Statute" v={`${foia.statute || "—"}`} />
              <KV k="FOIA Response" v={`${foia.timeLimit || "—"}`} />
            </Section>

            <Section title="Cannabis (Possession & Cultivation)">
              <KV k="Status" v={canna.status} />
              <KV k="Possession" v={canna.possession || "See statute"} />
              <KV k="Cultivation" v={canna.cultivation || "See statute"} />
            </Section>
          </div>

          <div>
            <Section title={idr.stopAndID ? "Police Contact — Stop-&-ID Steps" : "Police Contact — If Stopped"}>
              <Ordered items={stopSteps} />
            </Section>

            <Section title="Four Simple Steps (always)">
              <Ordered items={fourSteps} compact />
            </Section>

            <Section title="Emergency">
              <div style={{ fontSize: 12 }}>Attorney: __________________</div>
              <div style={{ fontSize: 12 }}>Emergency: ________________</div>
            </Section>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 10,
          paddingTop: 8,
          fontSize: 11,
          display: "flex",
          justifyContent: "space-between",
          opacity: 0.85,
          borderTop: "1px solid #ffffff55",
        }}>
          <div>Generated: {new Date().toLocaleDateString()}</div>
          <div>Civil Rights Legal Toolkit Pro 2025</div>
        </div>
      </div>
    );
  };

  const generateLetter = () => {
    let out = "";
    switch (documentType) {
      case "FOIA Request":
      case "State Public Records Request":
        out = generateFOIARequest();
        break;
      case "Cease and Desist Letter":
        out = generateCeaseDesistLetter();
        break;
      case "Notice of Claim":
        out = generateNoticeOfClaim();
        break;
      case "Pre-Suit Notice":
        out = generatePreSuitNotice();
        break;
      case "Subpoena Duces Tecum":
        out = generateSubpoenaDucesTecum();
        break;
      case "Discovery Request":
        out = generateDiscoveryRequest();
        break;
      case "ID Rights Card":
        out = "[CARD READY BELOW]";
        break;
      default:
        out = "";
    }
    setGeneratedLetter(out);
  };

  const resetForm = () => {
    setDocumentType("FOIA Request");
    setSelectedState("");
    setStateFilter("");
    setJurisdiction("");
    setAgency("");
    setRecipient("");
    setIncident("");
    setGeneratedLetter("");
    setTimeLimit("");
    setStatute("");
    setPlaintiffName("");
    setDefendantName("");
    setCaseNumber("");
    setCourtName("");
    setDiscoveryType("interrogatories");
    setClaimType("general");
    setDamages("");
    setViolationType("harassment");
    setQuickMode(true);
    setStatusMsg("Form reset");
    setTimeout(() => setStatusMsg(""), 1500);
  };

  // --- UI ---------------------------------------------------------------
  return (
    <div style={styles.appShell}>
      <div style={styles.card}>
        <div style={styles.h1wrap}>
          <h1 style={styles.h1}>Civil Rights Legal Toolkit Pro 2025</h1>
          <p style={styles.sub}>Attorney-Level Document Generator • 2024–2025 legislative snapshot • Professional practice tooling</p>
        </div>

        {/* Status bar */}
        <div aria-live="polite" style={{ minHeight: 20, color: theme.brand1, fontWeight: 700, marginBottom: 6 }}>{statusMsg}</div>

        {/* Quick Mode & actions */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <label style={{ fontWeight: 700, color: theme.ink }}>
            <input type="checkbox" checked={quickMode} onChange={(e) => setQuickMode(e.target.checked)} /> Quick Mode
          </label>
          <span style={{ fontSize: 12, color: "#667085" }}>
            {quickMode ? "Fewer inputs. Smart defaults. You can still edit output." : "Show all fields for granular control."}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={resetForm} style={styles.subtleBtn}>↺ Reset</button>
            <button onClick={printCurrent} style={styles.subtleBtn}>🖨️ Print</button>
            <button onClick={downloadJSON} style={styles.subtleBtn}>⬇️ JSON</button>
          </div>
        </div>

        {/* Top inputs */}
        <div style={styles.grid}>
          <div>
            <label style={styles.label}>📄 Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={styles.text(false)}
            >
              <option value="FOIA Request">FOIA Request (Enhanced)</option>
              <option value="State Public Records Request">State Public Records Request</option>
              <option value="ID Rights Card">Civil Rights & Laws Reference Card</option>
              <option value="Cease and Desist Letter">Professional Cease and Desist Letter</option>
              <option value="Notice of Claim">Formal Notice of Claim</option>
              <option value="Pre-Suit Notice">Pre-Suit Professional Liability Notice</option>
              <option value="Subpoena Duces Tecum">Subpoena Duces Tecum</option>
              <option value="Discovery Request">Discovery Requests (Interrogatories/RFP/RFA)</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>🏛️ State/Jurisdiction</label>
            <input
              type="text"
              placeholder="Filter states by name or code…"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              style={{ ...styles.text(false), marginBottom: 8 }}
            />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={styles.text(false)}
            >
              <option value="">Select a state…</option>
              {statesSorted.map(([code, data]) => (
                <option key={code} value={code}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic recipient/agency */}
          <div>
            <label style={styles.label}>
              {documentType === "FOIA Request" || documentType === "State Public Records Request"
                ? "🏢 Agency/Records Custodian"
                : documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request"
                ? "👤 Witness/Respondent Name"
                : "👤 Recipient/Target"}
            </label>
            <input
              type="text"
              value={documentType === "FOIA Request" || documentType === "State Public Records Request" ? agency : recipient}
              onChange={(e) =>
                documentType === "FOIA Request" || documentType === "State Public Records Request"
                  ? setAgency(e.target.value)
                  : setRecipient(e.target.value)
              }
              placeholder={
                documentType === "FOIA Request" || documentType === "State Public Records Request"
                  ? "Enter agency/department"
                  : documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request"
                  ? "Enter witness/respondent"
                  : "Enter recipient"
              }
              style={styles.text(!!selectedState)}
            />
          </div>

          <div>
            <label style={styles.label}>📍 Jurisdiction</label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="Auto-populates from state"
              style={styles.text(!!selectedState)}
            />
          </div>
        </div>

        {/* Quick subject box */}
        {documentType !== "ID Rights Card" && (
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>
              📝 {documentType === "FOIA Request" || documentType === "State Public Records Request"
                ? "Records Requested (be specific)"
                : documentType === "Cease and Desist Letter"
                ? "Detailed Violation Description"
                : documentType === "Notice of Claim"
                ? "Comprehensive Incident Description"
                : documentType === "Pre-Suit Notice"
                ? "Malpractice/Negligence Description"
                : documentType === "Subpoena Duces Tecum"
                ? "Documents/Materials to Produce"
                : documentType === "Discovery Request"
                ? "Case facts & discovery scope"
                : "Subject"}
            </label>
            <textarea
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              style={styles.area}
              placeholder={
                quickMode
                  ? "Short description. You can refine after generation."
                  : "Include dates, people, departments, keywords, document types, formats, and relevant timeframes."
              }
            />
          </div>
        )}

        {/* Damages box for Notice/Pre-Suit */}
        {(documentType === "Notice of Claim" || documentType === "Pre-Suit Notice") && (
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>💸 Damages Summary</label>
            <textarea
              value={damages}
              onChange={(e) => setDamages(e.target.value)}
              style={{ ...styles.area, height: 120 }}
              placeholder="Itemize medical, wage loss, property, non-economic, and future care."
            />
          </div>
        )}

        {/* Litigation extras */}
        {(documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request") && (
          <div style={styles.panel("#ffa726")}>
            <h3 style={{ color: "#f57c00", margin: 0, marginBottom: 10 }}>⚖️ Litigation Fields</h3>
            <div style={styles.grid}>
              <Field label="Plaintiff Name" value={plaintiffName} onChange={setPlaintiffName} orange />
              <Field label="Defendant Name" value={defendantName} onChange={setDefendantName} orange />
              <Field label="Case Number" value={caseNumber} onChange={setCaseNumber} orange />
              <Field label="Court Name" value={courtName} onChange={setCourtName} orange />
            </div>
            {documentType === "Discovery Request" && (
              <div style={{ marginTop: 8 }}>
                <label style={styles.label}>Discovery Type</label>
                <select style={styles.text(false)} value={discoveryType} onChange={(e) => setDiscoveryType(e.target.value)}>
                  <option value="interrogatories">Interrogatories</option>
                  <option value="requests_for_production">Requests for Production</option>
                  <option value="requests_for_admission">Requests for Admission</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Notice fields */}
        {(documentType === "Notice of Claim" || documentType === "Pre-Suit Notice") && (
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>🎯 {documentType === "Notice of Claim" ? "Claim Type" : "Professional Area"}</label>
            <select style={styles.text(false)} value={claimType} onChange={(e) => setClaimType(e.target.value)}>
              {documentType === "Notice of Claim" ? (
                <>
                  <option value="government">Government/Municipal Tort Claim</option>
                  <option value="general">General Civil Liability Claim</option>
                </>
              ) : (
                <>
                  <option value="medical">Medical Malpractice</option>
                  <option value="legal">Legal Malpractice</option>
                  <option value="professional">Other Professional Liability</option>
                </>
              )}
            </select>
          </div>
        )}

        {documentType === "Cease and Desist Letter" && (
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>⚠️ Violation Type</label>
            <select style={styles.text(false)} value={violationType} onChange={(e) => setViolationType(e.target.value)}>
              <option value="harassment">Harassment/Intimidation/Stalking</option>
              <option value="intellectual_property">Intellectual Property Infringement</option>
              <option value="debt_collection">Improper Debt Collection</option>
              <option value="trespass">Trespass/Property</option>
              <option value="defamation">Defamation/Libel</option>
              <option value="contract">Contract/Breach</option>
              <option value="privacy">Privacy/Identity</option>
            </select>
          </div>
        )}

        {/* Auto-populated state info */}
        {selectedState && (
          <div style={styles.panel(theme.ok)}>
            <h3 style={{ color: theme.ok, margin: 0, marginBottom: 10 }}>📋 Auto-Populated Info — {statePublicRecordsData[selectedState].name}</h3>
            <div style={styles.grid}>
              <Readout label="⚖️ Applicable Statute" value={statute || "Select document type for statute info"} mono />
              <Readout label="⏰ Time Requirement" value={timeLimit || "Select document type for timeline"} strong />
              <Readout label="📅 Deadline Calculation" value={calculateResponseDate() || "Select document type for deadline"} warn />
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generateLetter}
          style={styles.cta}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.info)}
        >
          🚀 Generate {documentType === "ID Rights Card" ? "Civil Rights Reference Card" : "Legal Document"}
        </button>

        {/* Output */}
        {generatedLetter !== "" && (
          <div style={{ ...styles.panel(theme.ok), marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ color: theme.ok, margin: 0 }}>📄 Generated {documentType}</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    try {
                      if (documentType === "ID Rights Card") {
                        const stName = selectedState ? statePublicRecordsData[selectedState].name : "[STATE]";
                        const idr = selectedState ? stateIDRights[selectedState] : null;
                        const canna = selectedState ? cannabisLaws[selectedState] : null;
                        const txt = `${stName} — Civil Rights Quick Card\nStop & ID: ${idr?.stopAndID ? "YES" : "NO"} (${idr?.law || "—"})\nRecording: ${idr?.recording || "—"}\nCannabis: ${canna?.status || "—"}; Possession: ${canna?.possession || "—"}; Cultivation: ${canna?.cultivation || "—"}\nFOIA: ${statePublicRecordsData[selectedState]?.statute || "—"}; ${statePublicRecordsData[selectedState]?.timeLimit || "—"}`;
                        navigator.clipboard.writeText(txt);
                      } else {
                        navigator.clipboard.writeText(generatedLetter);
                      }
                      setStatusMsg("Copied to clipboard");
                      setTimeout(() => setStatusMsg(""), 1500);
                    } catch (_) {
                      alert("Copy failed. Select the text and copy manually.");
                    }
                  }}
                  style={{ ...styles.text(false), padding: 10, fontWeight: 700, background: theme.ok, color: "#fff", border: 0, width: "auto" }}
                >
                  📋 Copy
                </button>

                {documentType === "ID Rights Card" ? (
                  <>
                    <button
                      onClick={() => downloadCardPNG()}
                      style={{ ...styles.text(false), padding: 10, fontWeight: 700, background: theme.danger, color: "#fff", border: 0, width: "auto" }}
                    >
                      📸 Download Image
                    </button>
                    <button
                      onClick={() => printWalletCard()}
                      style={{ ...styles.text(false), padding: 10, fontWeight: 700, background: theme.warn, color: "#fff", border: 0, width: "auto" }}
                    >
                      🖨️ Print Wallet Card
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        try {
                          const blob = new Blob([generatedLetter], { type: "text/plain" });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          const today = new Date().toLocaleDateString().replace(/\//g, "-");
                          a.download = `${documentType.replace(/\s+/g, "_")}_${today}.txt`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                        } catch (_) {
                          alert("Download failed in this browser.");
                        }
                      }}
                      style={{ ...styles.text(false), padding: 10, fontWeight: 700, background: "#8e44ad", color: "#fff", border: 0, width: "auto" }}
                    >
                      💾 Download Text
                    </button>
                    <button
                      onClick={printCurrent}
                      style={{ ...styles.text(false), padding: 10, fontWeight: 700, background: theme.info, color: "#fff", border: 0, width: "auto" }}
                    >
                      🖨️ Print
                    </button>
                  </>
                )}
              </div>
            </div>

            {documentType === "ID Rights Card" ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 16, background: theme.subtle, borderRadius: 12, marginTop: 12 }}>
                <div id="id-rights-card-display">
                  <IDCard />
                </div>
              </div>
            ) : (
              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                style={{ ...styles.area, height: 520, fontFamily: "monospace", borderColor: theme.ok }}
              />
            )}

            <div style={styles.note(documentType === "ID Rights Card" ? "#e3f2fd" : "#fff3cd", documentType === "ID Rights Card" ? "#2196f3" : "#ffeaa7", documentType === "ID Rights Card" ? "#1565c0" : "#856404")}
            >
              <strong>💡 {documentType === "ID Rights Card" ? "Reference Card" : "Legal Notice"}:</strong> Review placeholders and adapt for your facts; consider legal counsel for complex matters.
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ ...styles.panel("#6c757d"), background: theme.subtle, color: "#495057", textAlign: "center", marginTop: 12 }}>
          <strong>⚖️ CIVIL RIGHTS TOOLKIT — 2025 SNAPSHOT</strong>
          <br />
          Laws change. Information reflects a 2024–2025 snapshot and may require verification. Not legal advice.
        </div>
      </div>
    </div>
  );

  // --- Utilities: Card export/print -------------------------------------
  function downloadCardPNG() {
    if (!selectedState) {
      alert("Select a state first.");
      return;
    }
    const wrap = typeof document !== "undefined" && document.getElementById("id-rights-card-display");
    if (!wrap) {
      alert("Preview not mounted yet.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1200; // upscale for crisper export
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // Background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, theme.brand1);
    grad.addColorStop(1, theme.brand2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Text helpers
    const stName = statePublicRecordsData[selectedState]?.name || "[STATE]";
    const idr = stateIDRights[selectedState] || { stopAndID: false, law: "—", recording: "—" };
    const canna = cannabisLaws[selectedState] || { status: "Unknown", possession: "See statute", cultivation: "See statute" };
    const foia = statePublicRecordsData[selectedState] || { statute: "—", timeLimit: "—" };

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 48px Arial";
    ctx.fillText(stName.toUpperCase(), canvas.width / 2, 90);

    ctx.font = "bold 28px Arial";
    ctx.fillText("CIVIL RIGHTS • LAWS • QUICK REFERENCE", canvas.width / 2, 130);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 150);
    ctx.lineTo(canvas.width - 60, 150);
    ctx.stroke();

    // Left column
    const leftX = 80;
    let y = 190;

    ctx.fillStyle = "#ffd700";
    ctx.textAlign = "left";
    ctx.font = "bold 28px Arial";
    ctx.fillText("CONSTITUTIONAL RIGHTS", leftX, y);

    y += 34;
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    [
      "I do not consent to searches",
      "I choose to remain silent",
      "I do not waive any rights",
      "I want a lawyer if detained",
    ].forEach((t) => {
      y += 28;
      ctx.fillText(`• ${t}`, leftX, y);
    });

    y += 16;
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 24px Arial";
    ctx.fillText("STATE LAWS", leftX, (y += 30));

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    y += 28; ctx.fillText(`Stop & ID: ${idr.stopAndID ? "YES — " + idr.law : "NO state stop-and-identify"}`, leftX, y);
    y += 24; ctx.fillText(`Recording: ${idr.recording}`, leftX, y);
    y += 24; ctx.fillText(`FOIA: ${foia.statute} — ${foia.timeLimit}`, leftX, y);

    y += 10;
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 24px Arial";
    ctx.fillText("CANNABIS", leftX, (y += 30));

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    y += 28; ctx.fillText(`Status: ${canna.status}`, leftX, y);
    y += 24; ctx.fillText(`Possession: ${canna.possession}`, leftX, y);
    y += 24; ctx.fillText(`Cultivation: ${canna.cultivation}`, leftX, y);

    // Right column — steps
    const rightX = canvas.width / 2 + 40;
    let ry = 190;

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 28px Arial";
    ctx.fillText(idr.stopAndID ? "STOP-&-ID: WHAT TO DO" : "IF STOPPED: WHAT TO DO", rightX, ry);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.font = "18px Arial";
    const steps = idr.stopAndID
      ? [
          "Stay calm; hands visible.",
          "Provide true full name as required.",
          "Ask the legal basis for the stop.",
          "Do not consent to searches; ask if free to go.",
        ]
      : [
          "Stay calm; hands visible.",
          "ID generally not required unless driving/arrest.",
          "Ask: ‘Am I detained or free to go?’",
          "Decline consent; request a lawyer if detained.",
        ];
    steps.forEach((t) => { ry += 28; ctx.fillText(`• ${t}`, rightX, ry); });

    ry += 16;
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 24px Arial";
    ctx.fillText("FOUR SIMPLE STEPS (ALWAYS)", rightX, (ry += 30));

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    fourSteps.forEach((t, i) => { ry += 24; ctx.fillText(`${i + 1}. ${t}`, rightX, ry); });

    // Footer
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.textAlign = "center";
    ctx.font = "16px Arial";
    ctx.fillText(
      `Generated: ${new Date().toLocaleDateString()} • Civil Rights Toolkit Pro 2025`,
      canvas.width / 2,
      canvas.height - 28
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const st = statePublicRecordsData[selectedState]?.name || "STATE";
      a.download = `${st.replace(/\s+/g, "_")}_Civil_Rights_Card.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function printWalletCard() {
    const stName = statePublicRecordsData[selectedState]?.name || "STATE";
    const idr = stateIDRights[selectedState] || { stopAndID: false, law: "—", recording: "—" };
    const canna = cannabisLaws[selectedState] || { status: "Unknown", possession: "See statute", cultivation: "See statute" };
    const foia = statePublicRecordsData[selectedState] || { statute: "—", timeLimit: "—" };

    const win = typeof window !== "undefined" ? window.open("", "_blank") : null;
    if (!win) {
      alert("Popup blocked. Allow popups to print.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>${stName} Civil Rights Card</title>
          <style>
            body{font-family: Arial, sans-serif; margin: .5in;}
            .card{width:3.5in;height:2.25in;background:linear-gradient(135deg, ${theme.brand1}, ${theme.brand2});
              border:2px solid #fff;border-radius:12px;padding:.2in;color:#fff;box-shadow:0 4px 8px rgba(0,0,0,.3);}
            .h{font-weight:bold;text-align:center;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:4px;margin-bottom:6px;}
            .t1{font-size:12px}
            .t2{font-size:10px;font-weight:600}
            .s{font-size:7px;line-height:1.25}
            .k{color:#ffd700;font-weight:bold;font-size:8px;margin-top:4px}
            .flex{display:flex;gap:8px}
            @media print{body{margin:0}.card{width:3.375in;height:2.25in}}
          </style>
        </head>
        <body>
          <div class="card">
            <div class="h">
              <div class="t1">${stName.toUpperCase()}</div>
              <div class="t2">CIVIL RIGHTS • LAWS • QUICK REFERENCE</div>
            </div>
            <div class="flex">
              <div style="flex:1">
                <div class="k">CONSTITUTIONAL RIGHTS</div>
                <div class="s">• I do not consent to searches</div>
                <div class="s">• I choose to remain silent</div>
                <div class="s">• I do not waive any rights</div>
                <div class="s">• I want a lawyer if detained</div>
                <div class="k">STATE LAWS</div>
                <div class="s">Stop & ID: ${idr.stopAndID ? `YES — ${idr.law}` : "NO stop-and-identify"}</div>
                <div class="s">Recording: ${idr.recording}</div>
                <div class="s">FOIA: ${foia.statute}; ${foia.timeLimit}</div>
                <div class="k">CANNABIS</div>
                <div class="s">Status: ${canna.status}</div>
                <div class="s">Possession: ${canna.possession}</div>
                <div class="s">Cultivation: ${canna.cultivation}</div>
              </div>
              <div style="flex:1">
                <div class="k">${idr.stopAndID ? "STOP-&-ID: WHAT TO DO" : "IF STOPPED: WHAT TO DO"}</div>
                <div class="s">• ${idr.stopAndID ? "Provide true name if required" : "ID not required unless driving/arrest"}</div>
                <div class="s">• Ask legal basis for the stop</div>
                <div class="s">• Do not consent to searches</div>
                <div class="s">• Ask if free to go</div>
                <div class="k">FOUR SIMPLE STEPS</div>
                <div class="s">1. ${fourSteps[0]}</div>
                <div class="s">2. ${fourSteps[1]}</div>
                <div class="s">3. ${fourSteps[2]}</div>
                <div class="s">4. ${fourSteps[3]}</div>
                <div class="k">EMERGENCY</div>
                <div class="s">Attorney: __________</div>
                <div class="s">Emergency: _________</div>
              </div>
            </div>
            <div style="text-align:center;opacity:.85;border-top:1px solid rgba(255,255,255,.3);margin-top:4px;padding-top:4px" class="s">
              Generated: ${new Date().toLocaleDateString()} — Civil Rights Toolkit Pro 2025
            </div>
          </div>
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  function printCurrent() {
    if (documentType === "ID Rights Card") {
      printWalletCard();
      return;
    }
    const win = typeof window !== "undefined" ? window.open("", "_blank") : null;
    if (!win) {
      alert("Popup blocked. Allow popups to print.");
      return;
    }
    const title = `${documentType} — ${new Date().toLocaleDateString()}`;
    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body{font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: .75in; white-space: pre-wrap;}
            pre{font: 12px/1.4 monospace;}
          </style>
        </head>
        <body>
          <h2>${documentType}</h2>
          <pre>${(generatedLetter || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  function downloadJSON() {
    const payload = {
      documentType,
      selectedState,
      jurisdiction,
      agency,
      recipient,
      incident,
      timeLimit,
      statute,
      plaintiffName,
      defendantName,
      caseNumber,
      courtName,
      discoveryType,
      claimType,
      damages,
      violationType,
      quickMode,
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `legal_toolkit_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (_) {
      alert("Browser blocked JSON download.");
    }
  }
};

// --- Small UI helpers ----------------------------------------------------
const Field = ({ label, value, onChange, orange = false }) => (
  <div>
    <label style={styles.label}>{label}:</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={styles.text(orange)} />
  </div>
);

const Readout = ({ label, value, mono = false, strong = false, warn = false }) => (
  <div>
    <label style={{ ...styles.label, fontSize: 14 }}>{label}:</label>
    <div
      style={{
        padding: 12,
        border: `2px solid ${warn ? theme.danger : theme.ok}`,
        borderRadius: 8,
        fontSize: 14,
        background: warn ? "#fff5f5" : "#fff",
        color: "#000",
        fontFamily: mono ? "monospace" : "inherit",
        fontWeight: strong ? 700 : 400,
        wordBreak: "break-word",
      }}
    >
      {safe(value, "—")}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ color: "#ffd700", fontWeight: 800, marginBottom: 6, fontSize: 13 }}>{title}</div>
    <div style={{ fontSize: 12 }}>{children}</div>
  </div>
);

const KV = ({ k, v }) => (
  <div style={{ display: "flex", gap: 8, fontSize: 12, marginBottom: 4 }}>
    <div style={{ width: 120, color: "#e8eaf6" }}>{k}:</div>
    <div style={{ fontWeight: 700 }}>{v}</div>
  </div>
);

const List = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 18 }}>
    {items.map((t, i) => (
      <li key={i} style={{ marginBottom: 4 }}>{t}</li>
    ))}
  </ul>
);

const Ordered = ({ items, compact = false }) => (
  <ol style={{ margin: 0, paddingLeft: 18 }}>
    {items.map((t, i) => (
      <li key={i} style={{ marginBottom: compact ? 2 : 6 }}>{t}</li>
    ))}
  </ol>
);

export default LegalToolkit;
