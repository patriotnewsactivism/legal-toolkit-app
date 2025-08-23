import React, { useEffect, useMemo, useState } from "react";

/**
 * Civil Rights Legal Toolkit Pro 2025
 * - Cleaner Tailwind UI
 * - ID cards show cannabis possession + cultivation (when known), key statutes, recording rules
 * - Stop-&-ID specific guidance, plus Pot Brothers at Law "4 Simple Steps" (concise phrasing)
 * - Quick Mode to generate forms with fewer, simpler fields
 * - Clipboard, PNG download, wallet-size print for ID cards
 *
 * NOTE: Cannabis and statute data are summarized for convenience; verify locally before relying in practice.
 */

// ===================== DATA =====================
// Public Records (FOIA/state) quick reference
const statePublicRecordsData = {
  AL: { name: "Alabama", statute: "Alabama Open Records Act (Ala. Code § 36-12-40)", timeLimit: "7–10 business days" },
  AK: { name: "Alaska", statute: "Alaska Public Records Act (AS § 40.25.110–220)", timeLimit: "10 business days" },
  AZ: { name: "Arizona", statute: "Arizona Public Records Law (A.R.S. § 39-121)", timeLimit: "Promptly (no fixed deadline)" },
  AR: { name: "Arkansas", statute: "Arkansas FOIA (A.C.A. § 25-19-101)", timeLimit: "3 business days" },
  CA: { name: "California", statute: "California Public Records Act (Gov. Code §§ 7920.000 et seq.)", timeLimit: "10 calendar days", updates: "Recodified by AB 473, effective Jan 1, 2023" },
  CO: { name: "Colorado", statute: "Colorado Open Records Act (C.R.S. § 24-72-201)", timeLimit: "3 business days" },
  CT: { name: "Connecticut", statute: "Connecticut FOIA (C.G.S. § 1-200)", timeLimit: "4 business days" },
  DE: { name: "Delaware", statute: "Delaware FOIA (29 Del. C. § 10001)", timeLimit: "15 business days" },
  FL: { name: "Florida", statute: "Florida Public Records (F.S. ch. 119)", timeLimit: "Reasonable time" },
  GA: { name: "Georgia", statute: "Georgia Open Records Act (O.C.G.A. § 50-18-70)", timeLimit: "3 business days" },
  HI: { name: "Hawaii", statute: "Hawaii UIPA (HRS § 92F)", timeLimit: "10 business days" },
  ID: { name: "Idaho", statute: "Idaho Public Records (Idaho Code § 74-101)", timeLimit: "3 business days" },
  IL: { name: "Illinois", statute: "Illinois FOIA (5 ILCS 140)", timeLimit: "5 business days" },
  IN: { name: "Indiana", statute: "Access to Public Records (IC § 5-14-3)", timeLimit: "Prompt (24h if readily available)" },
  IA: { name: "Iowa", statute: "Iowa Open Records (Iowa Code § 22)", timeLimit: "As soon as reasonably possible" },
  KS: { name: "Kansas", statute: "KORA (K.S.A. § 45-215)", timeLimit: "3 business days" },
  KY: { name: "Kentucky", statute: "Open Records (KRS § 61.870)", timeLimit: "3 business days" },
  LA: { name: "Louisiana", statute: "Public Records Act (R.S. 44:1)", timeLimit: "3 business days" },
  ME: { name: "Maine", statute: "Freedom of Access Act (1 M.R.S. § 401)", timeLimit: "Reasonable time" },
  MD: { name: "Maryland", statute: "Public Information Act (GP § 4-101)", timeLimit: "30 days" },
  MA: { name: "Massachusetts", statute: "Public Records Law (M.G.L. c. 66)", timeLimit: "10 business days" },
  MI: { name: "Michigan", statute: "Michigan FOIA (MCL § 15.231)", timeLimit: "5 business days" },
  MN: { name: "Minnesota", statute: "Data Practices Act (Minn. Stat. § 13.01)", timeLimit: "Immediately if readily available" },
  MS: { name: "Mississippi", statute: "Public Records Act (Miss. Code § 25-61-1)", timeLimit: "7 business days" },
  MO: { name: "Missouri", statute: "Sunshine Law (RSMo § 610.010)", timeLimit: "3 business days" },
  MT: { name: "Montana", statute: "Right to Know (MCA § 2-6-1001)", timeLimit: "Reasonable time" },
  NE: { name: "Nebraska", statute: "Public Records Statutes (Neb. Rev. Stat. § 84-712)", timeLimit: "4 business days max", updates: "LB 43 (effective Jul 19, 2024)" },
  NV: { name: "Nevada", statute: "NPRA (NRS § 239)", timeLimit: "5 business days" },
  NH: { name: "New Hampshire", statute: "Right-to-Know (RSA § 91-A)", timeLimit: "5 business days" },
  NJ: { name: "New Jersey", statute: "OPRA (N.J.S.A. § 47:1A-1)", timeLimit: "7 business days" },
  NM: { name: "New Mexico", statute: "IPRA (NMSA § 14-2-1)", timeLimit: "3 business days" },
  NY: { name: "New York", statute: "FOIL (Public Officers Law § 84)", timeLimit: "5 business days" },
  NC: { name: "North Carolina", statute: "Public Records Law (N.C.G.S. § 132-1)", timeLimit: "Promptly" },
  ND: { name: "North Dakota", statute: "Open Records (NDCC § 44-04-18)", timeLimit: "3 business days" },
  OH: { name: "Ohio", statute: "Public Records (R.C. § 149.43)", timeLimit: "Promptly" },
  OK: { name: "Oklahoma", statute: "Open Records (51 O.S. § 24A.1)", timeLimit: "Promptly (≈5 business days)" },
  OR: { name: "Oregon", statute: "Public Records (ORS § 192.410)", timeLimit: "Reasonable time" },
  PA: { name: "Pennsylvania", statute: "Right-to-Know (65 P.S. § 67.101)", timeLimit: "5 business days" },
  RI: { name: "Rhode Island", statute: "APRA (R.I.G.L. § 38-2-1)", timeLimit: "10 business days" },
  SC: { name: "South Carolina", statute: "FOIA (S.C. Code § 30-4-10)", timeLimit: "15 business days" },
  SD: { name: "South Dakota", statute: "Public Records (SDCL § 1-27-1)", timeLimit: "Reasonable time" },
  TN: { name: "Tennessee", statute: "TPRA (T.C.A. § 10-7-503)", timeLimit: "7 business days" },
  TX: { name: "Texas", statute: "Public Information Act (Gov. Code ch. 552)", timeLimit: "10 business days" },
  UT: { name: "Utah", statute: "GRAMA (Utah Code § 63G-2-101)", timeLimit: "5–10 business days", updates: "2025 change: ALJ replacing State Records Committee" },
  VT: { name: "Vermont", statute: "Public Records Act (1 V.S.A. § 315)", timeLimit: "3 business days" },
  VA: { name: "Virginia", statute: "VFOIA (Va. Code § 2.2-3700)", timeLimit: "5 business days" },
  WA: { name: "Washington", statute: "PRA (RCW § 42.56)", timeLimit: "5 business days" },
  WV: { name: "West Virginia", statute: "FOIA (W. Va. Code § 29B-1-1)", timeLimit: "5 business days" },
  WI: { name: "Wisconsin", statute: "Open Records (Wis. Stat. § 19.31)", timeLimit: "As soon as practicable" },
  WY: { name: "Wyoming", statute: "Public Records (Wyo. Stat. § 16-4-201)", timeLimit: "3 business days" },
  DC: { name: "District of Columbia", statute: "DC FOIA (DC Code § 2-531)", timeLimit: "15 business days" },
};

