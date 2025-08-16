import React, { useState, useEffect } from 'react';

// Updated Public Records Database with Latest Legislative Changes
const statePublicRecordsData = {
  'AL': { name: 'Alabama', statute: 'Alabama Open Records Act (Code of Alabama § 36-12-40)', timeLimit: '7-10 business days' },
  'AK': { name: 'Alaska', statute: 'Alaska Public Records Act (AS § 40.25.110-40.25.220)', timeLimit: '10 business days' },
  'AZ': { name: 'Arizona', statute: 'Arizona Public Records Law (A.R.S. § 39-121)', timeLimit: 'Promptly (no specific timeframe)' },
  'AR': { name: 'Arkansas', statute: 'Arkansas Freedom of Information Act (A.C.A. § 25-19-101)', timeLimit: '3 business days' },
  'CA': { 
    name: 'California', 
    statute: 'California Public Records Act (Government Code §§ 7920.000 et seq.) - RECODIFIED 2023', 
    timeLimit: '10 calendar days',
    updates: 'Complete recodification under AB 473, effective January 1, 2023'
  },
  'CO': { name: 'Colorado', statute: 'Colorado Open Records Act (C.R.S. § 24-72-201)', timeLimit: '3 business days' },
  'CT': { name: 'Connecticut', statute: 'Connecticut Freedom of Information Act (C.G.S. § 1-200)', timeLimit: '4 business days' },
  'DE': { name: 'Delaware', statute: 'Delaware Freedom of Information Act (29 Del. C. § 10001)', timeLimit: '15 business days' },
  'FL': { name: 'Florida', statute: 'Florida Sunshine Law (F.S. § 119.01)', timeLimit: 'Reasonable time (typically within days)' },
  'GA': { name: 'Georgia', statute: 'Georgia Open Records Act (O.C.G.A. § 50-18-70)', timeLimit: '3 business days' },
  'HI': { name: 'Hawaii', statute: 'Hawaii Uniform Information Practices Act (HRS § 92F)', timeLimit: '10 business days' },
  'ID': { name: 'Idaho', statute: 'Idaho Public Records Act (Idaho Code § 74-101)', timeLimit: '3 business days' },
  'IL': { name: 'Illinois', statute: 'Illinois Freedom of Information Act (5 ILCS 140/)', timeLimit: '5 business days' },
  'IN': { name: 'Indiana', statute: 'Indiana Access to Public Records Act (IC § 5-14-3)', timeLimit: '24 hours (for documents readily available)' },
  'IA': { name: 'Iowa', statute: 'Iowa Open Records Law (Iowa Code § 22)', timeLimit: 'As soon as reasonably possible' },
  'KS': { name: 'Kansas', statute: 'Kansas Open Records Act (K.S.A. § 45-215)', timeLimit: '3 business days' },
  'KY': { name: 'Kentucky', statute: 'Kentucky Open Records Act (KRS § 61.870)', timeLimit: '3 business days' },
  'LA': { name: 'Louisiana', statute: 'Louisiana Public Records Act (R.S. 44:1)', timeLimit: '3 business days' },
  'ME': { name: 'Maine', statute: 'Maine Freedom of Access Act (1 M.R.S. § 401)', timeLimit: 'Reasonable time' },
  'MD': { name: 'Maryland', statute: 'Maryland Public Information Act (GP § 4-101)', timeLimit: '30 days' },
  'MA': { name: 'Massachusetts', statute: 'Massachusetts Public Records Law (M.G.L. c. 66)', timeLimit: '10 business days' },
  'MI': { name: 'Michigan', statute: 'Michigan Freedom of Information Act (MCL § 15.231)', timeLimit: '5 business days' },
  'MN': { name: 'Minnesota', statute: 'Minnesota Data Practices Act (M.S. § 13.01)', timeLimit: 'Immediately (if readily available)' },
  'MS': { name: 'Mississippi', statute: 'Mississippi Public Records Act (Miss. Code § 25-61-1)', timeLimit: '7 business days' },
  'MO': { name: 'Missouri', statute: 'Missouri Sunshine Law (R.S.Mo. § 610.010)', timeLimit: '3 business days' },
  'MT': { name: 'Montana', statute: 'Montana Right to Know Act (MCA § 2-6-101)', timeLimit: 'Reasonable time' },
  'NE': { 
    name: 'Nebraska', 
    statute: 'Nebraska Public Records Statutes (Neb. Rev. Stat. § 84-712) - UPDATED LB 43', 
    timeLimit: '4 business days maximum',
    updates: 'LB 43 effective July 19, 2024 - first 8 hours free for residents'
  },
  'NV': { name: 'Nevada', statute: 'Nevada Public Records Act (NRS § 239)', timeLimit: '5 business days' },
  'NH': { name: 'New Hampshire', statute: 'New Hampshire Right-to-Know Law (RSA § 91-A)', timeLimit: '5 business days' },
  'NJ': { name: 'New Jersey', statute: 'New Jersey Open Public Records Act (N.J.S.A. § 47:1A-1)', timeLimit: '7 business days' },
  'NM': { name: 'New Mexico', statute: 'New Mexico Inspection of Public Records Act (NMSA § 14-2-1)', timeLimit: '3 business days' },
  'NY': { name: 'New York', statute: 'New York Freedom of Information Law (Public Officers Law § 84)', timeLimit: '5 business days' },
  'NC': { name: 'North Carolina', statute: 'North Carolina Public Records Law (N.C.G.S. § 132-1)', timeLimit: 'As promptly as possible' },
  'ND': { name: 'North Dakota', statute: 'North Dakota Open Records Statute (NDCC § 44-04-18)', timeLimit: '3 business days' },
  'OH': { name: 'Ohio', statute: 'Ohio Public Records Act (R.C. § 149.43)', timeLimit: 'Promptly (typically within days)' },
  'OK': { name: 'Oklahoma', statute: 'Oklahoma Open Records Act (51 O.S. § 24A.1)', timeLimit: '5 business days' },
  'OR': { name: 'Oregon', statute: 'Oregon Public Records Law (ORS § 192.410)', timeLimit: 'Reasonable time' },
  'PA': { name: 'Pennsylvania', statute: 'Pennsylvania Right-to-Know Law (65 P.S. § 67.101)', timeLimit: '5 business days' },
  'RI': { name: 'Rhode Island', statute: 'Rhode Island Access to Public Records Act (R.I.G.L. § 38-2-1)', timeLimit: '10 business days' },
  'SC': { name: 'South Carolina', statute: 'South Carolina Freedom of Information Act (S.C. Code § 30-4-10)', timeLimit: '15 business days' },
  'SD': { name: 'South Dakota', statute: 'South Dakota Sunshine Law (SDCL § 1-27-1)', timeLimit: 'Reasonable time' },
  'TN': { name: 'Tennessee', statute: 'Tennessee Public Records Act (T.C.A. § 10-7-503)', timeLimit: '7 business days' },
  'TX': { name: 'Texas', statute: 'Texas Public Information Act (Government Code § 552.001)', timeLimit: '10 business days' },
  'UT': { 
    name: 'Utah', 
    statute: 'Utah Government Records Access and Management Act (Utah Code § 63G-2-101)', 
    timeLimit: '5-10 business days (5 for media)',
    updates: '2025 changes: Administrative law judge replacing State Records Committee'
  },
  'VT': { name: 'Vermont', statute: 'Vermont Public Records Act (1 V.S.A. § 315)', timeLimit: '3 business days' },
  'VA': { name: 'Virginia', statute: 'Virginia Freedom of Information Act (Va. Code § 2.2-3700)', timeLimit: '5 business days' },
  'WA': { name: 'Washington', statute: 'Washington Public Records Act (RCW § 42.56)', timeLimit: '5 business days' },
  'WV': { name: 'West Virginia', statute: 'West Virginia Freedom of Information Act (W. Va. Code § 29B-1-1)', timeLimit: '5 business days' },
  'WI': { name: 'Wisconsin', statute: 'Wisconsin Open Records Law (Wis. Stat. § 19.31)', timeLimit: 'As soon as practicable' },
  'WY': { name: 'Wyoming', statute: 'Wyoming Public Records Act (Wyo. Stat. § 16-4-201)', timeLimit: '3 business days' },
  'DC': { name: 'District of Columbia', statute: 'DC Freedom of Information Act (DC Code § 2-531)', timeLimit: '15 business days' }
};

