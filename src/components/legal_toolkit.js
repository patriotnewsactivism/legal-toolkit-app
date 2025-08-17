// src/LegalToolkit.jsx
// Civil Rights Legal Toolkit Pro 2025 — Single-file React component
// Purpose: Generate attorney-style templates (FOIA, State PRA, Cease & Desist, Notice of Claim, Pre-Suit Notice,
//          Subpoena Duces Tecum, Discovery Requests) + State rights card. Includes state datasets and deadline calc.
// Notes: Inline styles retained for portability. Replace datasets with authoritative sources for production.

import React, { useEffect, useState } from 'react';

/* =============================================================
   STATE DATASETS (summaries; not legal advice)
   ============================================================= */

// Updated Public Records Database with sample Legislative Changes
const statePublicRecordsData = {
  AL: { name: 'Alabama', statute: 'Alabama Open Records Act (Code of Alabama § 36-12-40)', timeLimit: '7-10 business days' },
  AK: { name: 'Alaska', statute: 'Alaska Public Records Act (AS § 40.25.110-40.25.220)', timeLimit: '10 business days' },
  AZ: { name: 'Arizona', statute: 'Arizona Public Records Law (A.R.S. § 39-121)', timeLimit: 'Promptly (no specific timeframe)' },
  AR: { name: 'Arkansas', statute: 'Arkansas Freedom of Information Act (A.C.A. § 25-19-101)', timeLimit: '3 business days' },
  CA: { name: 'California', statute: 'California Public Records Act (Gov. Code §§ 7920.000 et seq.) — Recodified 2023', timeLimit: '10 calendar days', updates: 'AB 473 recodification effective Jan 1, 2023' },
  CO: { name: 'Colorado', statute: 'Colorado Open Records Act (C.R.S. § 24-72-201)', timeLimit: '3 business days' },
  CT: { name: 'Connecticut', statute: 'Connecticut Freedom of Information Act (C.G.S. § 1-200)', timeLimit: '4 business days' },
  DE: { name: 'Delaware', statute: 'Delaware Freedom of Information Act (29 Del. C. § 10001)', timeLimit: '15 business days' },
  FL: { name: 'Florida', statute: 'Florida Sunshine Law (F.S. § 119.01)', timeLimit: 'Reasonable time' },
  GA: { name: 'Georgia', statute: 'Georgia Open Records Act (O.C.G.A. § 50-18-70)', timeLimit: '3 business days' },
  HI: { name: 'Hawaii', statute: 'Hawaii Uniform Information Practices Act (HRS § 92F)', timeLimit: '10 business days' },
  ID: { name: 'Idaho', statute: 'Idaho Public Records Act (Idaho Code § 74-101)', timeLimit: '3 business days' },
  IL: { name: 'Illinois', statute: 'Illinois Freedom of Information Act (5 ILCS 140/)', timeLimit: '5 business days' },
  IN: { name: 'Indiana', statute: 'Indiana Access to Public Records Act (IC § 5-14-3)', timeLimit: '24 hours (readily available records)' },
  IA: { name: 'Iowa', statute: 'Iowa Open Records Law (Iowa Code § 22)', timeLimit: 'As soon as reasonably possible' },
  KS: { name: 'Kansas', statute: 'Kansas Open Records Act (K.S.A. § 45-215)', timeLimit: '3 business days' },
  KY: { name: 'Kentucky', statute: 'Kentucky Open Records Act (KRS § 61.870)', timeLimit: '3 business days' },
  LA: { name: 'Louisiana', statute: 'Louisiana Public Records Act (R.S. 44:1)', timeLimit: '3 business days' },
  ME: { name: 'Maine', statute: 'Maine Freedom of Access Act (1 M.R.S. § 401)', timeLimit: 'Reasonable time' },
  MD: { name: 'Maryland', statute: 'Maryland Public Information Act (GP § 4-101)', timeLimit: '30 days' },
  MA: { name: 'Massachusetts', statute: 'Massachusetts Public Records Law (M.G.L. c. 66)', timeLimit: '10 business days' },
  MI: { name: 'Michigan', statute: 'Michigan Freedom of Information Act (MCL § 15.231)', timeLimit: '5 business days' },
  MN: { name: 'Minnesota', statute: 'Minnesota Data Practices Act (M.S. § 13.01)', timeLimit: 'Immediately (if readily available)' },
  MS: { name: 'Mississippi', statute: 'Mississippi Public Records Act (Miss. Code § 25-61-1)', timeLimit: '7 business days' },
  MO: { name: 'Missouri', statute: 'Missouri Sunshine Law (R.S.Mo. § 610.010)', timeLimit: '3 business days' },
  MT: { name: 'Montana', statute: 'Montana Right to Know Act (MCA § 2-6-101)', timeLimit: 'Reasonable time' },
  NE: { name: 'Nebraska', statute: 'Nebraska Public Records Statutes (Neb. Rev. Stat. § 84-712)', timeLimit: '4 business days max', updates: 'LB 43 effective July 19, 2024 (fee & timing changes)' },
  NV: { name: 'Nevada', statute: 'Nevada Public Records Act (NRS § 239)', timeLimit: '5 business days' },
  NH: { name: 'New Hampshire', statute: 'Right-to-Know Law (RSA § 91-A)', timeLimit: '5 business days' },
  NJ: { name: 'New Jersey', statute: 'Open Public Records Act (N.J.S.A. § 47:1A-1)', timeLimit: '7 business days' },
  NM: { name: 'New Mexico', statute: 'Inspection of Public Records Act (NMSA § 14-2-1)', timeLimit: '3 business days' },
  NY: { name: 'New York', statute: 'Freedom of Information Law (Public Officers Law § 84)', timeLimit: '5 business days' },
  NC: { name: 'North Carolina', statute: 'Public Records Law (N.C.G.S. § 132-1)', timeLimit: 'As promptly as possible' },
  ND: { name: 'North Dakota', statute: 'Open Records Statute (NDCC § 44-04-18)', timeLimit: '3 business days' },
  OH: { name: 'Ohio', statute: 'Ohio Public Records Act (R.C. § 149.43)', timeLimit: 'Promptly' },
  OK: { name: 'Oklahoma', statute: 'Open Records Act (51 O.S. § 24A.1)', timeLimit: 'Reasonable time' },
  OR: { name: 'Oregon', statute: 'Public Records Law (ORS § 192.410)', timeLimit: 'Reasonable time' },
  PA: { name: 'Pennsylvania', statute: 'Right-to-Know Law (65 P.S. § 67.101)', timeLimit: '5 business days' },
  RI: { name: 'Rhode Island', statute: 'Access to Public Records Act (R.I.G.L. § 38-2-1)', timeLimit: '10 business days' },
  SC: { name: 'South Carolina', statute: 'Freedom of Information Act (S.C. Code § 30-4-10)', timeLimit: '15 business days' },
  SD: { name: 'South Dakota', statute: 'Sunshine Law (SDCL § 1-27-1)', timeLimit: 'Reasonable time' },
  TN: { name: 'Tennessee', statute: 'Public Records Act (T.C.A. § 10-7-503)', timeLimit: '7 business days' },
  TX: { name: 'Texas', statute: 'Public Information Act (Gov. Code § 552.001)', timeLimit: '10 business days' },
  UT: { name: 'Utah', statute: 'GRAMA (Utah Code § 63G-2-101)', timeLimit: '5-10 business days', updates: '2025 changes: ALJ replacing State Records Committee' },
  VT: { name: 'Vermont', statute: 'Public Records Act (1 V.S.A. § 315)', timeLimit: '3 business days' },
  VA: { name: 'Virginia', statute: 'FOIA (Va. Code § 2.2-3700)', timeLimit: '5 business days' },
  WA: { name: 'Washington', statute: 'Public Records Act (RCW § 42.56)', timeLimit: '5 business days' },
  WV: { name: 'West Virginia', statute: 'FOIA (W. Va. Code § 29B-1-1)', timeLimit: '5 business days' },
  WI: { name: 'Wisconsin', statute: 'Open Records Law (Wis. Stat. § 19.31)', timeLimit: 'As soon as practicable' },
  WY: { name: 'Wyoming', statute: 'Public Records Act (Wyo. Stat. § 16-4-201)', timeLimit: '3 business days' },
  DC: { name: 'District of Columbia', statute: 'DC FOIA (DC Code § 2-531)', timeLimit: '15 business days' },
};