// Recording consent (statewide general rule label)
const recordingConsent = {
  // two-party states
  CA: "Two-party consent (in-person/phone)", CT: "Two-party consent", DE: "Two-party consent",
  FL: "Two-party consent", IL: "Two-party consent (context-specific)", MD: "Two-party consent",
  MA: "Two-party consent", MT: "Two-party consent", NH: "Two-party consent", PA: "Two-party consent",
  WA: "Two-party consent",
};

// Stop-and-identify quick matrix
const stateIDRights = {
  AL: { stopAndID: true, law: "Ala. Code § 15-5-30", requires: "Provide name/address on RS stop" },
  AK: { stopAndID: false, law: "No general stop-and-identify statute" },
  AZ: { stopAndID: true, law: "A.R.S. § 13-2412", requires: "Provide true full name on lawful detention" },
  AR: { stopAndID: true, law: "A.C.A. § 5-71-213", requires: "Name on lawful stop" },
  CA: { stopAndID: false, law: "No general stop-and-identify statute" },
  CO: { stopAndID: true, law: "C.R.S. § 16-3-103", requires: "Name/address; show ID if available" },
  CT: { stopAndID: false, law: "No general stop-and-identify statute" },
  DE: { stopAndID: true, law: "11 Del. C. § 1902", requires: "Identify self on RS stop" },
  FL: { stopAndID: true, law: "F.S. § 856.021", requires: "Name on lawful detention" },
  GA: { stopAndID: true, law: "O.C.G.A. § 16-11-36", requires: "Name/address on lawful detention" },
  HI: { stopAndID: true, law: "HRS 291C-172", requires: "Traffic context; ID on citation" },
  ID: { stopAndID: false, law: "No general stop-and-identify statute" },
  IL: { stopAndID: true, law: "725 ILCS 5/107-14", requires: "Identify self on stop" },
  IN: { stopAndID: true, law: "IC § 34-28-5-3.5", requires: "Name on RS stop" },
  IA: { stopAndID: false, law: "No general stop-and-identify statute" },
  KS: { stopAndID: true, law: "K.S.A. § 22-2402", requires: "Name on RS stop" },
  KY: { stopAndID: false, law: "No general stop-and-identify statute" },
  LA: { stopAndID: true, law: "La. R.S. § 14:108", requires: "Identify self on RS stop" },
  ME: { stopAndID: false, law: "No general stop-and-identify statute" },
  MD: { stopAndID: false, law: "No general stop-and-identify statute" },
  MA: { stopAndID: false, law: "No general stop-and-identify statute" },
  MI: { stopAndID: false, law: "No general stop-and-identify statute" },
  MN: { stopAndID: false, law: "No general stop-and-identify statute" },
  MS: { stopAndID: false, law: "No general stop-and-identify statute" },
  MO: { stopAndID: true, law: "R.S.Mo. § 84.710 (KC/STL)", requires: "Name on local stops" },
  MT: { stopAndID: true, law: "MCA § 46-5-401", requires: "Name on RS stop" },
  NE: { stopAndID: true, law: "Neb. Rev. Stat. § 29-829", requires: "Name on RS stop" },
  NV: { stopAndID: true, law: "NRS § 171.123", requires: "Name only on lawful detention" },
  NH: { stopAndID: true, law: "RSA § 594:2", requires: "Name/address/destination on RS stop" },
  NJ: { stopAndID: false, law: "No general stop-and-identify statute" },
  NM: { stopAndID: true, law: "NMSA § 30-22-3", requires: "Name on RS stop" },
  NY: { stopAndID: true, law: "CPL § 140.50", requires: "Name/address and explanation on stop" },
  NC: { stopAndID: false, law: "No general stop-and-identify statute" },
  ND: { stopAndID: true, law: "NDCC § 29-29-21", requires: "Name on RS stop" },
  OH: { stopAndID: true, law: "R.C. § 2921.29", requires: "Name/address/DOB on detention" },
  OK: { stopAndID: false, law: "No general stop-and-identify statute" },
  OR: { stopAndID: false, law: "No general stop-and-identify statute" },
  PA: { stopAndID: false, law: "No general stop-and-identify statute" },
  RI: { stopAndID: true, law: "R.I.G.L. § 12-7-1", requires: "Name/address/destination" },
  SC: { stopAndID: false, law: "No general stop-and-identify statute" },
  SD: { stopAndID: false, law: "No general stop-and-identify statute" },
  TN: { stopAndID: false, law: "No general stop-and-identify statute" },
  TX: { stopAndID: true, law: "Tex. Penal Code § 38.02", requires: "Name/address if arrested; identify on detention context" },
  UT: { stopAndID: true, law: "Utah Code § 77-7-15", requires: "Full name/address/DOB on valid stop" },
  VT: { stopAndID: true, law: "24 V.S.A. § 1983", requires: "Local ordinance context" },
  VA: { stopAndID: false, law: "No general stop-and-identify statute" },
  WA: { stopAndID: false, law: "No general stop-and-identify statute" },
  WV: { stopAndID: false, law: "No general stop-and-identify statute" },
  WI: { stopAndID: true, law: "Wis. Stat. § 968.24", requires: "Identify self on stop (no penalty for refusal)" },
  WY: { stopAndID: false, law: "No general stop-and-identify statute" },
  DC: { stopAndID: false, law: "No general stop-and-identify statute" },
};