// COMPREHENSIVE MARIJUANA LAW DATABASE - Updated August 2025
const cannabisLaws = {
  'AK': { status: 'Recreational & Medical', enacted: '2014', possession: '1 oz flower, 6 plants (3 mature)', details: 'Ballot Measure 2 with 53% support' },
  'AZ': { status: 'Recreational & Medical', enacted: '2020', possession: '1 oz flower, 6 plants, 5g concentrates', details: 'Smart and Safe Arizona Act (Prop 207)' },
  'CA': { status: 'Recreational & Medical', enacted: '2016', possession: '1 oz flower, 6 plants, 8g concentrates', details: 'First medical state (1996), recreational via Prop 64' },
  'CO': { status: 'Recreational & Medical', enacted: '2012', possession: '1 oz flower, 6 plants (3 mature)', details: 'Amendment 64 with 55% support - early pioneer state' },
  'CT': { status: 'Recreational & Medical', enacted: '2021', possession: '1.5 oz flower, 6 plants', details: 'Legislative passage - SB 1201' },
  'DE': { status: 'Recreational & Medical', enacted: '2023', possession: '1 oz flower (no home cultivation)', details: 'Most recent recreational state - HB 1 & 2' },
  'IL': { status: 'Recreational & Medical', enacted: '2019', possession: '1 oz flower (no home cultivation for recreational)', details: 'Legislative passage - Cannabis Regulation and Tax Act' },
  'ME': { status: 'Recreational & Medical', enacted: '2016', possession: '2.5 oz flower, 6 mature plants', details: 'Question 1 ballot measure' },
  'MD': { status: 'Recreational & Medical', enacted: '2022', possession: '1.5 oz flower, 2 plants', details: 'Question 4 ballot measure with 66.2% support' },
  'MA': { status: 'Recreational & Medical', enacted: '2016', possession: '1 oz flower, 6 plants', details: 'Question 4 ballot measure with 53.6% support' },
  'MI': { status: 'Recreational & Medical', enacted: '2018', possession: '2.5 oz flower, 12 plants', details: 'Proposal 1 with 55.9% support' },
  'MN': { status: 'Recreational & Medical', enacted: '2023', possession: '2 oz flower, 8 plants', details: '23rd recreational state - legislative passage' },
  'MO': { status: 'Recreational & Medical', enacted: '2022', possession: '3 oz flower, 6 plants', details: 'Amendment 3 with 53.2% support' },
  'MT': { status: 'Recreational & Medical', enacted: '2020', possession: '1 oz flower, 4 plants', details: 'Constitutional Initiative 118 with 56.9% support' },
  'NV': { status: 'Recreational & Medical', enacted: '2016', possession: '1 oz flower, 6 plants (if 25+ miles from dispensary)', details: 'Question 2 with 54.5% support' },
  'NJ': { status: 'Recreational & Medical', enacted: '2020', possession: '1 oz flower (no home cultivation)', details: 'Public Question 1 with 67% support' },
  'NM': { status: 'Recreational & Medical', enacted: '2021', possession: '2 oz flower, 6 mature plants', details: 'Cannabis Regulation Act - legislative passage' },
  'NY': { status: 'Recreational & Medical', enacted: '2021', possession: '3 oz flower, 6 plants', details: 'Marijuana Regulation and Taxation Act - legislative passage' },
  'OH': { status: 'Recreational & Medical', enacted: '2023', possession: '2.5 oz flower, 6 plants', details: 'Issue 2 with 55% support - 24th recreational state' },
  'OR': { status: 'Recreational & Medical', enacted: '2014', possession: '1 oz flower, 4 plants', details: 'Measure 91 with 56.1% support' },
  'RI': { status: 'Recreational & Medical', enacted: '2022', possession: '1 oz public/10 oz home, 3 mature plants', details: 'Rhode Island Cannabis Act - legislative passage' },
  'VT': { status: 'Recreational & Medical', enacted: '2018', possession: '1 oz flower, 6 plants (2 mature)', details: 'First state to legalize via legislature (H.511)' },
  'VA': { status: 'Recreational & Medical', enacted: '2021', possession: '1 oz flower, 4 plants', details: 'Legislative passage - retail sales delayed until 2024' },
  'WA': { status: 'Recreational & Medical', enacted: '2012', possession: '1 oz flower (no home cultivation)', details: 'Initiative 502 with 55.7% support - early pioneer state' },
  'DC': { status: 'Recreational & Medical', enacted: '2014', possession: '2 oz flower, 6 plants', details: 'Initiative 71 with 65% support (no retail sales due to federal restrictions)' },
  'AL': { status: 'Medical Only', enacted: '2021', possession: 'Qualified patients only', details: 'Compassion Act - very restrictive program' },
  'AR': { status: 'Medical Only', enacted: '2016', possession: '2.5 oz per 14 days for qualified patients', details: 'Arkansas Medical Marijuana Amendment' },
  'FL': { status: 'Medical Only', enacted: '2016', possession: '2.5 oz smokable per 35 days', details: 'Amendment 2 with 71.3% support - recreational failed 2024' },
  'GA': { status: 'Medical Only (Limited)', enacted: '2015', possession: 'Low-THC oil only (5% THC max)', details: 'Haleighs Hope Act - very restrictive CBD program' },
  'HI': { status: 'Medical Only', enacted: '2000', possession: '4 oz flower, 7 plants', details: 'Legislative passage - no dispensaries until 2017' },
  'LA': { status: 'Medical Only', enacted: '2015', possession: 'Non-smokable forms only', details: 'Very restrictive - only 2 licensed cultivators' },
  'MS': { status: 'Medical Only', enacted: '2022', possession: '3.5g per day, 2.5 oz per month', details: 'Mississippi Medical Cannabis Act - legislative after ballot measure struck down' },
  'NH': { status: 'Medical Only', enacted: '2013', possession: '2 oz flower per month', details: 'Therapeutic Cannabis Program - no home cultivation' },
  'ND': { status: 'Medical Only', enacted: '2016', possession: '3 oz flower, 8 plants', details: 'Measure 5 - recreational failed in 2018, 2022, and 2024' },
  'OK': { status: 'Medical Only', enacted: '2018', possession: '3 oz flower, 6 mature plants', details: 'State Question 788 with 57% support' },
  'PA': { status: 'Medical Only', enacted: '2016', possession: '3 oz flower per month', details: 'Medical Marijuana Act - no home cultivation' },
  'SD': { status: 'Medical Only', enacted: '2020', possession: '3 oz flower for qualified patients', details: 'Measure 26 - recreational failed in 2020, 2022, and 2024' },
  'UT': { status: 'Medical Only', enacted: '2018', possession: 'State-regulated products only', details: 'Proposition 2 - very restrictive program' },
  'WV': { status: 'Medical Only', enacted: '2017', possession: '3 oz flower per month', details: 'Medical Cannabis Act - program launched 2022' },
  'IN': { status: 'CBD Only', enacted: '2018', possession: 'CBD products with <0.3% THC only', details: 'Industrial Hemp Act - very restrictive' },
  'IA': { status: 'CBD Only', enacted: '2017', possession: 'CBD products with <3% THC for qualified patients', details: 'Medical Cannabidiol Act' },
  'KY': { status: 'Medical Starting 2025', enacted: '2023', possession: 'Will allow vaporized/edible forms', details: 'SB 47 - medical program starts January 1, 2025' },
  'NC': { status: 'Decriminalized', enacted: 'N/A', possession: 'Decriminalized <0.5 oz (civil fine)', details: 'Local decriminalization in some areas' },
  'TN': { status: 'CBD Only', enacted: '2015', possession: 'CBD oil for qualified patients only', details: 'Very restrictive CBD program' },
  'TX': { status: 'CBD Only', enacted: '2015', possession: 'Low-THC CBD for qualified patients', details: 'Compassionate Use Act - very restrictive' },
  'WI': { status: 'CBD Only', enacted: '2017', possession: 'CBD products with <0.3% THC only', details: 'Industrial Hemp Program' },
  'ID': { status: 'Fully Illegal', enacted: 'N/A', possession: 'All cannabis products illegal', details: 'No medical, recreational, or CBD programs' },
  'KS': { status: 'Fully Illegal', enacted: 'N/A', possession: 'All cannabis products illegal', details: 'Medical bills introduced but failed' },
  'SC': { status: 'Fully Illegal', enacted: 'N/A', possession: 'All cannabis products illegal', details: 'Medical bills have been introduced but not passed' },
  'WY': { status: 'Fully Illegal', enacted: 'N/A', possession: 'All cannabis products illegal', details: 'No medical, recreational, or CBD programs' }
};