// Cannabis Laws (condensed sample; extend as needed)
const cannabisLaws = {
  AK: { status: 'Recreational & Medical', enacted: '2014', possession: '1 oz; 6 plants (3 mature)', details: 'Ballot Measure 2' },
  AZ: { status: 'Recreational & Medical', enacted: '2020', possession: '1 oz; 6 plants', details: 'Prop 207' },
  CA: { status: 'Recreational & Medical', enacted: '2016', possession: '1 oz; 6 plants; 8g concentrates', details: 'Prop 64' },
  CO: { status: 'Recreational & Medical', enacted: '2012', possession: '1 oz; 6 plants', details: 'Amendment 64' },
  CT: { status: 'Recreational & Medical', enacted: '2021', possession: '1.5 oz; 6 plants', details: 'SB 1201' },
  DE: { status: 'Recreational & Medical', enacted: '2023', possession: '1 oz (no home grow)', details: 'HB 1 & 2' },
  FL: { status: 'Medical Only', enacted: '2016', possession: 'Qualified patients', details: 'Amendment 2' },
  GA: { status: 'Medical Only (Low-THC)', enacted: '2015', possession: 'Low-THC oil', details: 'Haleigh’s Hope Act' },
  IL: { status: 'Recreational & Medical', enacted: '2019', possession: '1 oz (no home grow rec.)', details: 'CRTA' },
  MD: { status: 'Recreational & Medical', enacted: '2022', possession: '1.5 oz; 2 plants', details: 'Question 4' },
  MA: { status: 'Recreational & Medical', enacted: '2016', possession: '1 oz; 6 plants', details: 'Question 4' },
  MI: { status: 'Recreational & Medical', enacted: '2018', possession: '2.5 oz; 12 plants', details: 'Proposal 1' },
  MN: { status: 'Recreational & Medical', enacted: '2023', possession: '2 oz; 8 plants', details: 'HF100' },
  MO: { status: 'Recreational & Medical', enacted: '2022', possession: '3 oz; 6 plants', details: 'Amendment 3' },
  MT: { status: 'Recreational & Medical', enacted: '2020', possession: '1 oz; 4 plants', details: 'CI-118' },
  NV: { status: 'Recreational & Medical', enacted: '2016', possession: '1 oz; 6 plants (distance rule)', details: 'Question 2' },
  NJ: { status: 'Recreational & Medical', enacted: '2020', possession: '1 oz', details: 'Public Question 1' },
  NM: { status: 'Recreational & Medical', enacted: '2021', possession: '2 oz; 6 mature', details: 'CRA' },
  NY: { status: 'Recreational & Medical', enacted: '2021', possession: '3 oz; 6 plants', details: 'MRTA' },
  OH: { status: 'Recreational & Medical', enacted: '2023', possession: '2.5 oz; 6 plants', details: 'Issue 2' },
  OR: { status: 'Recreational & Medical', enacted: '2014', possession: '1 oz; 4 plants', details: 'Measure 91' },
  PA: { status: 'Medical Only', enacted: '2016', possession: 'Qualified patients', details: 'MMA' },
  RI: { status: 'Recreational & Medical', enacted: '2022', possession: '1 oz; 3 mature', details: 'RIC Act' },
  VT: { status: 'Recreational & Medical', enacted: '2018', possession: '1 oz; 6 plants (2 mature)', details: 'H.511' },
  VA: { status: 'Recreational & Medical', enacted: '2021', possession: '1 oz; 4 plants', details: 'Legislative' },
  WA: { status: 'Recreational & Medical', enacted: '2012', possession: '1 oz (no home grow rec.)', details: 'I-502' },
  DC: { status: 'Recreational & Medical', enacted: '2014', possession: '2 oz; 6 plants', details: 'Initiative 71' },
  IN: { status: 'CBD Only', enacted: '2018', possession: 'CBD <0.3% THC', details: 'Industrial Hemp' },
  ID: { status: 'Fully Illegal', enacted: 'N/A', possession: 'Illegal', details: 'No medical/recreational/CBD' },
  KS: { status: 'Fully Illegal', enacted: 'N/A', possession: 'Illegal', details: 'No programs' },
  SC: { status: 'Fully Illegal', enacted: 'N/A', possession: 'Illegal', details: 'No programs' },
  WY: { status: 'Fully Illegal', enacted: 'N/A', possession: 'Illegal', details: 'No programs' },
};

// State Stop-and-Identify + Recording (condensed; extend as needed)
const stateIDRights = {
  AL: { stopAndID: true, law: 'Ala. Code § 15-5-30', idRequired: 'Name/address upon lawful stop', recording: 'One-party consent' },
  AK: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Only driving/arrest/licensing', recording: 'One-party consent' },
  AZ: { stopAndID: true, law: 'A.R.S. § 13-2412', idRequired: 'True full name during detention', recording: 'One-party consent' },
  AR: { stopAndID: true, law: 'A.C.A. § 5-71-213', idRequired: 'Name if lawfully stopped', recording: 'One-party consent' },
  CA: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'Two-party consent' },
  CO: { stopAndID: true, law: 'C.R.S. § 16-3-103', idRequired: 'Name/address; ID if available', recording: 'One-party consent' },
  CT: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'Two-party consent' },
  DE: { stopAndID: true, law: '11 Del. C. § 1902', idRequired: 'Identify if detained', recording: 'Two-party consent' },
  FL: { stopAndID: true, law: 'F.S. § 856.021', idRequired: 'Identify if detained', recording: 'Two-party consent' },
  GA: { stopAndID: true, law: 'O.C.G.A. § 16-11-36', idRequired: 'Name/address if detained', recording: 'One-party consent' },
  HI: { stopAndID: true, law: 'HRS 291C-172 (traffic contexts)', idRequired: 'Traffic-related', recording: 'One-party consent' },
  ID: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  IL: { stopAndID: true, law: '725 ILCS 5/107-14', idRequired: 'Identify if detained', recording: 'Two-party consent' },
  IN: { stopAndID: true, law: 'IC § 34-28-5-3.5', idRequired: 'Name if detained', recording: 'One-party consent' },
  IA: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  KS: { stopAndID: true, law: 'K.S.A. § 22-2402', idRequired: 'Name if detained', recording: 'One-party consent' },
  KY: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  LA: { stopAndID: true, law: 'La. R.S. § 14:108', idRequired: 'Name if detained', recording: 'One-party consent' },
  ME: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  MD: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'Two-party consent' },
  MA: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'Two-party consent' },
  MI: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  MN: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  MS: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  MO: { stopAndID: true, law: 'R.S.Mo. § 84.710 (KC/STL)', idRequired: 'Name in certain cities', recording: 'One-party consent' },
  MT: { stopAndID: true, law: 'MCA § 46-5-401', idRequired: 'Name if detained', recording: 'Two-party consent' },
  NE: { stopAndID: true, law: 'Neb. Rev. Stat. § 29-829', idRequired: 'Name if detained', recording: 'One-party consent' },
  NV: { stopAndID: true, law: 'NRS § 171.123', idRequired: 'Name if detained', recording: 'One-party consent' },
  NH: { stopAndID: true, law: 'RSA § 594:2', idRequired: 'Name/address/destination', recording: 'Two-party consent' },
  NJ: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  NM: { stopAndID: true, law: 'NMSA § 30-22-3', idRequired: 'Name if detained', recording: 'One-party consent' },
  NY: { stopAndID: true, law: 'CPL § 140.50', idRequired: 'Name/address/explanation', recording: 'One-party consent' },
  NC: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  ND: { stopAndID: true, law: 'NDCC § 29-29-21', idRequired: 'Name if detained', recording: 'One-party consent' },
  OH: { stopAndID: true, law: 'ORC § 2921.29', idRequired: 'Name/address/DOB if detained', recording: 'One-party consent' },
  OK: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  OR: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party (two-party in-person)' },
  PA: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'Two-party consent' },
  RI: { stopAndID: true, law: 'R.I.G.L. § 12-7-1', idRequired: 'Name/address/destination', recording: 'One-party consent' },
  SC: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  SD: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  TN: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  TX: { stopAndID: true, law: 'Tex. Penal Code § 38.02', idRequired: 'Name/address (arrest/detention)', recording: 'One-party consent' },
  UT: { stopAndID: true, law: 'Utah Code § 77-7-15', idRequired: 'Name/address/DOB during stop', recording: 'One-party consent' },
  VT: { stopAndID: true, law: '24 V.S.A. § 1983 (limited)', idRequired: 'Municipal contexts', recording: 'One-party consent' },
  VA: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  WA: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'Two-party consent' },
  WV: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  WI: { stopAndID: true, law: 'Wis. Stat. § 968.24', idRequired: 'Name if detained (no penalty for refusal)', recording: 'One-party consent' },
  WY: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
  DC: { stopAndID: false, law: 'No stop-and-identify statute', idRequired: 'Driving/arrest/licensing', recording: 'One-party consent' },
};