// Cannabis laws (summary). Each includes: status, possession, cultivation, details.
// If cultivation is unknown, we mark "Varies / see details" to avoid implying permission.
const cannabisLaws = {
  // Recreational + Medical
  AK: { status: "Recreational & Medical", possession: "1 oz; 6 plants total (3 mature)", cultivation: "Up to 6 plants (3 mature)", details: "Ballot Measure 2 (2014)" },
  AZ: { status: "Recreational & Medical", possession: "1 oz; 5g concentrates", cultivation: "6 plants per adult", details: "Prop 207 (2020)" },
  CA: { status: "Recreational & Medical", possession: "1 oz; 8g concentrates", cultivation: "6 plants per residence", details: "Prop 64 (2016)" },
  CO: { status: "Recreational & Medical", possession: "1 oz", cultivation: "6 plants (3 mature)", details: "Amendment 64 (2012)" },
  CT: { status: "Recreational & Medical", possession: "1.5 oz; 6 plants (homegrow)", cultivation: "6 plants (3 mature)", details: "SB 1201 (2021)" },
  DE: { status: "Recreational & Medical", possession: "1 oz (no retail early)", cultivation: "Homegrow not allowed", details: "HB 1 & 2 (2023)" },
  IL: { status: "Recreational & Medical", possession: "1 oz (residents)", cultivation: "Recreational homegrow not allowed (medical only)", details: "CRTA (2019)" },
  ME: { status: "Recreational & Medical", possession: "2.5 oz", cultivation: "6 mature plants", details: "Question 1 (2016)" },
  MD: { status: "Recreational & Medical", possession: "1.5 oz", cultivation: "2 plants per household", details: "Question 4 (2022)" },
  MA: { status: "Recreational & Medical", possession: "1 oz (10 oz at home)", cultivation: "6 plants (12 per household)", details: "Question 4 (2016)" },
  MI: { status: "Recreational & Medical", possession: "2.5 oz", cultivation: "Up to 12 plants", details: "Proposal 1 (2018)" },
  MN: { status: "Recreational & Medical", possession: "2 oz (public)", cultivation: "Up to 8 plants (4 mature)", details: "HF100 (2023)" },
  MO: { status: "Recreational & Medical", possession: "3 oz", cultivation: "6 plants with registration", details: "Amendment 3 (2022)" },
  MT: { status: "Recreational & Medical", possession: "1 oz", cultivation: "4 plants / 4 seedlings", details: "CI 118 (2020)" },
  NV: { status: "Recreational & Medical", possession: "1 oz; 3.5g concentrates", cultivation: "6 plants if 25+ miles from dispensary", details: "Question 2 (2016)" },
  NJ: { status: "Recreational & Medical", possession: "1 oz", cultivation: "Homegrow not allowed", details: "Public Question 1 (2020)" },
  NM: { status: "Recreational & Medical", possession: "2 oz; 16g extract", cultivation: "6 mature (12 per household)", details: "CRA (2021)" },
  NY: { status: "Recreational & Medical", possession: "3 oz", cultivation: "Up to 6 plants (when regs permit)", details: "MRTA (2021)" },
  OH: { status: "Recreational & Medical", possession: "2.5 oz; 15g extracts", cultivation: "6 plants per adult; 12 per household", details: "Issue 2 (2023)" },
  OR: { status: "Recreational & Medical", possession: "1 oz public; 8 oz home", cultivation: "4 plants", details: "Measure 91 (2014)" },
  RI: { status: "Recreational & Medical", possession: "1 oz (10 oz at home)", cultivation: "3 mature / 3 immature", details: "RICCA (2022)" },
  VT: { status: "Recreational & Medical", possession: "1 oz", cultivation: "2 mature / 4 immature", details: "H.511 (2018)" },
  VA: { status: "Recreational & Medical", possession: "1 oz", cultivation: "4 plants per household", details: "2021 law; retail delayed" },
  WA: { status: "Recreational & Medical", possession: "1 oz (no homegrow)", cultivation: "Homegrow not allowed (rec)", details: "I-502 (2012)" },
  DC: { status: "Recreational & Medical", possession: "2 oz", cultivation: "6 plants (3 mature)", details: "Initiative 71 (2014)" },

  // Medical-only or limited
  AL: { status: "Medical Only", possession: "Qualified patients per program", cultivation: "Homegrow not allowed", details: "Compassion Act (2021)" },
  AR: { status: "Medical Only", possession: "2.5 oz / 14 days (patients)", cultivation: "Homegrow not allowed", details: "AMMA (2016)" },
  FL: { status: "Medical Only", possession: "State-regulated (e.g., 2.5 oz smokable / 35 days)", cultivation: "Homegrow not allowed", details: "Amendment 2 (2016)" },
  GA: { status: "Medical (Low-THC)", possession: "Low-THC oil ≤5% (patients)", cultivation: "Homegrow not allowed", details: "Haleigh's Hope (2015)" },
  HI: { status: "Medical Only", possession: "4 oz (patients)", cultivation: "Up to 10 plants (patients)", details: "2000 law; dispensaries 2017" },
  LA: { status: "Medical Only", possession: "Non-smokable forms; program limits", cultivation: "Homegrow not allowed", details: "2015 law; limited producers" },
  MS: { status: "Medical Only", possession: "Program limits (e.g., daily 3.5g / monthly cap)", cultivation: "Homegrow not allowed", details: "Mississippi Medical Cannabis Act (2022)" },
  NH: { status: "Medical Only", possession: "2 oz / month (patients)", cultivation: "Homegrow generally restricted", details: "2013 program" },
  ND: { status: "Medical Only", possession: "3 oz (patients)", cultivation: "Limited / program rules", details: "Measure 5 (2016)" },
  OK: { status: "Medical Only", possession: "3 oz flower; program limits", cultivation: "6 mature / 6 seedlings (patients)", details: "SQ 788 (2018)" },
  PA: { status: "Medical Only", possession: "Program limits (non-smokable historically)", cultivation: "Homegrow not allowed", details: "2016 law" },
  SD: { status: "Medical Only", possession: "3 oz (patients)", cultivation: "State rules; limited", details: "Measure 26 (2020)" },
  UT: { status: "Medical Only", possession: "Program limits", cultivation: "Homegrow not allowed", details: "Prop 2 (2018)" },
  WV: { status: "Medical Only", possession: "Program limits", cultivation: "Homegrow not allowed", details: "2017 law" },

  // CBD / Decrim
  IN: { status: "CBD Only", possession: "CBD <0.3% THC", cultivation: "Not applicable", details: "2018 hemp law" },
  IA: { status: "CBD (patients)", possession: "CBD <3% THC (patients)", cultivation: "Not applicable", details: "Medical Cannabidiol Act" },
  KY: { status: "Medical starting 2025", possession: "Program-defined", cultivation: "Homegrow not allowed", details: "SB 47 (2023)" },
  NC: { status: "Decriminalized", possession: "≤0.5 oz civil", cultivation: "Illegal", details: "Local discretion varies" },
  TN: { status: "CBD (patients)", possession: "CBD oil for patients", cultivation: "Not applicable", details: "2015 law" },
  TX: { status: "CBD (low-THC)", possession: "Low-THC CBD (patients)", cultivation: "Not applicable", details: "Compassionate Use (2015)" },
  WI: { status: "CBD Only", possession: "CBD <0.3% THC", cultivation: "Not applicable", details: "2017 program" },

  // Fully illegal
  ID: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", details: "No medical/recreational/CBD" },
  KS: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", details: "No program" },
  SC: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", details: "No program" },
  WY: { status: "Fully Illegal", possession: "Illegal", cultivation: "Illegal", details: "No program" },
};