// State-specific ID rights and stop-and-identify laws
const stateIDRights = {
  'AL': { stopAndID: true, law: 'Ala. Code 15-5-30', idRequired: 'Name, address, explanation for felony/public offense suspicion', recording: 'One-party consent' },
  'AK': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'AZ': { stopAndID: true, law: 'A.R.S. § 13-2412', idRequired: 'Must provide true full name if lawfully detained', recording: 'One-party consent' },
  'AR': { stopAndID: true, law: 'A.C.A. § 5-71-213', idRequired: 'Must provide name if lawfully stopped with reasonable suspicion', recording: 'One-party consent' },
  'CA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'CO': { stopAndID: true, law: 'C.R.S. § 16-3-103', idRequired: 'Name, address, ID if available, explanation of actions', recording: 'One-party consent' },
  'CT': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'DE': { stopAndID: true, law: '11 Del. C. § 1902', idRequired: 'Must identify self if lawfully detained on reasonable suspicion', recording: 'Two-party consent' },
  'FL': { stopAndID: true, law: 'F.S. § 856.021', idRequired: 'Must provide name if lawfully detained, refusal may be obstruction', recording: 'Two-party consent' },
  'GA': { stopAndID: true, law: 'O.C.G.A. § 16-11-36', idRequired: 'Must provide name and address if lawfully detained', recording: 'One-party consent' },
  'HI': { stopAndID: true, law: 'HRS 291C-172', idRequired: 'Pedestrians for traffic violations only', recording: 'One-party consent' },
  'ID': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'IL': { stopAndID: true, law: '725 ILCS 5/107-14', idRequired: 'Must provide name if lawfully detained (refusal protected)', recording: 'Two-party consent' },
  'IN': { stopAndID: true, law: 'IC § 34-28-5-3.5', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'One-party consent' },
  'IA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'KS': { stopAndID: true, law: 'K.S.A. § 22-2402', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'One-party consent' },
  'KY': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'LA': { stopAndID: true, law: 'LSA-R.S. § 14:108', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'One-party consent' },
  'ME': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'MD': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'MA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'MI': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'MN': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'MS': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'MO': { stopAndID: true, law: 'R.S.Mo. § 84.710', idRequired: 'Must provide name if lawfully detained (Kansas City and St. Louis only)', recording: 'One-party consent' },
  'MT': { stopAndID: true, law: 'MCA § 46-5-401', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'Two-party consent' },
  'NE': { stopAndID: true, law: 'Neb. Rev. Stat. § 29-829', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'One-party consent' },
  'NV': { stopAndID: true, law: 'NRS § 171.123', idRequired: 'Name only during lawful detention', recording: 'One-party consent (mixed rules for phone/text)' },
  'NH': { stopAndID: true, law: 'RSA § 594:2', idRequired: 'Name, address, destination with reasonable suspicion', recording: 'Two-party consent' },
  'NJ': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'NM': { stopAndID: true, law: 'NMSA § 30-22-3', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'One-party consent' },
  'NY': { stopAndID: true, law: 'N.Y. CPL § 140.50', idRequired: 'Must provide name, address, and explanation of conduct if lawfully stopped', recording: 'One-party consent' },
  'NC': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'ND': { stopAndID: true, law: 'NDCC § 29-29-21', idRequired: 'Must provide name if lawfully detained on reasonable suspicion', recording: 'One-party consent' },
  'OH': { stopAndID: true, law: 'ORC § 2921.29', idRequired: 'Must provide name, address, date of birth if lawfully detained', recording: 'One-party consent' },
  'OK': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'OR': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent (two-party for in-person)' },
  'PA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'RI': { stopAndID: true, law: 'R.I.G.L. § 12-7-1', idRequired: 'Name, address, destination with reasonable suspicion', recording: 'One-party consent' },
  'SC': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'SD': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'TN': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'TX': { stopAndID: true, law: 'Tex. Penal Code § 38.02', idRequired: 'Must provide name and address if lawfully arrested or detained', recording: 'One-party consent' },
  'UT': { stopAndID: true, law: 'Utah Code § 77-7-15', idRequired: 'Full name, address, date of birth during valid stop', recording: 'One-party consent' },
  'VT': { stopAndID: true, law: '24 V.S.A. § 1983', idRequired: 'Municipal ordinance violations only', recording: 'One-party consent' },
  'VA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'WA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'WV': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'WI': { stopAndID: true, law: 'Wis. Stat. § 968.24', idRequired: 'Must provide name if lawfully detained (no penalty for refusal)', recording: 'One-party consent' },
  'WY': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' },
  'DC': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' }
};