// State-specific notice requirements (subset; extend as needed)
const stateNoticeRequirements = {
  AL: {
    govTortClaim: { timeLimit: '1 year', statute: 'Ala. Code § 11-47-190', requirements: 'Written notice required' },
    medMalpractice: { timeLimit: '90 days', statute: 'Ala. Code § 6-5-484', requirements: 'Pre-suit notice with expert affidavit' },
    ceaseDesist: { requirements: 'No specific statutory requirements' },
  },
  AZ: {
    govTortClaim: { timeLimit: '180 days', statute: 'A.R.S. § 12-821.01', requirements: 'Notice within 180 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'No pre-suit notice required' },
    ceaseDesist: { requirements: 'Contract/consumer statutes may supply remedies' },
  },
  CA: {
    govTortClaim: { timeLimit: '6 months', statute: 'Gov. Code § 911.2', requirements: 'Government claim within 6 months' },
    medMalpractice: { timeLimit: '90 days', statute: 'CCP § 364', requirements: '90-day notice (often with expert declaration)' },
    ceaseDesist: { requirements: 'Use relevant Civil/Business & Professions Code sections' },
  },
  CO: {
    govTortClaim: { timeLimit: '182 days', statute: 'C.R.S. § 24-10-109', requirements: 'Notice within 182 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'No pre-suit notice required' },
    ceaseDesist: { requirements: 'C.R.S. § 6-1-105 (CCPA) for some claims' },
  },
  FL: {
    govTortClaim: { timeLimit: '3 years', statute: 'F.S. § 768.28', requirements: 'Pre-suit notice before suit' },
    medMalpractice: { timeLimit: '90 days', statute: 'F.S. § 766.106', requirements: 'Pre-suit investigation and notice' },
    ceaseDesist: { requirements: 'FDUTPA may apply' },
  },
  IL: {
    govTortClaim: { timeLimit: '1 year', statute: '745 ILCS 10/8-101', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: '90 days', statute: '735 ILCS 5/2-622', requirements: 'Affidavit/merit' },
    ceaseDesist: { requirements: 'Consumer Fraud Act may apply' },
  },
  LA: {
    govTortClaim: { timeLimit: '2 years', statute: 'La. R.S. § 13:5106', requirements: 'Notice per statute' },
    medMalpractice: { timeLimit: 'Panel required', statute: 'La. R.S. § 40:1299.47', requirements: 'Medical review panel' },
    ceaseDesist: { requirements: 'LUTPA may apply' },
  },
  MA: {
    govTortClaim: { timeLimit: '2 years', statute: 'M.G.L. c. 258 § 4', requirements: 'Presentment within 2 years' },
    medMalpractice: { timeLimit: '182 days', statute: 'M.G.L. c. 231 § 60B', requirements: 'Tribunal/offer of proof process' },
    ceaseDesist: { requirements: 'Chapter 93A requires 30-day demand letter for consumers' },
  },
  MI: {
    govTortClaim: { timeLimit: '1 year', statute: 'MCL § 691.1404', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: '182 days', statute: 'MCL § 600.2912b', requirements: 'Notice + affidavit of merit' },
    ceaseDesist: { requirements: 'MCPA may apply' },
  },
  MS: {
    govTortClaim: { timeLimit: '1 year', statute: 'Miss. Code § 11-46-11', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: '60 days', statute: 'Miss. Code § 15-1-36', requirements: '60-day notice; expert' },
    ceaseDesist: { requirements: 'MCPA may apply' },
  },
  MO: {
    govTortClaim: { timeLimit: '90 days', statute: 'R.S.Mo. § 537.600', requirements: 'Notice for state claims' },
    medMalpractice: { timeLimit: '90 days', statute: 'R.S.Mo. § 538.225', requirements: 'Affidavit within 90 days' },
    ceaseDesist: { requirements: 'MMPA may apply' },
  },
  NE: {
    govTortClaim: { timeLimit: '1 year', statute: 'Neb. Rev. Stat. § 13-919', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert affidavit typically at filing' },
    ceaseDesist: { requirements: 'Consumer Protection Act may apply' },
  },
  NJ: {
    govTortClaim: { timeLimit: '90 days', statute: 'N.J.S.A. § 59:8-8', requirements: 'Notice within 90 days; limited extension' },
    medMalpractice: { timeLimit: '60 days', statute: 'N.J.S.A. § 2A:53A-27', requirements: 'Affidavit of merit (same specialty)' },
    ceaseDesist: { requirements: 'CFA may apply; no fixed statutory response time' },
  },
  TX: {
    govTortClaim: { timeLimit: '6 months (often shorter local deadlines)', statute: 'Tex. Civ. Prac. & Rem. Code', requirements: 'Notice to governmental unit' },
    medMalpractice: { timeLimit: '60 days', statute: 'Tex. Civ. Prac. & Rem. § 74.051', requirements: 'Notice + authorization form' },
    ceaseDesist: { requirements: 'DTPA may apply' },
  },
  DC: {
    govTortClaim: { timeLimit: '6 months', statute: 'D.C. Code § 12-309', requirements: 'Notice within 6 months' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert needed at case stage' },
    ceaseDesist: { requirements: 'CPPA may apply' },
  },
};

/* =============================================================
   COMPONENT
   ============================================================= */

const LegalToolkit = () => {
  // Form state
  const [documentType, setDocumentType] = useState('FOIA Request');
  const [selectedState, setSelectedState] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [agency, setAgency] = useState('');
  const [recipient, setRecipient] = useState('');
  const [incident, setIncident] = useState('');
  const [damages, setDamages] = useState('');
  const [claimType, setClaimType] = useState('general');
  const [violationType, setViolationType] = useState('harassment');

  // Litigation fields
  const [plaintiffName, setPlaintiffName] = useState('');
  const [defendantName, setDefendantName] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [discoveryType, setDiscoveryType] = useState('interrogatories');

  // Auto-populated legal bits
  const [timeLimit, setTimeLimit] = useState('');
  const [statute, setStatute] = useState('');

  // Output
  const [generatedLetter, setGeneratedLetter] = useState('');

  // Auto-populate when state/doc/claim changes
  useEffect(() => {
    if (!selectedState) {
      setJurisdiction('');
      setTimeLimit('');
      setStatute('');
      return;
    }

    const stateData = statePublicRecordsData[selectedState];
    if (!stateData) return;

    if (documentType === 'FOIA Request' || documentType === 'State Public Records Request') {
      setJurisdiction(stateData.name);
      setTimeLimit(stateData.timeLimit || '');
      setStatute(stateData.statute || '');
      return;
    }

    if (documentType === 'ID Rights Card' && stateIDRights[selectedState]) {
      const rights = stateIDRights[selectedState];
      setJurisdiction(stateData.name);
      setTimeLimit(rights.stopAndID ? 'Stop-and-identify jurisdiction' : 'No stop-and-identify law');
      setStatute(rights.law);
      return;
    }

    if (stateNoticeRequirements[selectedState]) {
      setJurisdiction(stateData.name);
      if (documentType === 'Notice of Claim' && claimType === 'government') {
        const req = stateNoticeRequirements[selectedState].govTortClaim;
        if (req) { setTimeLimit(req.timeLimit || ''); setStatute(req.statute || ''); }
        return;
      }
      if (documentType === 'Pre-Suit Notice' && claimType === 'medical') {
        const req = stateNoticeRequirements[selectedState].medMalpractice;
        if (req) { setTimeLimit(req.timeLimit || ''); setStatute(req.statute || ''); }
        return;
      }
    }
  }, [selectedState, documentType, claimType]);

  /* =====================
     Generators
     ===================== */

  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let out = '';
    switch (documentType) {
      case 'FOIA Request':
        out = generateFOIARequest(today);
        break;
      case 'State Public Records Request':
        out = generateFOIARequest(today); // Reuse with state hook info
        break;
      case 'Cease and Desist Letter':
        out = generateCeaseDesistLetter(today);
        break;
      case 'Notice of Claim':
        out = generateNoticeOfClaim(today);
        break;
      case 'Pre-Suit Notice':
        out = generatePreSuitNotice(today);
        break;
      case 'Subpoena Duces Tecum':
        out = generateSubpoenaDucesTecum(today);
        break;
      case 'Discovery Request':
        out = generateDiscoveryRequest(today);
        break;
      case 'ID Rights Card':
        out = generateIDRightsCard();
        break;
      default:
        out = '';
    }
    setGeneratedLetter(out);
  };

  const generateFOIARequest = (today) => {
    const stateData = selectedState ? statePublicRecordsData[selectedState] : null;
    const updates = stateData?.updates ? `\n\n**LEGISLATIVE UPDATE:** ${stateData.updates}` : '';

    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${agency || '[Agency Name]'}
FOIA Officer/Records Custodian
[Agency Address]
[City, State, ZIP Code]

Re: ${documentType === 'FOIA Request' ? 'Freedom of Information Act Request' : 'Public Records Request'} — EXPEDITED PROCESSING REQUESTED

Dear Records Officer:

Pursuant to ${documentType === 'FOIA Request' ? 'the Freedom of Information Act, 5 U.S.C. § 552' : 'applicable state public records laws'}${selectedState ? `, including ${statute}` : ''}, I request access to and copies of the following records:

SUBJECT MATTER: ${incident || '[Describe precisely the records sought: dates, custodians, formats, keywords, case #s]'}
JURISDICTION: ${jurisdiction || '[Jurisdiction]'}
${selectedState ? `APPLICABLE STATE LAW: This request is also made under ${statute}, which provides response within ${timeLimit}.` : ''}${updates}

SPECIFICATIONS
• Time Period: [e.g., Jan 1, 2024 – Dec 31, 2024]
• Record Types: emails, reports, policies, audio/video, databases, metadata
• Custodians: [names/departments]
• Keywords/IDs: [terms, case numbers]
• Format: Electronic; searchable PDFs or native with metadata

FEE WAIVER
This is in the public interest and not for commercial use. If fees exceed $50, provide an estimate before processing.

EXPEDITED PROCESSING
[Select if applicable]
☐ Urgency to inform the public   ☐ Exceptional media interest   ☐ Constitutional rights at stake

SEGREGABILITY & PARTIAL DISCLOSURE
If exemptions apply, produce a Vaughn index and release all reasonably segregable portions.

PRESERVATION
Please preserve all responsive records during processing.

${selectedState ? `RESPONSE TIMEFRAME: Under ${statute}, please acknowledge and respond within ${timeLimit}.` : 'Please respond within statutory timeframes and acknowledge receipt.'}

Thank you for your prompt attention.

Sincerely,

[Your Signature]
[Your Printed Name]
[Organization, if any]

—
DELIVERY
☐ Email  ☐ Certified Mail (RRR)  ☐ Portal  ☐ Hand Delivery
TRACKING
Request Date: ${today}
Response Due: [${calculateResponseDate() || 'calculate based on law'}]
Request # (agency assigns): ______`;
  };

  const generateIDRightsCard = () => {
    const stateName = selectedState ? statePublicRecordsData[selectedState]?.name : '[STATE]';
    const rights = selectedState ? stateIDRights[selectedState] : null;
    const canna = selectedState ? cannabisLaws[selectedState] : null;
    if (!rights) return 'Please select a state to generate your Civil Rights & Laws Reference Card';

    return (
      <div id="id-rights-card" style={{
        width: '400px', height: '300px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '15px', padding: '20px', color: 'white', fontFamily: 'Arial, sans-serif',
        fontSize: '11px', lineHeight: 1.3, position: 'relative', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', border: '2px solid #fff',
      }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>{(stateName || '').toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>CIVIL RIGHTS & LAWS REFERENCE CARD</div>
        </div>
        <div style={{ display: 'flex', gap: 15, height: 200 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 6, color: '#ffd700' }}>CONSTITUTIONAL RIGHTS</div>
            <div style={{ fontSize: 9, marginBottom: 4 }}>• I do not consent to searches</div>
            <div style={{ fontSize: 9, marginBottom: 4 }}>• I invoke my right to remain silent</div>
            <div style={{ fontSize: 9, marginBottom: 4 }}>• I do not waive any rights</div>
            <div style={{ fontSize: 9, marginBottom: 8 }}>• I want a lawyer if detained</div>

            <div style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4, color: '#ffd700' }}>STATE LAWS</div>
            <div style={{ fontSize: 8, marginBottom: 4 }}>
              {rights.stopAndID ? `✓ Stop & ID: ${rights.law}` : '✗ No Stop & ID Law'}
            </div>
            <div style={{ fontSize: 8, marginBottom: 4 }}>Recording: {rights.recording}</div>
            {canna && (
              <div style={{ fontSize: 8, marginBottom: 4, color: '#90EE90' }}>Cannabis: {canna.status}</div>
            )}
            <div style={{ fontSize: 8, marginBottom: 4 }}>FOIA Response: {selectedState ? statePublicRecordsData[selectedState]?.timeLimit : 'N/A'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 6, color: '#ffd700' }}>POLICE ENCOUNTER SCRIPT</div>
            <div style={{ fontSize: 8, marginBottom: 3, fontWeight: 600 }}>"Officer, am I being detained or free to go?"</div>
            <div style={{ fontSize: 8 }}>If FREE TO GO:</div>
            <div style={{ fontSize: 7, marginBottom: 4, fontStyle: 'italic' }}>
              "I choose to leave now."
            </div>
            <div style={{ fontSize: 8 }}>If DETAINED:</div>
            <div style={{ fontSize: 7 }}>"I respectfully decline to answer questions."</div>
            <div style={{ fontSize: 7, marginBottom: 4 }}>"I do not consent to any search."</div>
            <div style={{ fontSize: 7, marginBottom: 4 }}>
              {rights.stopAndID ? '"Please state the law requiring ID."' : '"I am not required to show ID unless driving or under arrest."'}
            </div>
            <div style={{ fontSize: 8 }}>If ARRESTED:</div>
            <div style={{ fontSize: 7, marginBottom: 4 }}>"I want a lawyer."</div>
            <div style={{ fontSize: 8 }}>EMERGENCY CONTACTS</div>
            <div style={{ fontSize: 7 }}>Attorney: __________</div>
            <div style={{ fontSize: 7 }}>Emergency: _________</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: 20, right: 20, borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 7, opacity: 0.8 }}>
          <div>Generated: {new Date().toLocaleDateString()}</div>
          <div>Civil Rights Toolkit Pro 2025</div>
        </div>
      </div>
    );
  };

  const generateCeaseDesistLetter = (today) => {
    const req = selectedState ? stateNoticeRequirements[selectedState]?.ceaseDesist : null;
    let stateSection = '';
    if (req?.requirements) stateSection += `\n\nSTATE-SPECIFIC REQUIREMENTS: ${req.requirements}`;

    return `[Your Name]
[Your Address]
[City, State, ZIP]
[Email] | [Phone]

${today}

${recipient || '[Recipient Name]'}
[Address]
[City, State, ZIP]

RE: FORMAL CEASE AND DESIST — ${violationType.toUpperCase()}
${jurisdiction ? `JURISDICTION: ${jurisdiction}\n` : ''}REFERENCE: [Matter #]

SENT VIA CERTIFIED MAIL (RRR)

Dear ${recipient || '[Recipient]'}:

You are hereby DEMANDED to immediately CEASE AND DESIST from the following conduct:

SPECIFIC VIOLATIONS
${incident || '[Describe detailed conduct, dates, locations, witnesses, evidence]'}

LEGAL BASIS
[Identify federal/state/local statutes, civil claims, and contract terms violated]

DEMANDS
1) Cease all unlawful conduct immediately.
2) Remove/retract offending materials or actions.
3) Preserve all related evidence.
4) Provide written confirmation within ${req?.mandatoryNotice || 'ten (10) business days'}.
${stateSection}

DAMAGES/HARM
${damages || '[Describe monetary losses, reputational harm, emotional distress, business impacts]'}

NOTICE
Failure to comply may result in legal action seeking injunctive relief, damages (including statutory/treble where applicable), fees, and costs.

Sincerely,

[Your Signature]
[Your Printed Name]
[Title/Capacity]

—
DELIVERY LOG
Notice Date: ${today} | Response Due: [${req?.mandatoryNotice || '10 business days'}]
Method(s): ☐ Certified Mail ☐ Email ☐ Personal Service ☐ Other`;
  };

  const generateNoticeOfClaim = (today) => {
    const req = selectedState && claimType === 'government' ? stateNoticeRequirements[selectedState]?.govTortClaim : null;
    const timeReq = req?.timeLimit || '';
    const lawRef = req?.statute || '';

    const stateRequirements = req
      ? `\n\nSTATE REQUIREMENTS\n• Filing Deadline: ${timeReq}\n• Governing Statute: ${lawRef}\n• Procedural Requirements: ${req.requirements}`
      : '';

    return `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Email] | [Phone]\n\n${today}\n\n${agency || recipient || '[Government Entity/Recipient]'}\n${claimType === 'government' ? 'Claims Administrator/Risk Management' : 'Legal Department'}\n[Address]\n[City, State, ZIP]\n\nRE: FORMAL NOTICE OF CLAIM — ${claimType === 'government' ? 'GOVERNMENT LIABILITY' : 'CIVIL LIABILITY'}\n${jurisdiction ? `JURISDICTION: ${jurisdiction}\n` : ''}${lawRef ? `GOVERNING LAW: ${lawRef}\n` : ''}CLAIM VALUE: ${damages || '$[AMOUNT]'}\n\nSENT VIA CERTIFIED MAIL (RRR)\n\nTO WHOM IT MAY CONCERN:\n\nNOTICE is given of a claim for substantial damages arising from the incident described below.\n\nINCIDENT DETAILS\n• Date/Time: [Date/Time]\n• Location: [Full address & specific location]\n• Witnesses: [Names/contacts]\n\nFACTUAL NARRATIVE\n${incident || '[Provide chronological, detailed description with all relevant facts]'}\n\nTHEORIES OF LIABILITY\n• Negligence/Gross Negligence\n• Failure to train/supervise\n• Dangerous condition of public property\n• Constitutional violations (42 U.S.C. § 1983) [if applicable]\n• Statutory/regulatory violations\n\nDAMAGES\n• Medical expenses, future care\n• Lost wages/earning capacity\n• Property damage\n• Pain/suffering, emotional distress\n• Other consequential losses\n\nTOTAL CLAIM VALUE: ${damages || '$[TOTAL]'}\n${stateRequirements}\n\nEVIDENCE PRESERVATION DEMAND\nPreserve all documents, ESI, video, communications, policies, and training related to this matter.\n\nSETTLEMENT\nOpen to early resolution. Please acknowledge within thirty (30) days and provide insurance/claims handling details.\n${timeReq ? `\nCRITICAL DEADLINE\nThis notice is submitted within ${timeReq} as required under ${lawRef}.` : ''}\n\nRespectfully,\n\n[Your Signature]\n[Your Printed Name]\n[Capacity]\n\nATTACHMENTS\n☐ Medical bills/records  ☐ Photos/Video  ☐ Incident/Police Reports  ☐ Witness Statements  ☐ Wage Proof\n\nDELIVERY\n☐ Certified Mail  ☐ Personal Service  ☐ Email (if authorized)  ☐ Registered Mail\nTRACKING\nNotice Date: ${today} | Response Deadline: 30 days | Ref #: ______`;
  };

  const generatePreSuitNotice = (today) => {
    let timeRequirement = '';
    let lawRef = '';
    let expertReq = '';
    let updates = '';

    if (selectedState && stateNoticeRequirements[selectedState]?.medMalpractice && claimType === 'medical') {
      const s = stateNoticeRequirements[selectedState].medMalpractice;
      timeRequirement = s.timeLimit || '';
      lawRef = s.statute || '';
      expertReq = s.requirements || '';
      updates = s.updates ? `\n\nLEGISLATIVE UPDATES: ${s.updates}` : '';
    }

    const settlementWindow = timeRequirement && timeRequirement !== 'None' ? timeRequirement : 'sixty (60) days';

    return `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Email] | [Phone]\n\n${today}\n\n${recipient || '[Professional/Provider Name]'}\n[License #]\n[Address]\n[City, State, ZIP]\n\n${claimType === 'medical' ? 'ALSO TO: [Liability Insurer]\n[Address]\n\nALSO TO: [Hospital/Facility Risk Management]\n[Address]' : ''}\n\nRE: FORMAL PRE-SUIT NOTICE OF PROFESSIONAL LIABILITY CLAIM\n${claimType === 'medical' ? 'MEDICAL MALPRACTICE AND PROFESSIONAL NEGLIGENCE' : 'PROFESSIONAL NEGLIGENCE'}\n${jurisdiction ? `JURISDICTION: ${jurisdiction}\n` : ''}${lawRef ? `GOVERNING STATUTE: ${lawRef}\n` : ''}CLAIM VALUE: ${damages || '$[SUBSTANTIAL DAMAGES]'}\n\nSENT VIA CERTIFIED MAIL (RRR)\n\nPARTIES/RELATIONSHIP\n${claimType === 'medical' ? 'Patient' : 'Client'}: [Full Name] | DOB: [DOB] | ${claimType === 'medical' ? 'MRN' : 'File #'}: [#]\n\nCARE/SERVICE PERIOD\n[Start Date] through [End Date] at [Facility/Office].\n\nFACTUAL BASIS\n${incident || `[Detailed, chronological description of alleged ${claimType === 'medical' ? 'malpractice' : 'professional negligence'} with dates, acts/omissions, and consequences.]`}\n\nSTANDARD OF CARE VIOLATIONS\n1) [Specific violation #1]\n2) [Specific violation #2]\n3) [Specific violation #3]\n\nDAMAGES\n• Medical/professional costs\n• Lost wages/earning capacity\n• Future care/rehabilitation\n• Non-economic damages\n\nCAUSATION\nExpert testimony will establish that the injuries were directly caused by the departures from accepted standards.\n\n${expertReq && expertReq !== 'No pre-suit notice required' ? `EXPERT CERTIFICATION\n${expertReq}` : ''}
${updates}
\nSETTLEMENT WINDOW\nIf you wish to discuss resolution, contact undersigned within ${settlementWindow} of receipt of this notice.\n\nEVIDENCE PRESERVATION DEMAND\nPreserve ALL records/ESI including communications, diagnostics, images, billing, policies, training, and device logs.\n\nINSURANCE NOTICE\nImmediately notify all potentially applicable liability carriers and provide carrier details, limits, and claim numbers.\n\nThis notice is provided pursuant to ${lawRef || 'applicable law'} and preserves all rights.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n[On behalf of ${claimType === 'medical' ? '[Patient Name]' : '[Client Name]'}]\n\nATTACHMENTS\n${expertReq?.toLowerCase().includes('affidavit') ? '☐ Expert Affidavit\n' : ''}${expertReq?.toLowerCase().includes('certificate') ? '☐ Certificate of Merit\n' : ''}☐ Records summary  ☐ Damages worksheet  ☐ Supporting docs\n\nDELIVERY & TRACKING\nNotice Date: ${today} | Required Period: ${timeRequirement || 'N/A'} | Settlement Period: ${settlementWindow}`;
  };

  const generateSubpoenaDucesTecum = (today) => {
    return `${courtName || '[COURT NAME]'}\n${jurisdiction || '[JURISDICTION]'}\n\n${plaintiffName || '[PLAINTIFF]'},  Plaintiff,\n\nv.                                  Case No. ${caseNumber || '[CASE #]'}\n\n${defendantName || '[DEFENDANT]'},  Defendant.\n\nSUBPOENA DUCES TECUM\n\nTO: ${recipient || '[WITNESS/RECORDS CUSTODIAN NAME]'}\n    [Address]\n    [City, State, ZIP]\n\nYOU ARE COMMANDED to appear at the time, date, and place below to testify and produce the documents/ESI/objects described.\n\nAPPEARANCE\n• Date: [Date]   • Time: [Time]   • Location: [Courtroom/Deposition Location]\n\nDOCUMENTS TO PRODUCE\n${incident || '[Describe categories with specificity, including time range, custodians, and formats]'}\n\nINCLUDING (non-exclusive)\n1) Contracts/agreements\n2) Emails/texts/chats related to the subject\n3) Policies/procedures/training\n4) Incident/accident reports\n5) Photos/videos/audio\n6) Accounting and payment records\n7) Logs/metadata/forensic artifacts\n8) Any related third-party communications\n\nTIME RANGE\n[Start Date] through [End Date]\n\nFORMAT\nProduce natively with metadata. If not feasible, produce text-searchable PDFs with load files/metadata.\n\nPRIVILEGE LOG\nIf withholding, provide a log identifying each item and basis for privilege.\n\nINSPECTION\nInspection/copying at [Location] during business hours by appointment.\n\nCOMPLIANCE\nFailure to comply may result in contempt and sanctions as provided by law.\n\nOBJECTIONS\nServe written objections within [#] days of service.\n\n${selectedState ? `APPLICABLE LAW\nIssued pursuant to ${statute} and applicable rules of civil procedure.` : 'Issued pursuant to applicable rules of civil procedure.'}\n\nWITNESS FEES\nWitness entitled to statutory fee and mileage.\n\nDate: ${today}\n\n______________________________\n[Attorney Name], [Bar #]\nAttorney for ${plaintiffName || '[Plaintiff]'}\n[Law Firm]\n[Address] | [City, State, ZIP] | [Phone] | [Email]\n\nCERTIFICATE OF SERVICE\nService by: ☐ Personal  ☐ Certified Mail  ☐ Email  ☐ Other\nDate: ______  Time: ______  Location: ______\n\n______________________________\n[Server Signature]`;
  };

  const generateDiscoveryRequest = (today) => {
    const title =
      discoveryType === 'interrogatories'
        ? 'INTERROGATORIES'
        : discoveryType === 'requests_for_production'
        ? 'REQUESTS FOR PRODUCTION OF DOCUMENTS'
        : discoveryType === 'requests_for_admission'
        ? 'REQUESTS FOR ADMISSION'
        : 'DISCOVERY REQUESTS';

    return `${courtName || '[COURT NAME]'}\n${jurisdiction || '[JURISDICTION]'}\n\n${plaintiffName || '[PLAINTIFF]'},  Plaintiff,\n\nv.                                  Case No. ${caseNumber || '[CASE #]'}\n\n${defendantName || '[DEFENDANT]'},  Defendant.\n\n${(plaintiffName || '[PLAINTIFF]').toUpperCase()}'S ${title} TO ${(defendantName || '[DEFENDANT]').toUpperCase()} (SET ONE)\n\nTO: ${defendantName || '[Defendant]'}\n[Defendant Address]\n\nYOU ARE REQUESTED to respond to the following ${title.toLowerCase()} per the rules of civil procedure.\n\nDEFINITIONS & INSTRUCTIONS\n1) "You/Your" includes the party and all agents/representatives.\n2) "Document" includes ESI and any stored information.\n3) "Communication" covers written/oral/electronic transfers.\n4) "Identify (person)": name, address, phone, role.\n5) "Identify (document)": date, author, recipients, type, subject, custodian, location.\n6) Continuing duty to supplement.\n7) If unable to fully respond, answer to the extent possible and explain limitations.\n\n$${discoveryType === 'interrogatories' ? `
INTERROGATORIES
1) State your full name, aliases, current address, and contact information.
2) Identify all persons with knowledge of the incident.
3) Describe in detail your actions related to ${incident || '[the subject matter]' }.
4) Identify all documents in your possession relating to ${incident || '[the subject matter]' }.
5) State all facts supporting your denials/defenses.
6) Identify all expert witnesses and the subject of testimony.
7) Describe all damages you claim.
8) Identify all insurance potentially covering these claims.
9) State whether you have given any statements; identify details.
10) Identify all lawsuits you have been a party to in the past ten (10) years.
` : ''}
$${discoveryType === 'requests_for_production' ? `
REQUESTS FOR PRODUCTION
1) All documents supporting your answers to interrogatories.
2) All documents relating to ${incident || '[the subject matter]' }.
3) All communications with third parties regarding the subject.
4) All photos/videos/audio regarding the subject.
5) All policies/procedures/contracts in effect at the time.
6) All training materials and manuals relevant to the subject.
7) All incident/accident reports.
8) All insurance policies and endorsements that may cover the claims.
9) All expert reports/analyses relating to the subject.
10) All emails/texts/social media posts relating to the subject.
` : ''}
$${discoveryType === 'requests_for_admission' ? `
REQUESTS FOR ADMISSION
1) Admit you were present at the location where ${incident || '[the incident]'} occurred.
2) Admit you had knowledge of the facts alleged in the complaint.
3) Admit the genuineness of documents attached to the complaint.
4) Admit you received notice of ${incident || '[the relevant circumstances]' }.
5) Admit you failed to follow applicable policies/procedures.
6) Admit your actions were a proximate cause of the alleged damages.
7) Admit you have no evidence supporting affirmative defenses.
8) Admit the statements attributed to you are accurate.
9) Admit you have insurance that may apply.
10) Admit you consulted experts regarding ${incident || '[the subject matter]' }.
` : ''}

PRIVILEGE LOG
If withholding on privilege, provide a log identifying type, subject, date, author, recipients, custodian, and privilege.

ESI FORMAT
Produce natively with metadata; if not reasonably usable, PDF with available metadata.\n\n${selectedState ? `APPLICABLE LAW\nRequests propounded pursuant to ${statute} and applicable rules.` : 'Requests propounded pursuant to applicable rules.'}
\nRESPONSES DUE: 30 days from service unless otherwise ordered.
\nDate: ${today}\n\nRespectfully submitted,\n\n______________________________\n[Attorney Name], [Bar #]\nAttorney for ${plaintiffName || '[Plaintiff]'}\n[Law Firm] | [Address] | [Phone] | [Email]\n\nCERTIFICATE OF SERVICE\nServed via: ☐ Email ☐ U.S. Mail ☐ Hand Delivery ☐ Other\nDate: ______   Signature: ____________________`;
  };

  const calculateResponseDate = () => {
    if (!selectedState || !timeLimit) return '';

    const today = new Date();
    const businessDaysMatch = timeLimit.match(/(\d+)\s*business\s*days/i);
    const calendarDaysMatch = timeLimit.match(/(\d+)\s*calendar\s*days/i);
    const daysMatch = timeLimit.match(/(\d+)\s*days/i);
    const monthsMatch = timeLimit.match(/(\d+)\s*months?/i);
    const yearsMatch = timeLimit.match(/(\d+)\s*years?/i);

    if (businessDaysMatch) {
      const days = parseInt(businessDaysMatch[1], 10);
      let count = 0;
      const result = new Date(today);
      while (count < days) {
        result.setDate(result.getDate() + 1);
        const dow = result.getDay();
        if (dow !== 0 && dow !== 6) count++;
      }
      return result.toLocaleDateString();
    }

    if (calendarDaysMatch || daysMatch) {
      const days = parseInt((calendarDaysMatch || daysMatch)[1], 10);
      const result = new Date(today);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString();
    }

    if (monthsMatch) {
      const months = parseInt(monthsMatch[1], 10);
      const result = new Date(today);
      result.setMonth(result.getMonth() + months);
      return result.toLocaleDateString();
    }

    if (yearsMatch) {
      const years = parseInt(yearsMatch[1], 10);
      const result = new Date(today);
      result.setFullYear(result.getFullYear() + years);
      return result.toLocaleDateString();
    }

    return 'Contact appropriate party for specific deadline';
  };

  /* =====================
     UI
     ===================== */

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 20,
          padding: 40,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, borderBottom: '3px solid #1e3c72', paddingBottom: 20 }}>
          <h1 style={{ color: '#1e3c72', fontSize: '3rem', fontWeight: 700, margin: '0 0 10px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            Civil Rights Legal Toolkit Pro 2025
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem', margin: 0 }}>
            Attorney-Level Document Generator • 2024–2025 Legislative Placeholders • Professional Practice
          </p>
        </div>

        {/* Primary selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 25, marginBottom: 30 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>📄 Document Type:</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{ width: '100%', padding: 15, border: '2px solid #3498db', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff', cursor: 'pointer' }}
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
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>🏛️ State/Jurisdiction:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ width: '100%', padding: 15, border: '2px solid #3498db', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="">Select a state…</option>
              {Object.entries(statePublicRecordsData).map(([code, data]) => (
                <option key={code} value={code}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic primary fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 25, marginBottom: 30 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>
              {documentType === 'FOIA Request' || documentType === 'State Public Records Request'
                ? '🏢 Agency/Records Custodian:'
                : documentType === 'Subpoena Duces Tecum' || documentType === 'Discovery Request'
                ? '👤 Witness/Respondent Name:'
                : '👤 Recipient/Target:'}
            </label>
            <input
              type="text"
              value={documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? agency : recipient}
              onChange={(e) =>
                documentType === 'FOIA Request' || documentType === 'State Public Records Request'
                  ? setAgency(e.target.value)
                  : setRecipient(e.target.value)
              }
              placeholder={
                documentType === 'FOIA Request' || documentType === 'State Public Records Request'
                  ? 'Enter agency or department name'
                  : documentType === 'Subpoena Duces Tecum' || documentType === 'Discovery Request'
                  ? 'Enter witness/respondent name'
                  : 'Enter recipient name'
              }
              style={{ width: '100%', padding: 15, border: '2px solid #3498db', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>📍 Jurisdiction:</label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="Auto-populates from state selection"
              style={{ width: '100%', padding: 15, border: selectedState ? '2px solid #27ae60' : '2px solid #3498db', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: selectedState ? '#f8fff8' : '#fff' }}
            />
          </div>
        </div>

        {/* Damages field for certain docs */}
        {(documentType === 'Notice of Claim' || documentType === 'Pre-Suit Notice' || documentType === 'Cease and Desist Letter') && (
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>💰 Damages/Settlement Demand:</label>
            <textarea
              value={damages}
              onChange={(e) => setDamages(e.target.value)}
              placeholder="Monetary damages, injuries, economic losses, punitive claim, and methodology."
              style={{ width: '100%', height: 120, padding: 15, border: '2px solid #e74c3c', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff', resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
        )}

        {/* Subject/incident area */}
        <div style={{ marginBottom: 30 }}>
          <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>
            📝
            {documentType === 'FOIA Request' || documentType === 'State Public Records Request'
              ? ' Records Requested (Be Specific):'
              : documentType === 'ID Rights Card'
              ? ' Additional Legal Information (Optional):'
              : documentType === 'Cease and Desist Letter'
              ? ' Detailed Violation Description:'
              : documentType === 'Notice of Claim'
              ? ' Comprehensive Incident Description:'
              : documentType === 'Pre-Suit Notice'
              ? ' Professional Malpractice/Negligence Description:'
              : documentType === 'Subpoena Duces Tecum'
              ? ' Documents/Materials to be Produced:'
              : documentType === 'Discovery Request'
              ? ' Case Facts and Discovery Scope:'
              : ' Subject Matter:'}
          </label>
          <textarea
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={
              documentType === 'FOIA Request' || documentType === 'State Public Records Request'
                ? 'Describe specific records, time periods, custodians, keywords, formats.'
                : documentType === 'ID Rights Card'
                ? 'Optional: notes for your state (ordinances, contacts, recent changes).'
                : documentType === 'Cease and Desist Letter'
                ? 'Specific violations with dates/times/locations, witnesses, and evidence.'
                : documentType === 'Notice of Claim'
                ? 'Chronological incident facts: who/what/when/where/how and immediate aftermath.'
                : documentType === 'Pre-Suit Notice'
                ? 'Standard of care breaches, dates of treatment/services, causal chain, resulting injuries.'
                : documentType === 'Subpoena Duces Tecum'
                ? 'List precise categories, date ranges, custodians, and formats.'
                : documentType === 'Discovery Request'
                ? 'Key issues in dispute, timeframes, witnesses, and evidence sought.'
                : 'Describe the subject matter.'
            }
            style={{ width: '100%', height: 200, padding: 15, border: '2px solid #3498db', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff', resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>

        {/* Cannabis panel */}
        {selectedState && cannabisLaws[selectedState] && (
          <div style={{ backgroundColor: '#f0f8ff', border: '2px solid #4169e1', borderRadius: 15, padding: 20, marginBottom: 25, boxShadow: '0 4px 15px rgba(65,105,225,0.1)' }}>
            <h3 style={{ color: '#4169e1', marginTop: 0, marginBottom: 15, fontSize: '1.3rem', fontWeight: 600 }}>
              🌿 {statePublicRecordsData[selectedState].name} Cannabis Laws — Civil Rights Impact
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
              <div>
                <strong>Legal Status:</strong> {cannabisLaws[selectedState].status}
              </div>
              {cannabisLaws[selectedState].enacted && (
                <div>
                  <strong>Enacted:</strong> {cannabisLaws[selectedState].enacted}
                </div>
              )}
              <div>
                <strong>Possession Limits:</strong> {cannabisLaws[selectedState].possession}
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
              <strong>Details:</strong> {cannabisLaws[selectedState].details}
            </div>
            {(cannabisLaws[selectedState].status === 'Fully Illegal' || cannabisLaws[selectedState].status?.includes('CBD')) && (
              <div style={{ marginTop: 10, padding: 10, backgroundColor: '#ffebee', borderRadius: 8, fontSize: 14, color: '#c62828' }}>
                <strong>⚠️ Civil Rights Notice:</strong> Possession remains restricted/illegal. Know your rights.
              </div>
            )}
          </div>
        )}

        {/* Litigation fields */}
        {(documentType === 'Subpoena Duces Tecum' || documentType === 'Discovery Request') && (
          <div style={{ backgroundColor: '#fff8e1', border: '2px solid #ffa726', borderRadius: 15, padding: 20, marginBottom: 25 }}>
            <h3 style={{ color: '#f57c00', marginTop: 0, marginBottom: 20 }}>⚖️ Litigation Document Fields</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50' }}>Plaintiff Name:</label>
                <input type="text" value={plaintiffName} onChange={(e) => setPlaintiffName(e.target.value)} placeholder="Enter plaintiff name" style={{ width: '100%', padding: 12, border: '2px solid #ffa726', borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50' }}>Defendant Name:</label>
                <input type="text" value={defendantName} onChange={(e) => setDefendantName(e.target.value)} placeholder="Enter defendant name" style={{ width: '100%', padding: 12, border: '2px solid #ffa726', borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50' }}>Case Number:</label>
                <input type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} placeholder="Enter case number" style={{ width: '100%', padding: 12, border: '2px solid #ffa726', borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50' }}>Court Name:</label>
                <input type="text" value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="Enter court name" style={{ width: '100%', padding: 12, border: '2px solid #ffa726', borderRadius: 8, fontSize: 14 }} />
              </div>
            </div>
            {documentType === 'Discovery Request' && (
              <div style={{ marginTop: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50' }}>Discovery Type:</label>
                <select value={discoveryType} onChange={(e) => setDiscoveryType(e.target.value)} style={{ width: '100%', padding: 12, border: '2px solid #ffa726', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
                  <option value="interrogatories">Interrogatories</option>
                  <option value="requests_for_production">Requests for Production of Documents</option>
                  <option value="requests_for_admission">Requests for Admission</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Claim/Violation pickers */}
        {(documentType === 'Notice of Claim' || documentType === 'Pre-Suit Notice') && (
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>🎯 Claim Type:</label>
            <select value={claimType} onChange={(e) => setClaimType(e.target.value)} style={{ width: '100%', padding: 15, border: '2px solid #e74c3c', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff', cursor: 'pointer' }}>
              {documentType === 'Notice of Claim' && (
                <>
                  <option value="government">Government/Municipal Tort Claim</option>
                  <option value="general">General Civil Liability Claim</option>
                </>
              )}
              {documentType === 'Pre-Suit Notice' && (
                <>
                  <option value="medical">Medical Malpractice</option>
                  <option value="legal">Legal Malpractice</option>
                  <option value="professional">Other Professional Liability</option>
                </>
              )}
            </select>
          </div>
        )}

        {documentType === 'Cease and Desist Letter' && (
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#2c3e50', fontSize: '1.1rem' }}>⚠️ Violation Type:</label>
            <select value={violationType} onChange={(e) => setViolationType(e.target.value)} style={{ width: '100%', padding: 15, border: '2px solid #e74c3c', borderRadius: 12, fontSize: 16, color: '#000', backgroundColor: '#fff', cursor: 'pointer' }}>
              <option value="harassment">Harassment/Intimidation/Stalking</option>
              <option value="intellectual_property">Intellectual Property Infringement</option>
              <option value="debt_collection">Improper Debt Collection Practices</option>
              <option value="trespass">Trespass/Property Rights Violations</option>
              <option value="defamation">Defamation/Libel/False Statements</option>
              <option value="contract">Contract Violations/Breach</option>
              <option value="privacy">Privacy Violations/Identity Theft</option>
            </select>
          </div>
        )}

        {/* Auto-populated legal info */}
        {selectedState && (
          <div style={{ backgroundColor: '#e8f5e8', border: '2px solid #27ae60', borderRadius: 15, padding: 25, marginBottom: 30, boxShadow: '0 4px 15px rgba(39,174,96,0.1)' }}>
            <h3 style={{ color: '#27ae60', marginTop: 0, marginBottom: 20, fontSize: '1.3rem', fontWeight: 600 }}>
              📋 Auto-Populated Legal Information for {statePublicRecordsData[selectedState].name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>⚖️ Applicable Statute:</label>
                <div style={{ padding: 12, border: '2px solid #27ae60', borderRadius: 8, fontSize: 14, color: '#000', backgroundColor: '#fff', fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {statute || 'Select document type for statute information'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>⏰ Time Requirement:</label>
                <div style={{ padding: 12, border: '2px solid #27ae60', borderRadius: 8, fontSize: 16, color: '#000', backgroundColor: '#fff', fontWeight: 600 }}>
                  {timeLimit || 'Select document type for time requirements'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>📅 Deadline Calculation:</label>
                <div style={{ padding: 12, border: '2px solid #e74c3c', borderRadius: 8, fontSize: 16, color: '#000', backgroundColor: '#fff5f5', fontWeight: 600 }}>
                  {calculateResponseDate() || 'Select document type for deadline calculation'}
                </div>
              </div>
              {statePublicRecordsData[selectedState]?.updates && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e74c3c', fontSize: '1rem' }}>🚨 2024–2025 Legislative Updates:</label>
                  <div style={{ padding: 12, border: '2px solid #e74c3c', borderRadius: 8, fontSize: 14, color: '#000', backgroundColor: '#fff5f5', fontWeight: 600 }}>
                    {statePublicRecordsData[selectedState].updates}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generateLetter}
          style={{ width: '100%', padding: 20, backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: 12, fontSize: 20, fontWeight: 700, cursor: 'pointer', marginBottom: 30, textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 4px 15px rgba(52,152,219,0.3)' }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2980b9';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(52,152,219,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3498db';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(52,152,219,0.3)';
          }}
        >
          🚀 Generate {documentType === 'ID Rights Card' ? 'Civil Rights Reference Card' : 'Legal Document'}
        </button>

        {/* Output */}
        {generatedLetter && (
          <div style={{ backgroundColor: '#f8f9fa', border: '2px solid #27ae60', borderRadius: 15, padding: 25, boxShadow: '0 4px 15px rgba(39,174,96,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <h3 style={{ color: '#27ae60', margin: 0, fontSize: '1.4rem', fontWeight: 600 }}>📄 Generated {documentType} — 2025 Standards</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    if (documentType === 'ID Rights Card') {
                      const stateName = selectedState ? statePublicRecordsData[selectedState].name : '[STATE NAME]';
                      const rights = selectedState ? stateIDRights[selectedState] : null;
                      const canna = selectedState ? cannabisLaws[selectedState] : null;
                      if (rights) {
                        const cardText = `${stateName} Civil Rights & Laws Reference Card\nStop & ID: ${rights.stopAndID ? 'Yes' : 'No'}\nRecording: ${rights.recording}\nCannabis: ${canna ? canna.status : 'Unknown'}\nLaw: ${rights.law}\nPublic Records Response: ${selectedState ? statePublicRecordsData[selectedState].timeLimit : 'N/A'}`;
                        navigator.clipboard.writeText(cardText);
                      }
                    } else if (typeof generatedLetter === 'string') {
                      navigator.clipboard.writeText(generatedLetter);
                    }
                  }}
                  style={{ padding: '12px 20px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#219a52')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#27ae60')}
                >
                  📋 Copy {documentType === 'ID Rights Card' ? 'Card Info' : 'to Clipboard'}
                </button>

                {documentType === 'ID Rights Card' ? (
                  <>
                    <button
                      onClick={() => {
                        const stateName = selectedState ? statePublicRecordsData[selectedState].name : 'State';
                        const rights = selectedState ? stateIDRights[selectedState] : null;
                        const canna = selectedState ? cannabisLaws[selectedState] : null;
                        if (!rights) return;

                        const canvas = document.createElement('canvas');
                        canvas.width = 800;
                        canvas.height = 600;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;

                        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
                        gradient.addColorStop(0, '#1e3c72');
                        gradient.addColorStop(1, '#2a5298');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, 800, 600);

                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 4;
                        ctx.strokeRect(2, 2, 796, 596);

                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 32px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(stateName.toUpperCase(), 400, 80);
                        ctx.font = 'bold 26px Arial';
                        ctx.fillText('CIVIL RIGHTS & LAWS REFERENCE CARD', 400, 120);

                        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(60, 140);
                        ctx.lineTo(740, 140);
                        ctx.stroke();

                        ctx.font = '18px Arial';
                        ctx.textAlign = 'left';
                        ctx.fillStyle = '#ffd700';
                        ctx.fillText('CONSTITUTIONAL RIGHTS:', 60, 180);

                        ctx.fillStyle = '#fff';
                        ctx.font = '16px Arial';
                        ctx.fillText('• I do not consent to searches', 60, 210);
                        ctx.fillText('• I invoke my right to remain silent', 60, 235);
                        ctx.fillText('• I do not waive any rights', 60, 260);
                        ctx.fillText('• I want a lawyer if detained', 60, 285);

                        ctx.fillStyle = '#ffd700';
                        ctx.font = '18px Arial';
                        ctx.fillText('STATE LAWS:', 60, 330);

                        ctx.fillStyle = '#fff';
                        ctx.font = '14px Arial';
                        ctx.fillText(`Stop & ID: ${rights.stopAndID ? 'YES' : 'NO'}`, 60, 360);
                        ctx.fillText(`Recording: ${rights.recording}`, 60, 385);
                        if (canna) {
                          ctx.fillStyle = '#90EE90';
                          ctx.fillText(`Cannabis: ${canna.status}`, 60, 410);
                          ctx.fillStyle = '#fff';
                        }
                        ctx.fillText(`Public Records: ${selectedState ? statePublicRecordsData[selectedState].timeLimit : 'N/A'}`, 60, 435);

                        ctx.fillStyle = '#ffd700';
                        ctx.font = '18px Arial';
                        ctx.fillText('POLICE ENCOUNTER SCRIPT:', 420, 180);

                        ctx.fillStyle = '#fff';
                        ctx.font = '14px Arial';
                        ctx.fillText('"Officer, am I being detained or free to go?"', 420, 210);
                        ctx.font = '12px Arial';
                        ctx.fillText('If FREE: "I choose to leave now."', 420, 240);
                        ctx.fillText('If DETAINED: "I decline to answer questions."', 420, 270);
                        ctx.fillText('"I do not consent to searches."', 420, 290);
                        if (rights.stopAndID) {
                          ctx.fillText('"Please state the law requiring ID."', 420, 320);
                        } else {
                          ctx.fillText('"I am not required to show ID unless driving', 420, 320);
                          ctx.fillText('or under arrest."', 420, 340);
                        }
                        ctx.fillText('If ARRESTED: "I want a lawyer."', 420, 370);

                        ctx.fillStyle = '#ffd700';
                        ctx.font = '14px Arial';
                        ctx.fillText('EMERGENCY CONTACTS:', 420, 410);
                        ctx.fillStyle = '#fff';
                        ctx.font = '12px Arial';
                        ctx.fillText('Attorney: _______________', 420, 435);
                        ctx.fillText('Emergency: _______________', 420, 455);

                        ctx.fillStyle = 'rgba(255,255,255,0.7)';
                        ctx.font = '12px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(`Generated: ${new Date().toLocaleDateString()} — Civil Rights Toolkit Pro 2025`, 400, 570);

                        canvas.toBlob((blob) => {
                          if (!blob) return;
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${stateName.replace(/\s+/g, '_')}_Civil_Rights_Card.png`;
                          a.click();
                          URL.revokeObjectURL(url);
                        });
                      }}
                      style={{ padding: '12px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c0392b')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e74c3c')}
                    >
                      📸 Download as Image
                    </button>

                    <button
                      onClick={() => {
                        const win = window.open('', '_blank');
                        if (!win) return;
                        const stateName = selectedState ? statePublicRecordsData[selectedState].name : 'State';
                        const rights = selectedState ? stateIDRights[selectedState] : null;
                        const canna = selectedState ? cannabisLaws[selectedState] : null;
                        win.document.write(`
                          <html>
                            <head>
                              <title>${stateName} Civil Rights & Laws Reference Card</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 0.5in; background: white; }
                                .card { width: 3.5in; height: 2.4in; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                                  border: 2px solid #fff; border-radius: 15px; padding: 0.2in; color: white; font-size: 8px; line-height: 1.2;
                                  page-break-inside: avoid; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
                                .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 6px; }
                                .title { font-size: 12px; font-weight: bold; }
                                .subtitle { font-size: 10px; font-weight: 600; }
                                .section { margin-bottom: 6px; }
                                .section-title { font-size: 8px; font-weight: bold; color: #ffd700; margin-bottom: 2px; }
                                .content { font-size: 7px; }
                                .footer { font-size: 6px; text-align: center; margin-top: 8px; opacity: 0.8; }
                                @media print { body { margin: 0; } .card { width: 3.375in; height: 2.25in; font-size: 7px; } }
                              </style>
                            </head>
                            <body>
                              <div class="card">
                                <div class="header">
                                  <div class="title">${stateName.toUpperCase()}</div>
                                  <div class="subtitle">CIVIL RIGHTS & LAWS REFERENCE</div>
                                </div>
                                <div style="display: flex; gap: 8px;">
                                  <div style="flex: 1;">
                                    <div class="section">
                                      <div class="section-title">CONSTITUTIONAL RIGHTS</div>
                                      <div class="content">
                                        • I do not consent to searches<br/>
                                        • I invoke my right to remain silent<br/>
                                        • I do not waive any rights<br/>
                                        • I want a lawyer if detained
                                      </div>
                                    </div>
                                    ${rights ? `
                                    <div class="section">
                                      <div class="section-title">STATE LAWS</div>
                                      <div class="content">
                                        Stop & ID: ${rights.stopAndID ? 'YES' : 'NO'}<br/>
                                        Recording: ${rights.recording}<br/>
                                        ${canna ? `Cannabis: ${canna.status}<br/>` : ''}
                                        Public Records: ${selectedState ? statePublicRecordsData[selectedState].timeLimit : 'N/A'}
                                      </div>
                                    </div>` : ''}
                                  </div>
                                  <div style="flex: 1;">
                                    <div class="section">
                                      <div class="section-title">POLICE ENCOUNTER</div>
                                      <div class="content">
                                        <strong>"Officer, am I being detained or free to go?"</strong><br/><br/>
                                        <strong>If FREE:</strong> "I choose to leave now."<br/><br/>
                                        <strong>If DETAINED:</strong> "I decline to answer questions. I do not consent to searches."<br/><br/>
                                        <strong>If ARRESTED:</strong> "I want a lawyer."<br/><br/>
                                        <strong>EMERGENCY:</strong><br/>
                                        Attorney: ___________<br/>
                                        Contact: ___________
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="footer">Generated: ${new Date().toLocaleDateString()} — Civil Rights Toolkit Pro 2025</div>
                              </div>
                            </body>
                          </html>
                        `);
                        win.document.close();
                        win.print();
                      }}
                      style={{ padding: '12px 20px', backgroundColor: '#f39c12', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e67e22')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f39c12')}
                    >
                      🖨️ Print Wallet Card
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      if (typeof generatedLetter !== 'string') return;
                      const blob = new Blob([generatedLetter], { type: 'text/plain' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      const todayStr = new Date().toLocaleDateString().replace(/\//g, '-');
                      a.download = `${documentType.replace(/\s+/g, '_')}_${todayStr}.txt`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    style={{ padding: '12px 20px', backgroundColor: '#8e44ad', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#7d3c98')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#8e44ad')}
                  >
                    💾 Download as Text File
                  </button>
                )}
              </div>
            </div>

            {documentType === 'ID Rights Card' ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa', borderRadius: 12 }}>
                <div id="id-rights-card-display">{generatedLetter}</div>
              </div>
            ) : (
              typeof generatedLetter === 'string' && (
                <textarea
                  value={generatedLetter}
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  style={{ width: '100%', height: 600, padding: 20, border: '2px solid #27ae60', borderRadius: 12, fontSize: 14, color: '#000', backgroundColor: '#fff', fontFamily: 'monospace', lineHeight: 1.6, resize: 'vertical', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}
                />
              )
            )}

            <div style={{ marginTop: 15, padding: 15, backgroundColor: documentType === 'ID Rights Card' ? '#e3f2fd' : '#fff3cd', border: documentType === 'ID Rights Card' ? '1px solid #2196f3' : '1px solid #ffeaa7', borderRadius: 8, fontSize: 14, color: documentType === 'ID Rights Card' ? '#1565c0' : '#856404' }}>
              <strong>💡 {documentType === 'ID Rights Card' ? 'Civil Rights Reference Card:' : 'Attorney-Level Legal Notice:'}</strong>{' '}
              {documentType === 'ID Rights Card'
                ? "Includes state stop-and-identify, recording consent, cannabis status, and public-records response timeframe. Wallet-size for quick reference."
                : `Templates include placeholders and generalized timing/statute fields. Verify current law in ${selectedState ? statePublicRecordsData[selectedState].name : 'your jurisdiction' } before use.`}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 30, padding: 20, backgroundColor: '#f8f9fa', border: '2px solid #6c757d', borderRadius: 12, fontSize: 12, color: '#495057', textAlign: 'center' }}>
          <strong>⚖️ CIVIL RIGHTS LEGAL TOOLKIT — PROFESSIONAL USE</strong><br />
          These templates are informational and for document generation. Laws change; verify statutes, deadlines, and procedures through primary sources or counsel. This is not legal advice.
        </div>
      </div>
    </div>
  );
};

export default LegalToolkit;