// Notice requirements (subset retained for generator auto-fill)
const stateNoticeRequirements = {
  CA: {
    govTortClaim: { timeLimit: "6 months", statute: "Gov. Code § 911.2", requirements: "Submit government claim within 6 months" },
    medMalpractice: { timeLimit: "90 days", statute: "CCP § 364", requirements: "Pre-suit notice" },
    ceaseDesist: { requirements: "Check specific statutory scheme for claim type" },
  },
  LA: {
    govTortClaim: {
      timeLimit: "2 years",
      statute: "La. R.S. § 13:5106 (extended by HB 315/Act 423)",
      requirements: "Notice within 2 years",
      updates: "Act 423 (July 2024) extended personal injury from 1y to 2y",
    },
    medMalpractice: { timeLimit: "Review panel required", statute: "La. R.S. § 40:1231.8", requirements: "Medical review panel" },
    ceaseDesist: { requirements: "LUTPA may apply" },
  },
  MA: {
    govTortClaim: { timeLimit: "2 years", statute: "M.G.L. c. 258 § 4", requirements: "Presentment within 2 years" },
    medMalpractice: { timeLimit: "182 days", statute: "M.G.L. c. 231 § 60B", requirements: "Tribunal process" },
    ceaseDesist: { requirements: "Ch. 93A – 30-day demand before suit", mandatoryNotice: "30 days" },
  },
  MS: {
    govTortClaim: { timeLimit: "1 year", statute: "Miss. Code § 11-46-11", requirements: "Written notice within 1 year" },
    medMalpractice: { timeLimit: "60 days", statute: "Miss. Code § 15-1-36", requirements: "Pre-suit notice with expert" },
    ceaseDesist: { requirements: "No specific statute; use consumer protection where applicable" },
  },
  NE: {
    govTortClaim: { timeLimit: "1 year", statute: "Neb. Rev. Stat. § 13-919", requirements: "Notice within 1 year" },
    medMalpractice: { timeLimit: "None", statute: "No pre-suit notice required", requirements: "Expert affidavit at suit" },
    ceaseDesist: { requirements: "Nebraska Consumer Protection Act may apply" },
  },
};

// ===================== HELPERS =====================
function addBusinessDays(from, days) {
  const d = new Date(from);
  let count = 0;
  while (count < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) count++;
  }
  return d;
}

function calculateResponseDate(timeLimit) {
  if (!timeLimit) return "";
  const today = new Date();
  const biz = timeLimit.match(/(\d+)\s*business/i);
  const cal = timeLimit.match(/(\d+)\s*calendar/i) || timeLimit.match(/(\d+)\s*days?/i);
  const months = timeLimit.match(/(\d+)\s*months?/i);
  const years = timeLimit.match(/(\d+)\s*years?/i);
  if (biz) return addBusinessDays(today, parseInt(biz[1], 10)).toLocaleDateString();
  if (cal) {
    const d = new Date(today);
    d.setDate(d.getDate() + parseInt(cal[1], 10));
    return d.toLocaleDateString();
  }
  if (months) {
    const d = new Date(today);
    d.setMonth(d.getMonth() + parseInt(months[1], 10));
    return d.toLocaleDateString();
  }
  if (years) {
    const d = new Date(today);
    d.setFullYear(d.getFullYear() + parseInt(years[1], 10));
    return d.toLocaleDateString();
  }
  return "Check statute for deadline";
}

// Pot Brothers at Law – 4 concise steps (paraphrased)
const FOUR_STEPS = [
  "Keep it brief. Do not volunteer details.",
  "Ask: ‘Am I being detained, or am I free to go?’",
  "Invoke the 5th: ‘I choose to remain silent.’",
  "Request counsel: ‘I want my lawyer.’",
];