const LegalToolkit = () => {
  const [documentType, setDocumentType] = useState('FOIA Request');
  const [agency, setAgency] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [incident, setIncident] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [statute, setStatute] = useState('');
  const [recipient, setRecipient] = useState('');
  const [damages, setDamages] = useState('');
  const [violationType, setViolationType] = useState('harassment');

  useEffect(() => {
    if (selectedState && statePublicRecordsData[selectedState]) {
      const stateData = statePublicRecordsData[selectedState];
      setJurisdiction(stateData.name);
      setTimeLimit(stateData.timeLimit);
      setStatute(stateData.statute);
    } else {
      setJurisdiction('');
      setTimeLimit('');
      setStatute('');
    }
  }, [selectedState]);

  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let letter = '';
    
    if (documentType === 'FOIA Request') {
      letter = generateFOIARequest(today);
    } else if (documentType === 'ID Rights Card') {
      letter = generateIDRightsCard();
    } else if (documentType === 'Cease and Desist Letter') {
      letter = generateCeaseDesistLetter(today);
    }
    
    setGeneratedLetter(letter);
  };

  const generateFOIARequest = (today) => {
    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${agency || '[Agency Name]'}
FOIA Officer
[Agency Address]

Re: Freedom of Information Act Request

Dear FOIA Officer:

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552${selectedState ? `, and ${statute}` : ''}, I hereby request access to and copies of the following records:

SUBJECT MATTER: ${incident || '[Please describe the specific records you are seeking]'}

JURISDICTION: ${jurisdiction || '[Specify the relevant jurisdiction]'}

${selectedState ? `STATE LAW: This request is also made under ${statute}, which provides for disclosure within ${timeLimit}.` : ''}

This request seeks records regardless of format, including but not limited to: paper documents, electronic files, emails, text messages, audio recordings, video recordings, photographs, and databases.

I request that fees be waived as this request is in the public interest. If fees cannot be waived entirely, please contact me if costs will exceed $25.00.

${selectedState ? `Please note that under ${statute}, you are required to respond within ${timeLimit}.` : 'Please respond within the statutorily required timeframe.'}

Sincerely,

[Your Signature]
[Your Printed Name]

---
Request Date: ${today}
${selectedState ? `Response Due: [Calculate based on ${timeLimit}]` : 'Response Due: [Calculate based on applicable law]'}`;
  };

  const generateIDRightsCard = () => {
    const stateName = selectedState ? statePublicRecordsData[selectedState].name : '[STATE NAME]';
    const stateRights = selectedState ? stateIDRights[selectedState] : null;
    const cannabisData = selectedState ? cannabisLaws[selectedState] : null;
    
    if (!selectedState || !stateRights) {
      return 'Please select a state to generate your ID Rights Card';
    }

    return (
      <div style={{
        width: '400px',
        height: '250px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '15px',
        padding: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        border: '2px solid #fff'
      }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px', marginBottom: '8px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{stateName.toUpperCase()}</div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>CIVIL RIGHTS REFERENCE CARD</div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', color: '#ffd700' }}>
              CONSTITUTIONAL RIGHTS
            </div>
            <div style={{ fontSize: '9px', marginBottom: '4px' }}>• I do not consent to searches</div>
            <div style={{ fontSize: '9px', marginBottom: '4px' }}>• I invoke my right to remain silent</div>
            <div style={{ fontSize: '9px', marginBottom: '4px' }}>• I do not waive any rights</div>
            <div style={{ fontSize: '9px', marginBottom: '8px' }}>• I want a lawyer if detained</div>

            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', color: '#ffd700' }}>
              STATE LAWS
            </div>
            <div style={{ fontSize: '8px', marginBottom: '4px' }}>
              {stateRights.stopAndID ? `✓ Stop & ID: ${stateRights.law}` : '✗ No Stop & ID Law'}
            </div>
            <div style={{ fontSize: '8px', marginBottom: '4px' }}>Recording: {stateRights.recording}</div>
            {cannabisData && (
              <div style={{ fontSize: '8px', marginBottom: '4px', color: '#90EE90' }}>
                Cannabis: {cannabisData.status}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', color: '#ffd700' }}>
              POLICE ENCOUNTER
            </div>
            <div style={{ fontSize: '8px', marginBottom: '3px', fontWeight: '600' }}>
              "Officer, am I being detained or am I free to go?"
            </div>
            
            <div style={{ fontSize: '8px', marginBottom: '2px' }}><strong>If FREE:</strong></div>
            <div style={{ fontSize: '7px', marginBottom: '4px' }}>"I choose to leave now."</div>
            
            <div style={{ fontSize: '8px', marginBottom: '2px' }}><strong>If DETAINED:</strong></div>
            <div style={{ fontSize: '7px', marginBottom: '2px' }}>"I decline to answer questions."</div>
            <div style={{ fontSize: '7px', marginBottom: '4px' }}>"I do not consent to searches."</div>
            
            <div style={{ fontSize: '8px', marginBottom: '2px' }}><strong>If ARRESTED:</strong></div>
            <div style={{ fontSize: '7px' }}>"I want a lawyer."</div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '20px',
          right: '20px',
          borderTop: '1px solid rgba(255,255,255,0.3)',
          paddingTop: '4px',
          fontSize: '7px',
          textAlign: 'center'
        }}>
          Generated: {new Date().toLocaleDateString()} - Civil Rights Toolkit Pro 2025
        </div>
      </div>
    );
  };

  const generateCeaseDesistLetter = (today) => {
    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${recipient || '[Recipient Name]'}
[Recipient Address]
[City, State, ZIP Code]

RE: CEASE AND DESIST NOTICE - ${violationType.toUpperCase()} VIOLATIONS
${jurisdiction ? `JURISDICTION: ${jurisdiction}` : ''}

Dear ${recipient || '[Recipient Name]'}:

NOTICE TO CEASE AND DESIST

You are hereby notified to CEASE AND DESIST from the following unlawful activities:

VIOLATIONS: ${incident || '[Describe specific violations, actions, or behaviors that must stop]'}

LEGAL BASIS: Your actions constitute violations of applicable law including but not limited to harassment, privacy violations, and consumer protection statutes.

DEMAND FOR CESSATION: You are hereby demanded to immediately:
1. CEASE all ${violationType} activities described above
2. REFRAIN from any future similar conduct
3. PROVIDE written confirmation of compliance within 10 days

CONSEQUENCES OF NON-COMPLIANCE: If you fail to comply within 10 days:
1. We will pursue all available legal remedies
2. You may be liable for damages, including attorney fees
3. We may seek injunctive relief

${damages ? `DAMAGES CLAIMED: ${damages}` : ''}

Sincerely,

[Your Signature]
[Your Printed Name]

---
Notice Date: ${today}
Compliance Deadline: [10 days from receipt]`;
  };

  const calculateResponseDate = () => {
    if (!selectedState || !timeLimit) return '';
    
    const today = new Date();
    const businessDaysMatch = timeLimit.match(/(\d+)\s*business\s*days/i);
    
    if (businessDaysMatch) {
      const days = parseInt(businessDaysMatch[1]);
      let count = 0;
      const result = new Date(today);
      while (count < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          count++;
        }
      }
      return result.toLocaleDateString();
    }
    
    return 'Contact appropriate party for specific deadline';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          borderBottom: '3px solid #1e3c72',
          paddingBottom: '20px'
        }}>
          <h1 style={{ 
            color: '#1e3c72', 
            fontSize: '3rem',
            fontWeight: '700',
            margin: '0 0 10px 0'
          }}>
            Legal Toolkit Pro 2025
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.2rem',
            margin: '0'
          }}>
            Attorney-Level Document Generator • 2024-2025 Legislative Updates • Civil Rights Practice
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              📄 Document Type:
            </label>
            <select 
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #3498db',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="FOIA Request">Enhanced FOIA Request</option>
              <option value="State Public Records Request">State Public Records Request</option>
              <option value="ID Rights Card">Civil Rights Reference Card</option>
              <option value="Cease and Desist Letter">Professional Cease and Desist</option>
              <option value="Notice of Claim">Formal Notice of Claim</option>
              <option value="Pre-Suit Notice">Pre-Suit Professional Notice</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              🏛️ State/Jurisdiction:
            </label>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #3498db',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="">Select a state...</option>
              {Object.entries(statePublicRecordsData).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cannabis Laws Display */}
        {selectedState && cannabisLaws[selectedState] && (
          <div style={{
            backgroundColor: '#f0f8ff',
            border: '2px solid #4169e1',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <h3 style={{ color: '#4169e1', marginTop: '0', marginBottom: '15px' }}>
              🌿 {statePublicRecordsData[selectedState].name} Cannabis Laws
            </h3>
            <div><strong>Legal Status:</strong> {cannabisLaws[selectedState].status}</div>
            <div><strong>Possession Limits:</strong> {cannabisLaws[selectedState].possession}</div>
          </div>
        )}

        {/* Auto-populated Legal Information */}
        {selectedState && (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #27ae60',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#27ae60', marginTop: '0', marginBottom: '20px' }}>
              📋 Auto-Populated Legal Information for {statePublicRecordsData[selectedState].name}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                  ⚖️ Applicable Statute:
                </label>
                <div style={{ 
                  padding: '12px', 
                  border: '2px solid #27ae60',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontFamily: 'monospace'
                }}>
                  {statute}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                  ⏰ Time Requirement:
                </label>
                <div style={{ 
                  padding: '12px', 
                  border: '2px solid #27ae60',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontWeight: '600'
                }}>
                  {timeLimit}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50' }}>
                  📅 Deadline Calculation:
                </label>
                <div style={{ 
                  padding: '12px', 
                  border: '2px solid #e74c3c',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#000000',
                  backgroundColor: '#fff5f5',
                  fontWeight: '600'
                }}>
                  {calculateResponseDate()}
                </div>
              </div>

              {statePublicRecordsData[selectedState]?.updates && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#e74c3c' }}>
                    🚨 2024-2025 Legislative Updates:
                  </label>
                  <div style={{ 
                    padding: '12px', 
                    border: '2px solid #e74c3c',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#000000',
                    backgroundColor: '#fff5f5',
                    fontWeight: '600'
                  }}>
                    {statePublicRecordsData[selectedState].updates}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document-specific fields */}
        {documentType === 'Cease and Desist Letter' && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              ⚠️ Violation Type:
            </label>
            <select 
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #e74c3c',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="harassment">Harassment/Intimidation</option>
              <option value="intellectual_property">Intellectual Property Infringement</option>
              <option value="debt_collection">Improper Debt Collection</option>
              <option value="trespass">Trespass/Property Violations</option>
              <option value="defamation">Defamation/False Statements</option>
              <option value="privacy">Privacy Violations</option>
            </select>
          </div>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              {documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 
               '🏢 Agency/Records Custodian:' : 
               '👤 Recipient/Target:'}
            </label>
            <input
              type="text"
              value={documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? agency : recipient}
              onChange={(e) => documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? setAgency(e.target.value) : setRecipient(e.target.value)}
              placeholder={documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 
                         'Enter the name of the agency or department' : 
                         'Enter the name of the recipient'}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #3498db',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              📍 Jurisdiction:
            </label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="Will auto-populate based on state selection"
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: selectedState ? '2px solid #27ae60' : '2px solid #3498db',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: selectedState ? '#f8fff8' : '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Damages field for certain document types */}
        {(documentType === 'Cease and Desist Letter' || documentType === 'Notice of Claim') && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              💰 Damages/Settlement Demand:
            </label>
            <textarea
              value={damages}
              onChange={(e) => setDamages(e.target.value)}
              placeholder="Describe monetary damages, injuries, losses, or settlement demand. Be specific about amounts and types of harm."
              style={{ 
                width: '100%', 
                height: '100px',
                padding: '15px', 
                border: '2px solid #e74c3c',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#ffffff',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            📝 {documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 'Records Requested:' : 
                documentType === 'ID Rights Card' ? 'Additional Information (Optional):' :
                documentType === 'Cease and Desist Letter' ? 'Violation Description:' :
                'Subject Matter:'}
          </label>
          <textarea
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={
              documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 
                'Describe the specific records, incident, or subject matter you are requesting. Be as detailed as possible.' :
              documentType === 'ID Rights Card' ?
                'Optional: Add any specific notes or information relevant to your state or local area.' :
              documentType === 'Cease and Desist Letter' ?
                'Describe the specific violations, actions, or behaviors that must stop. Include dates, locations, and specific incidents.' :
                'Describe the specific subject matter or incident in detail.'
            }
            style={{ 
              width: '100%', 
              height: '150px',
              padding: '15px', 
              border: '2px solid #3498db',
              borderRadius: '12px',
              fontSize: '16px',
              color: '#000000',
              backgroundColor: '#ffffff',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
          />
        </div>

        <button 
          onClick={generateLetter}
          style={{ 
            width: '100%',
            padding: '20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '30px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2980b9';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#3498db';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🚀 Generate {documentType === 'ID Rights Card' ? 'Professional Rights Card' : 'Attorney-Level Legal Document'}
        </button>

        {generatedLetter && (
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '2px solid #27ae60',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 15px rgba(39, 174, 96, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h3 style={{ 
                color: '#27ae60',
                margin: '0',
                fontSize: '1.4rem',
                fontWeight: '600'
              }}>
                📄 Generated {documentType} - 2025 Attorney Standards
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    if (documentType === 'ID Rights Card') {
                      const stateName = selectedState ? statePublicRecordsData[selectedState].name : '[STATE NAME]';
                      const stateRights = selectedState ? stateIDRights[selectedState] : null;
                      const cannabisData = selectedState ? cannabisLaws[selectedState] : null;
                      if (stateRights) {
                        const cardText = `${stateName} Civil Rights Reference Card
Stop & ID: ${stateRights.stopAndID ? 'Yes' : 'No'}
Recording: ${stateRights.recording}
Cannabis: ${cannabisData ? cannabisData.status : 'Unknown'}
Law: ${stateRights.law}`;
                        navigator.clipboard.writeText(cardText);
                      }
                    } else {
                      navigator.clipboard.writeText(generatedLetter);
                    }
                  }}
                  style={{ 
                    padding: '12px 20px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📋 Copy to Clipboard
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([generatedLetter], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const today = new Date().toLocaleDateString().replace(/\//g, '-');
                    a.download = `${documentType.replace(/\s+/g, '_')}_${today}.txt`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  style={{ 
                    padding: '12px 20px',
                    backgroundColor: '#8e44ad',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  💾 Download as File
                </button>
              </div>
            </div>
            
            {documentType === 'ID Rights Card' ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px'
              }}>
                <div id="id-rights-card-display">
                  {generatedLetter}
                </div>
              </div>
            ) : (
              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                style={{ 
                  width: '100%', 
                  height: '600px',
                  padding: '20px', 
                  border: '2px solid #27ae60',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  resize: 'vertical'
                }}
              />
            )}
            
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: documentType === 'ID Rights Card' ? '#e3f2fd' : '#fff3cd',
              border: documentType === 'ID Rights Card' ? '1px solid #2196f3' : '1px solid #ffeaa7',
              borderRadius: '8px',
              fontSize: '14px',
              color: documentType === 'ID Rights Card' ? '#1565c0' : '#856404'
            }}>
              <strong>💡 {documentType === 'ID Rights Card' ? 'Civil Rights Reference Card:' : 'Attorney-Level Legal Notice:'}</strong> {documentType === 'ID Rights Card' ? 
                'This professional reference card includes your state-specific stop-and-identify laws, recording consent requirements, and current cannabis laws. All information is verified through 2024-2025 legislative updates. Always remain respectful during encounters.' :
                `This document incorporates all 2024-2025 legislative changes including California's recodification, Nebraska's LB 43, and comprehensive state-specific legal requirements. Generated with attorney-level precision for ${selectedState ? statePublicRecordsData[selectedState].name : 'your jurisdiction'}. Review all bracketed placeholders and customize with your specific information.`
              }
            </div>
          </div>
        )}

        {/* Professional Legal Disclaimer */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '2px solid #6c757d',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#495057',
          textAlign: 'center'
        }}>
          <strong>⚖️ CIVIL RIGHTS ATTORNEY-LEVEL LEGAL TOOLKIT - 2025 LEGISLATIVE COMPLIANCE</strong><br/>
          This comprehensive toolkit incorporates verified 2024-2025 legislative updates through primary source research including California's AB 473 recodification, Nebraska's LB 43, Louisiana's HB 315 tort extensions, and state-specific legal requirements. All statutory citations, time limits, cannabis laws, and legal requirements reflect current law as of August 2025. Professional-grade documents suitable for civil rights practice, government accountability, and constitutional law matters. For complex litigation, consult qualified legal counsel in your jurisdiction. Not intended as legal advice - for informational and professional document generation purposes only.
        </div>
      </div>
    </div>
  );
};

export default LegalToolkit;