// ===================== COMPONENT =====================
export default function LegalToolkit() {
  // Core state
  const [documentType, setDocumentType] = useState("FOIA Request");
  const [selectedState, setSelectedState] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [agency, setAgency] = useState("");
  const [recipient, setRecipient] = useState("");
  const [incident, setIncident] = useState("");
  const [damages, setDamages] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [statute, setStatute] = useState("");

  // Litigation-specific
  const [plaintiffName, setPlaintiffName] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [courtName, setCourtName] = useState("");
  const [discoveryType, setDiscoveryType] = useState("interrogatories");
  const [claimType, setClaimType] = useState("general");

  // UX
  const [quickMode, setQuickMode] = useState(true);

  // Auto-populate on selection
  useEffect(() => {
    if (!selectedState) {
      setJurisdiction("");
      setTimeLimit("");
      setStatute("");
      return;
    }
    const stateData = statePublicRecordsData[selectedState];
    if (!stateData) return;

    setJurisdiction(stateData.name);

    if (documentType === "FOIA Request" || documentType === "State Public Records Request") {
      setTimeLimit(stateData.timeLimit);
      setStatute(stateData.statute);
    } else if (documentType === "ID Rights Card") {
      const rights = stateIDRights[selectedState];
      if (rights) {
        setStatute(rights.law);
        setTimeLimit(rights.stopAndID ? "Stop-and-Identify state" : "No general stop-and-identify");
      } else {
        setStatute("");
        setTimeLimit("");
      }
    } else if (documentType === "Notice of Claim" && stateNoticeRequirements[selectedState]) {
      const req = stateNoticeRequirements[selectedState].govTortClaim;
      if (req) {
        setTimeLimit(req.timeLimit);
        setStatute(req.statute);
      }
    } else if (documentType === "Pre-Suit Notice" && stateNoticeRequirements[selectedState]) {
      const req = stateNoticeRequirements[selectedState].medMalpractice;
      if (req) {
        setTimeLimit(req.timeLimit);
        setStatute(req.statute);
      }
    } else {
      setTimeLimit("");
      setStatute("");
    }
  }, [selectedState, documentType]);

  const foiaDeadline = useMemo(() => calculateResponseDate(timeLimit), [timeLimit]);

  // ============== GENERATORS (trimmed for brevity but complete outputs) ==============
  const generateFOIARequest = () => {
    const today = new Date().toLocaleDateString();
    const stateData = selectedState ? statePublicRecordsData[selectedState] : null;
    const updates = stateData?.updates ? `\n\nLEGISLATIVE UPDATE: ${stateData.updates}` : "";
    return `[Your Name]
[Your Address]
[City, State ZIP]
[Email] | [Phone]

${today}

${agency || "[Agency Name]"}
FOIA/Records Officer
[Agency Address]
[City, State ZIP]

Re: Public Records Request (Expedited)

Pursuant to 5 U.S.C. § 552 and any applicable state law${selectedState ? ` (including ${stateData.statute})` : ""}, I request the following records:

SUBJECT: ${incident || "[Describe records with specific dates, people, terms]"}
JURISDICTION: ${jurisdiction || "[Jurisdiction]"}
${selectedState ? `STATE STATUTE & TIMELINE: ${stateData.statute}; response ${stateData.timeLimit}.` : ""}${updates}

FORMAT: Electronic (searchable PDF/native w/ metadata).
FEE WAIVER: Public interest; please advise if costs exceed $50.
SEGREGABILITY: Provide Vaughn index for any redactions; release non-exempt portions.
PRESERVATION: Suspend destruction of responsive materials.

Please acknowledge receipt and provide an estimated completion date.

Sincerely,
[Your Name]
`;
  };

  const generateCeaseDesist = () => {
    const today = new Date().toLocaleDateString();
    const recRule = recordingConsent[selectedState] || "One-party consent (check local exceptions)";
    return `[Your Name]\n[Address]\n[City, State ZIP]\n[Email] | [Phone]\n\n${today}\n\n${recipient || "[Recipient]"}\n[Address]\n\nRE: FORMAL CEASE AND DESIST – ${jurisdiction || "[Jurisdiction]"}\n\nYou are hereby demanded to cease and desist from the conduct described below.\n\nVIOLATIONS:\n${incident || "[Describe dates, acts, links, witnesses]"}\n\nLEGAL BASIS:\n• Applicable federal/state laws; consumer protection and civil remedies\n• Recording rules in your state: ${recRule}\n\nDEMAND:\n• Immediate cessation; preserve evidence; confirm in 10 business days.\n• Remove/rectify offending content or actions.\n\nFailure to comply may result in injunctions, damages, and fees.\n\nSincerely,\n[Your Name]\n`;
    Generated: ${today}
  };

  const generateNoticeOfClaim = () => {
    const today = new Date().toLocaleDateString();
    const stateData = stateNoticeRequirements[selectedState]?.govTortClaim;
    const tl = stateData?.timeLimit ? `Under ${stateData.statute}, deadline: ${stateData.timeLimit}.` : "";
    return `[Your Name]\n[Address]\n[City, State ZIP]\n[Email] | [Phone]\n\n${today}\n\n${agency || recipient || "[Entity/Agency]"}\nClaims/Risk Management\n[Address]\n\nRE: NOTICE OF CLAIM – ${jurisdiction || "[Jurisdiction]"}\n\nIncident: ${incident || "[Date, time, location, facts]"}\nDamages: ${damages || "[Medical, wage loss, property, non-economic]"}\n\nThis notice preserves all rights and seeks resolution pre-litigation. ${tl}\nPlease acknowledge and provide claims handling contact within 30 days.\n\nSincerely,\n[Your Name]\n`;
    Generated: ${today}
  };

  const generatePreSuit = () => {
    const today = new Date().toLocaleDateString();
    const med = stateNoticeRequirements[selectedState]?.medMalpractice;
    return `PRE-SUIT NOTICE – ${claimType.toUpperCase()}\nJurisdiction: ${jurisdiction || "[Jurisdiction]"}\nStatute: ${med?.statute || "[Applicable law]"}\n\nAllegations: ${incident || "[Chronology of negligent acts; standard-of-care breaches]"}\nDamages: ${damages || "[Itemize]"}\n\nNotice period: ${med?.timeLimit || "[State-specific or none]"}.\nPlease forward to liability carrier and confirm adjuster details.\n`;
    Generated: ${today}
  };

  const generateDiscovery = () => {
    const today = new Date().toLocaleDateString();
    const title = discoveryType === "interrogatories" ? "INTERROGATORIES" : discoveryType === "requests_for_production" ? "REQUESTS FOR PRODUCTION" : "REQUESTS FOR ADMISSION";
    return `${courtName || "[COURT]"}\n${jurisdiction || "[JURISDICTION]"}\n\n${plaintiffName || "[PLAINTIFF]"} v. ${defendantName || "[DEFENDANT]"}\nCase No.: ${caseNumber || "[NUMBER]"}\n\nPLAINTIFF'S ${title} (SET ONE)\n\nDefinitions, instructions, and ${title.toLowerCase()} tailored to: ${incident || "[Subject matter]"}.\nResponses due in 30 days unless modified by rule or order.\nDate: ${today}\n`;
    Generated: ${today}
  };

  const generateSubpoena = () => {
    const today = new Date().toLocaleDateString();
    return `${courtName || "[COURT]"}\n${jurisdiction || "[JURISDICTION]"}\n\nSUBPOENA DUCES TECUM\nTO: ${recipient || "[Witness/Records Custodian]"}\n\nAppear/produce on: [Date/Time/Place].\nDocuments requested: ${incident || "[Specific categories with dates and formats incl. metadata]"}.\nPrivilege log required for any withholdings.\nDate: ${today}`;
    Generated: ${today}
  };

  const generateLetter = () => {
    switch (documentType) {
      case "FOIA Request":
      case "State Public Records Request":
        return generateFOIARequest();
      case "Cease and Desist Letter":
        return generateCeaseDesist();
      case "Notice of Claim":
        return generateNoticeOfClaim();
      case "Pre-Suit Notice":
        return generatePreSuit();
      case "Discovery Request":
        return generateDiscovery();
      case "Subpoena Duces Tecum":
        return generateSubpoena();
      case "ID Rights Card":
        return "[Select a state to render the card below]";
      default:
        return "";
      Generated: ${today}
    }
  };

  // ID Card JSX (visual) – uses selected state
  const IdCard = () => {
    if (!selectedState) return null;
    const stateName = statePublicRecordsData[selectedState]?.name || "[STATE]";
    const rights = stateIDRights[selectedState];
    const foia = statePublicRecordsData[selectedState];
    const weed = cannabisLaws[selectedState];
    const recRule = recordingConsent[selectedState] || "One-party consent (check local exceptions)";

    const stopHowTo = rights?.stopAndID
      ? [
          "Stay calm; keep hands visible.",
          "Ask: ‘Am I being detained, or am I free to go?’",
          "If detained: give required ID info only (per statute).",
          "Do not consent to searches; say so clearly.",
          "You may record consistent with consent rules.",
          "Invoke your rights: remain silent and request a lawyer.",
        ]
      : [
          "Ask: ‘Am I being detained, or am I free to go?’",
          "If free, leave calmly. If detained: you generally are not required to identify unless driving/under arrest.",
          "Do not consent to searches; state your refusal.",
          "You may record consistent with consent rules.",
          "Remain silent and request a lawyer if questioned.",
        ];

    return (
      <div className="w-full flex justify-center">
        <div className="w-[860px] rounded-2xl border shadow-xl bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-6">
            <h2 className="text-2xl font-bold tracking-wide text-center">{stateName.toUpperCase()} – CIVIL RIGHTS & LAWS REFERENCE CARD</h2>
            <p className="text-center text-sm opacity-90 mt-1">Professional quick-reference • Updated 2025</p>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <section className="rounded-xl border p-4">
                <h3 className="font-semibold text-slate-800 mb-2">Key Rights</h3>
                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                  <li>I do not consent to searches.</li>
                  <li>I choose to remain silent.</li>
                  <li>I do not waive any rights.</li>
                  <li>I want a lawyer if detained or arrested.</li>
                </ul>
              </section>

              <section className="rounded-xl border p-4">
                <h3 className="font-semibold text-slate-800 mb-2">State Statutes & Recording</h3>
                <div className="text-sm text-slate-700 space-y-1">
                  <p><span className="font-medium">ID / Stop-&-Identify:</span> {rights?.law || "[Check local law]"}</p>
                  <p><span className="font-medium">Recording Rule:</span> {recRule}</p>
                  <p><span className="font-medium">Public Records:</span> {foia?.statute}</p>
                  <p><span className="font-medium">FOIA Timeline:</span> {foia?.timeLimit}</p>
                </div>
              </section>

              <section className="rounded-xl border p-4">
                <h3 className="font-semibold text-slate-800 mb-2">Cannabis – Possession & Cultivation</h3>
                {weed ? (
                  <div className="text-sm text-slate-700 space-y-1">
                    <p><span className="font-medium">Status:</span> {weed.status}</p>
                    <p><span className="font-medium">Possession:</span> {weed.possession || "See details"}</p>
                    <p><span className="font-medium">Cultivation:</span> {weed.cultivation || "Varies / see details"}</p>
                    {weed.details && <p className="text-slate-500 text-xs">{weed.details}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-slate-700">No cannabis entry found for this state.</p>
                )}
              </section>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <section className="rounded-xl border p-4">
                <h3 className="font-semibold text-slate-800 mb-2">Police Contact – What to Do</h3>
                <ol className="text-sm text-slate-700 list-decimal pl-5 space-y-1">
                  {stopHowTo.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
                {rights?.stopAndID && rights.requires && (
                  <p className="mt-2 text-xs text-slate-500">Stop-&-ID requirement in this state: {rights.requires}</p>
                )}
              </section>

              <section className="rounded-xl border p-4">
                <h3 className="font-semibold text-slate-800 mb-1">Pot Brothers at Law – 4 Simple Steps</h3>
                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
                  {FOUR_STEPS.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <p className="text-[10px] text-slate-500 mt-2">Provided for educational quick-reference.</p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="rounded-xl bg-slate-50 border p-4 text-xs text-slate-500">
              Generated {new Date().toLocaleDateString()} • Civil Rights Legal Toolkit Pro 2025 • Verify rules locally before relying.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============== RENDER ==============
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 font-sans">
      <div className="max-w-7xl mx-auto p-6">
        {/* Heading */}
        <div className="rounded-3xl bg-white/90 backdrop-blur border shadow-xl p-8 mb-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-900 drop-shadow-sm">
              Civil Rights Legal Toolkit Pro 2025
            </h1>
            <p className="text-slate-600 mt-2">
              Attorney-level document generator • Legislative snapshots 2024–2025 • Clean, fast UI
            </p>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">📄 Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>FOIA Request</option>
                <option>State Public Records Request</option>
                <option>ID Rights Card</option>
                <option>Cease and Desist Letter</option>
                <option>Notice of Claim</option>
                <option>Pre-Suit Notice</option>
                <option>Subpoena Duces Tecum</option>
                <option>Discovery Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">🏛️ State/Jurisdiction</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a state…</option>
                {Object.entries(statePublicRecordsData).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  id="quickMode"
                  type="checkbox"
                  checked={quickMode}
                  onChange={(e) => setQuickMode(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="quickMode" className="text-sm font-semibold text-slate-700">⚡ Quick Mode</label>
              </div>
              {documentType !== "ID Rights Card" && (
                <button
                  onClick={() => setGeneratedLetter(generateLetter())}
                  className="ml-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 shadow"
                >
                  🚀 Generate
                </button>
              )}
            </div>
          </div>

          {/* Simple / Advanced Inputs */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {/* Recipient/Agency */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {documentType === "FOIA Request" || documentType === "State Public Records Request"
                  ? "🏢 Agency/Records Custodian"
                  : documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request"
                  ? "👤 Witness/Respondent Name"
                  : "👤 Recipient/Target"}
              </label>
              <input
                value={documentType === "FOIA Request" || documentType === "State Public Records Request" ? agency : recipient}
                onChange={(e) =>
                  documentType === "FOIA Request" || documentType === "State Public Records Request"
                    ? setAgency(e.target.value)
                    : setRecipient(e.target.value)
                }
                placeholder={quickMode ? "Short name is fine" : "Full legal/official name"}
                className="w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">📍 Jurisdiction</label>
              <input
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="Auto-fills from state"
                className={`w-full rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 ${selectedState ? "bg-emerald-50 border-emerald-400 focus:ring-emerald-500" : "focus:ring-indigo-500"}`}
              />
            </div>
          </div>

          {/* Conditional: Damages */}
          {(documentType === "Notice of Claim" || documentType === "Pre-Suit Notice" || documentType === "Cease and Desist Letter") && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">💰 Damages / Settlement Demand</label>
              <textarea
                value={damages}
                onChange={(e) => setDamages(e.target.value)}
                placeholder={quickMode ? "e.g., $75k med + $20k wages" : "Detail medical, wages, pain/suffering, punitive, method of calculation"}
                className="w-full min-h-[110px] rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          {/* Main narrative / subject */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              📝 {documentType === "FOIA Request" || documentType === "State Public Records Request"
                ? "Records Requested (be specific)"
                : documentType === "ID Rights Card"
                ? "Additional Notes (optional)"
                : documentType === "Cease and Desist Letter"
                ? "Violation Description"
                : documentType === "Notice of Claim"
                ? "Incident Description"
                : documentType === "Pre-Suit Notice"
                ? "Malpractice/Negligence Description"
                : documentType === "Subpoena Duces Tecum"
                ? "Docs/Materials to be Produced"
                : documentType === "Discovery Request"
                ? "Case Facts & Discovery Scope"
                : "Subject"}
            </label>
            <textarea
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              placeholder={quickMode
                ? "Short bullets or keywords are fine"
                : "Add exact dates, people, terms, categories, formats, and time range"}
              className="w-full min-h-[160px] rounded-xl border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Litigation extras */}
          {(documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request") && (
            <div className="mt-6 rounded-2xl border bg-amber-50 p-4">
              <h3 className="text-amber-900 font-semibold mb-3">⚖️ Litigation Fields</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <input className="rounded-xl border px-3 py-2" placeholder="Plaintiff" value={plaintiffName} onChange={(e) => setPlaintiffName(e.target.value)} />
                <input className="rounded-xl border px-3 py-2" placeholder="Defendant" value={defendantName} onChange={(e) => setDefendantName(e.target.value)} />
                <input className="rounded-xl border px-3 py-2" placeholder="Case No." value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} />
                <input className="rounded-xl border px-3 py-2" placeholder="Court Name" value={courtName} onChange={(e) => setCourtName(e.target.value)} />
              </div>
              {documentType === "Discovery Request" && (
                <div className="mt-3">
                  <select className="rounded-xl border px-3 py-2" value={discoveryType} onChange={(e) => setDiscoveryType(e.target.value)}>
                    <option value="interrogatories">Interrogatories</option>
                    <option value="requests_for_production">Requests for Production</option>
                    <option value="requests_for_admission">Requests for Admission</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Claim / Violation pickers */}
          {(documentType === "Notice of Claim" || documentType === "Pre-Suit Notice") && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">🎯 Claim Type</label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              >
                {documentType === "Notice of Claim" && (
                  <>
                    <option value="government">Government/Municipal Tort</option>
                    <option value="general">General Civil Liability</option>
                  </>
                )}
                {documentType === "Pre-Suit Notice" && (
                  <>
                    <option value="medical">Medical Malpractice</option>
                    <option value="legal">Legal Malpractice</option>
                    <option value="professional">Other Professional Liability</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>

        {/* Cannabis quick panel */}
        {selectedState && cannabisLaws[selectedState] && (
          <div className="rounded-3xl border shadow bg-white p-6 mb-6">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">🌿 {statePublicRecordsData[selectedState].name} – Cannabis Summary</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div><span className="font-medium">Status:</span> {cannabisLaws[selectedState].status}</div>
              <div><span className="font-medium">Possession:</span> {cannabisLaws[selectedState].possession || "See details"}</div>
              <div><span className="font-medium">Cultivation:</span> {cannabisLaws[selectedState].cultivation || "Varies / see details"}</div>
            </div>
            {cannabisLaws[selectedState].details && (
              <p className="text-xs text-slate-500 mt-2">{cannabisLaws[selectedState].details}</p>
            )}
            {cannabisLaws[selectedState].status?.includes("Illegal") && (
              <div className="mt-3 text-sm rounded-lg border border-rose-300 bg-rose-50 text-rose-700 p-3">
                ⚠️ Possession remains illegal. Know your rights during police encounters.
              </div>
            )}
          </div>
        )}

        {/* Auto statutes panel */}
        {selectedState && (
          <div className="rounded-3xl border shadow bg-white p-6 mb-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">📋 Auto‑Populated Legal Info – {statePublicRecordsData[selectedState].name}</h3>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border p-3">
                <div className="text-slate-600 text-xs">Applicable Statute</div>
                <div className="font-mono text-slate-900 text-sm break-words">{statute || "Select document type for statute"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-slate-600 text-xs">Time Requirement</div>
                <div className="text-slate-900 font-semibold">{timeLimit || "Select document type"}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-slate-600 text-xs">Deadline (calc.)</div>
                <div className="text-slate-900 font-semibold">{foiaDeadline || "—"}</div>
              </div>
            </div>
            {statePublicRecordsData[selectedState]?.updates && (
              <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm">
                🚨 Legislative Update: {statePublicRecordsData[selectedState].updates}
              </div>
            )}
          </div>
        )}

        {/* Generate button for ID card */}
        {documentType === "ID Rights Card" && (
          <div className="rounded-3xl border shadow bg-white p-6 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                onClick={() => setGeneratedLetter(generateLetter())}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 shadow"
              >
                Render Card Content
              </button>
              <button
                onClick={() => {
                  // Copy text snapshot
                  const foia = statePublicRecordsData[selectedState];
                  const rights = stateIDRights[selectedState];
                  const weed = cannabisLaws[selectedState];
                  const stateName = foia?.name || "[STATE]";
                  const recRule = recordingConsent[selectedState] || "One-party consent";
                  const text = `${stateName} – Civil Rights & Laws Reference Card\n\nRIGHTS:\n• No consent to searches\n• Remain silent\n• Do not waive rights\n• Ask for a lawyer\n\nSTATUTES:\nID / Stop-&-ID: ${rights?.law || "[N/A]"}\nRecording: ${recRule}\nPublic Records: ${foia?.statute} (Timeline: ${foia?.timeLimit})\n\nCANNABIS:\nStatus: ${weed?.status || "[N/A]"}\nPossession: ${weed?.possession || "[See details]"}\nCultivation: ${weed?.cultivation || "Varies / see details"}\n\nPOLICE CONTACT:\n- ${rights?.stopAndID ? "Provide required identifying info if lawfully detained." : "Ask if you are detained; ID not required unless driving or under arrest."}\n- Do not consent to searches.\n- You may record consistent with consent rules.\n- Remain silent and request a lawyer.\n\nPOT BROTHERS – 4 STEPS:\n1) Keep it brief.\n2) Am I being detained or free to go?\n3) I choose to remain silent.\n4) I want my lawyer.`;
                  navigator.clipboard.writeText(text);
                }}
                className="rounded-xl border px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                📋 Copy Card Text
              </button>
              <button
                onClick={() => {
                  // Canvas PNG export
                  const canvas = document.createElement("canvas");
                  canvas.width = 1200;
                  canvas.height = 800;
                  const ctx = canvas.getContext("2d");
                  // Background
                  const g = ctx.createLinearGradient(0, 0, 1200, 800);
                  g.addColorStop(0, "#1e3a8a");
                  g.addColorStop(1, "#1d4ed8");
                  ctx.fillStyle = g;
                  ctx.fillRect(0, 0, 1200, 800);
                  // Frame
                  ctx.strokeStyle = "#fff";
                  ctx.lineWidth = 6;
                  ctx.strokeRect(12, 12, 1176, 776);
                  ctx.fillStyle = "#fff";
                  ctx.textAlign = "center";
                  ctx.font = "bold 40px Arial";
                  const stateName = statePublicRecordsData[selectedState]?.name || "STATE";
                  ctx.fillText(`${stateName} – CIVIL RIGHTS & LAWS`, 600, 80);
                  ctx.font = "600 26px Arial";
                  ctx.fillText("Reference Card (2025)", 600, 118);
                  // Columns
                  ctx.textAlign = "left";
                  const L = 70, R = 640, Y0 = 170, LH = 34;
                  const rights = stateIDRights[selectedState];
                  const foia = statePublicRecordsData[selectedState];
                  const weed = cannabisLaws[selectedState];
                  const recRule = recordingConsent[selectedState] || "One-party consent";

                  // Left blocks
                  ctx.fillStyle = "#ffd700"; ctx.font = "bold 24px Arial"; ctx.fillText("KEY RIGHTS", L, Y0);
                  ctx.fillStyle = "#fff"; ctx.font = "18px Arial";
                  const leftLines = [
                    "• I do not consent to searches",
                    "• I choose to remain silent",
                    "• I do not waive any rights",
                    "• I want a lawyer if detained/arrested",
                  ];
                  leftLines.forEach((t, i) => ctx.fillText(t, L, Y0 + (i + 1) * LH));

                  let y = Y0 + (leftLines.length + 1.6) * LH;
                  ctx.fillStyle = "#ffd700"; ctx.font = "bold 24px Arial"; ctx.fillText("STATE STATUTES", L, y); y += LH;
                  ctx.fillStyle = "#fff"; ctx.font = "16px Arial";
                  ctx.fillText(`ID / Stop-&-ID: ${rights?.law || "[N/A]"}`, L, y); y += LH;
                  ctx.fillText(`Recording: ${recRule}`, L, y); y += LH;
                  ctx.fillText(`Public Records: ${foia?.statute || "[N/A]"}`, L, y); y += LH;
                  ctx.fillText(`FOIA Timeline: ${foia?.timeLimit || "[N/A]"}`, L, y); y += LH * 1.2;

                  ctx.fillStyle = "#ffd700"; ctx.font = "bold 24px Arial"; ctx.fillText("CANNABIS", L, y); y += LH;
                  ctx.fillStyle = "#90EE90"; ctx.font = "18px Arial";
                  ctx.fillText(`Status: ${weed?.status || "[N/A]"}`, L, y); y += LH;
                  ctx.fillText(`Possession: ${weed?.possession || "[See details]"}`, L, y); y += LH;
                  ctx.fillText(`Cultivation: ${weed?.cultivation || "Varies / see details"}`, L, y); y += LH;

                  // Right blocks – Stop guidance + 4 steps
                  ctx.fillStyle = "#ffd700"; ctx.font = "bold 24px Arial"; ctx.fillText("POLICE CONTACT – WHAT TO DO", R, Y0);
                  ctx.fillStyle = "#fff"; ctx.font = "16px Arial";
                  const guide = rights?.stopAndID
                    ? [
                        "• Stay calm; hands visible",
                        "• Ask if detained or free to go",
                        "• If detained: give required ID only",
                        "• Do not consent to searches",
                        "• You may record (follow consent rules)",
                        "• Remain silent; ask for a lawyer",
                      ]
                    : [
                        "• Ask if detained or free to go",
                        "• If free, leave calmly",
                        "• If detained: ID generally not required unless driving/arrested",
                        "• Do not consent to searches",
                        "• You may record (consent rules)",
                        "• Remain silent; ask for a lawyer",
                      ];
                  guide.forEach((t, i) => ctx.fillText(t, R, Y0 + (i + 1) * LH));

                  let yr = Y0 + (guide.length + 1.6) * LH;
                  ctx.fillStyle = "#ffd700"; ctx.font = "bold 22px Arial"; ctx.fillText("POT BROTHERS – 4 STEPS", R, yr); yr += LH;
                  ctx.fillStyle = "#fff"; ctx.font = "16px Arial";
                  FOUR_STEPS.forEach((t, i) => {
                    ctx.fillText(`${i + 1}) ${t}`, R, yr + i * LH);
                  });

                  // Footer
                  ctx.textAlign = "center";
                  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "14px Arial";
                  ctx.fillText(`Generated ${new Date().toLocaleDateString()} • Civil Rights Toolkit Pro 2025`, 600, 760);

                  canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${stateName.replace(/\s+/g, "_")}_Civil_Rights_Card.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                  });
                }}
                className="rounded-xl border px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                📸 Download PNG
              </button>
              <button
                onClick={() => {
                  const stateName = statePublicRecordsData[selectedState]?.name || "State";
                  const rights = stateIDRights[selectedState];
                  const foia = statePublicRecordsData[selectedState];
                  const weed = cannabisLaws[selectedState];
                  const recRule = recordingConsent[selectedState] || "One-party consent";
                  const w = window.open("", "_blank");
                  w.document.write(`<!doctype html><html><head><title>${stateName} Wallet Card</title><style>
                    body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto; margin:.5in}
                    .card{width:3.5in;height:2.25in;background:linear-gradient(135deg,#1e3a8a,#1d4ed8);color:#fff;border:2px solid #fff;border-radius:12px;padding:.18in;box-shadow:0 4px 10px rgba(0,0,0,.3)}
                    .h{border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:4px;margin-bottom:6px;text-align:center}
                    .t{font-weight:800;font-size:12px}
                    .s{font-weight:700;font-size:10px}
                    .sec{margin-bottom:4px}
                    .st{font-weight:700;color:#ffd700;font-size:8px;margin-bottom:1px}
                    .tx{font-size:7px;line-height:1.2}
                    .f{font-size:6px;text-align:center;opacity:.8;margin-top:4px}
                    @media print{body{margin:0}}
                  </style></head><body>
                    <div class="card">
                      <div class="h"><div class="t">${stateName.toUpperCase()}</div><div class="s">CIVIL RIGHTS & LAWS</div></div>
                      <div style="display:flex;gap:8px">
                        <div style="flex:1">
                          <div class="sec"><div class="st">KEY RIGHTS</div><div class="tx">• No consent to searches<br/>• Remain silent<br/>• Do not waive rights<br/>• Lawyer if detained</div></div>
                          <div class="sec"><div class="st">STATUTES</div><div class="tx">ID: ${rights?.law || "[N/A]"}<br/>Recording: ${recRule}<br/>Public Records: ${foia?.statute}<br/>Timeline: ${foia?.timeLimit}</div></div>
                          <div class="sec"><div class="st">CANNABIS</div><div class="tx">Status: ${weed?.status || "[N/A]"}<br/>Possession: ${weed?.possession || "[See details]"}<br/>Cultivation: ${weed?.cultivation || "Varies / see details"}</div></div>
                        </div>
                        <div style="flex:1">
                          <div class="sec"><div class="st">POLICE CONTACT</div><div class="tx">
                            ${rights?.stopAndID ? "• Provide required ID if detained<br/>" : "• Ask if detained; ID not required unless driving/arrested<br/>"}
                            • Do not consent to searches<br/>
                            • You may record (consent rules)<br/>
                            • Remain silent; ask for a lawyer
                          </div></div>
                          <div class="sec"><div class="st">POT BROTHERS – 4 STEPS</div><div class="tx">1) Keep it brief<br/>2) Detained or free to go?<br/>3) Remain silent<br/>4) I want my lawyer</div></div>
                        </div>
                      </div>
                      <div class="f">Generated ${new Date().toLocaleDateString()} • Toolkit Pro 2025</div>
                    </div>
                  </body></html>`);
                  w.document.close();
                  w.print();
                }}
                className="rounded-xl border px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                🖨️ Print Wallet Card
              </button>
            </div>
            {/* Live card preview */}
            <IdCard />
          </div>
        )}

        {/* Output */}
        {generatedLetter && documentType !== "ID Rights Card" && (
          <div className="rounded-3xl border shadow bg-white p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-lg font-semibold text-emerald-700">📄 Generated {documentType}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedLetter)}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 shadow"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedLetter], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const today = new Date().toLocaleDateString().replace(/\//g, "-");
                    a.href = url;
                    a.download = `${documentType.replace(/\s+/g, "_")}_${today}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 shadow"
                >
                  💾 Download
                </button>
              </div>
            </div>
            <textarea
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full min-h-[540px] font-mono text-sm rounded-xl border px-4 py-3"
            />
            <div className="mt-3 text-xs rounded-xl border bg-amber-50 p-3 text-amber-800">
              💡 Review placeholders before sending. Consider local counsel for complex matters.
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-3xl border bg-white shadow p-6 text-center text-sm text-slate-600">
          <b>⚖️ CIVIL RIGHTS TOOLKIT – 2025 COMPLIANCE SNAPSHOT.</b> Data summarized for convenience and may change. Verify statutes and limits in your jurisdiction. Not legal advice.
        </div>
      </div>
    </div>
  );
}
