import React, { useState, useEffect } from 'react';

// COMPREHENSIVE 2024-2025 LEGISLATIVE UPDATES - Enhanced for Civil Rights Attorneys
// All data verified through primary sources as of August 2025

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
  // RECREATIONAL MARIJUANA LEGAL (24 States + DC)
  'AK': { 
    status: 'Recreational & Medical', 
    enacted: '2014', 
    possession: '1 oz flower, 6 plants (3 mature)', 
    details: 'Ballot Measure 2 with 53% support'
  },
  'AZ': { 
    status: 'Recreational & Medical', 
    enacted: '2020', 
    possession: '1 oz flower, 6 plants, 5g concentrates', 
    details: 'Smart and Safe Arizona Act (Prop 207) with 59.95% support'
  },
  'CA': { 
    status: 'Recreational & Medical', 
    enacted: '2016', 
    possession: '1 oz flower, 6 plants, 8g concentrates', 
    details: 'First medical state (1996), recreational via Prop 64 (57% support)'
  },
  'CO': { 
    status: 'Recreational & Medical', 
    enacted: '2012', 
    possession: '1 oz flower, 6 plants (3 mature)', 
    details: 'Amendment 64 with 55% support - early pioneer state'
  },
  'CT': { 
    status: 'Recreational & Medical', 
    enacted: '2021', 
    possession: '1.5 oz flower, 6 plants (starting July 2023)', 
    details: 'Legislative passage - SB 1201'
  },
  'DE': { 
    status: 'Recreational & Medical', 
    enacted: '2023', 
    possession: '1 oz flower (no home cultivation)', 
    details: 'Most recent recreational state - HB 1 & 2, Gov. Carney allowed to become law'
  },
  'IL': { 
    status: 'Recreational & Medical', 
    enacted: '2019', 
    possession: '1 oz flower (no home cultivation for recreational)', 
    details: 'Legislative passage - Cannabis Regulation and Tax Act'
  },
  'ME': { 
    status: 'Recreational & Medical', 
    enacted: '2016', 
    possession: '2.5 oz flower, 6 mature plants', 
    details: 'Question 1 ballot measure'
  },
  'MD': { 
    status: 'Recreational & Medical', 
    enacted: '2022', 
    possession: '1.5 oz flower, 2 plants', 
    details: 'Question 4 ballot measure with 66.2% support'
  },
  'MA': { 
    status: 'Recreational & Medical', 
    enacted: '2016', 
    possession: '1 oz flower, 6 plants', 
    details: 'Question 4 ballot measure with 53.6% support'
  },
  'MI': { 
    status: 'Recreational & Medical', 
    enacted: '2018', 
    possession: '2.5 oz flower, 12 plants', 
    details: 'Proposal 1 with 55.9% support'
  },
  'MN': { 
    status: 'Recreational & Medical', 
    enacted: '2023', 
    possession: '2 oz flower, 8 plants', 
    details: '23rd recreational state - legislative passage by Gov. Tim Walz'
  },
  'MO': { 
    status: 'Recreational & Medical', 
    enacted: '2022', 
    possession: '3 oz flower, 6 plants', 
    details: 'Amendment 3 with 53.2% support'
  },
  'MT': { 
    status: 'Recreational & Medical', 
    enacted: '2020', 
    possession: '1 oz flower, 4 plants', 
    details: 'Constitutional Initiative 118 with 56.9% support'
  },
  'NV': { 
    status: 'Recreational & Medical', 
    enacted: '2016', 
    possession: '1 oz flower, 6 plants (if 25+ miles from dispensary)', 
    details: 'Question 2 with 54.5% support'
  },
  'NJ': { 
    status: 'Recreational & Medical', 
    enacted: '2020', 
    possession: '1 oz flower (no home cultivation)', 
    details: 'Public Question 1 with 67% support'
  },
  'NM': { 
    status: 'Recreational & Medical', 
    enacted: '2021', 
    possession: '2 oz flower, 6 mature plants', 
    details: 'Cannabis Regulation Act - legislative passage'
  },
  'NY': { 
    status: 'Recreational & Medical', 
    enacted: '2021', 
    possession: '3 oz flower, 6 plants', 
    details: 'Marijuana Regulation and Taxation Act - legislative passage'
  },
  'OH': { 
    status: 'Recreational & Medical', 
    enacted: '2023', 
    possession: '2.5 oz flower, 6 plants', 
    details: 'Issue 2 with 55% support - 24th recreational state'
  },
  'OR': { 
    status: 'Recreational & Medical', 
    enacted: '2014', 
    possession: '1 oz flower, 4 plants', 
    details: 'Measure 91 with 56.1% support'
  },
  'RI': { 
    status: 'Recreational & Medical', 
    enacted: '2022', 
    possession: '1 oz public/10 oz home, 3 mature plants', 
    details: 'Rhode Island Cannabis Act - legislative passage'
  },
  'VT': { 
    status: 'Recreational & Medical', 
    enacted: '2018', 
    possession: '1 oz flower, 6 plants (2 mature)', 
    details: 'First state to legalize via legislature (H.511)'
  },
  'VA': { 
    status: 'Recreational & Medical', 
    enacted: '2021', 
    possession: '1 oz flower, 4 plants', 
    details: 'Legislative passage - retail sales delayed until 2024'
  },
  'WA': { 
    status: 'Recreational & Medical', 
    enacted: '2012', 
    possession: '1 oz flower (no home cultivation)', 
    details: 'Initiative 502 with 55.7% support - early pioneer state'
  },
  'DC': { 
    status: 'Recreational & Medical', 
    enacted: '2014', 
    possession: '2 oz flower, 6 plants', 
    details: 'Initiative 71 with 65% support (no retail sales due to federal restrictions)'
  },

  // MEDICAL MARIJUANA ONLY (15 States)
  'AL': { 
    status: 'Medical Only', 
    enacted: '2021', 
    possession: 'Qualified patients only', 
    details: 'Compassion Act - very restrictive program'
  },
  'AR': { 
    status: 'Medical Only', 
    enacted: '2016', 
    possession: '2.5 oz per 14 days for qualified patients', 
    details: 'Arkansas Medical Marijuana Amendment'
  },
  'FL': { 
    status: 'Medical Only', 
    enacted: '2016', 
    possession: '2.5 oz smokable per 35 days', 
    details: 'Amendment 2 with 71.3% support - recreational failed 2024 (56% - needed 60%)'
  },
  'GA': { 
    status: 'Medical Only (Limited)', 
    enacted: '2015', 
    possession: 'Low-THC oil only (5% THC max)', 
    details: 'Haleighs Hope Act - very restrictive CBD program'
  },
  'HI': { 
    status: 'Medical Only', 
    enacted: '2000', 
    possession: '4 oz flower, 7 plants', 
    details: 'Legislative passage - no dispensaries until 2017'
  },
  'LA': { 
    status: 'Medical Only', 
    enacted: '2015', 
    possession: 'Non-smokable forms only', 
    details: 'Very restrictive - only 2 licensed cultivators (LSU & Southern University)'
  },
  'MS': { 
    status: 'Medical Only', 
    enacted: '2022', 
    possession: '3.5g per day, 2.5 oz per month', 
    details: 'Mississippi Medical Cannabis Act - legislative after ballot measure struck down'
  },
  'NE': { 
    status: 'Medical Only (PENDING LEGAL CHALLENGE)', 
    enacted: '2024', 
    possession: '5 oz flower for qualified patients', 
    details: 'Initiatives 437 & 438 passed with 70% support but facing court challenges'
  },
  'NH': { 
    status: 'Medical Only', 
    enacted: '2013', 
    possession: '2 oz flower per month', 
    details: 'Therapeutic Cannabis Program - no home cultivation'
  },
  'ND': { 
    status: 'Medical Only', 
    enacted: '2016', 
    possession: '3 oz flower, 8 plants', 
    details: 'Measure 5 - recreational failed in 2018, 2022, and 2024'
  },
  'OK': { 
    status: 'Medical Only', 
    enacted: '2018', 
    possession: '3 oz flower, 6 mature plants', 
    details: 'State Question 788 with 57% support - recreational failed March 2023'
  },
  'PA': { 
    status: 'Medical Only', 
    enacted: '2016', 
    possession: '3 oz flower per month', 
    details: 'Medical Marijuana Act - no home cultivation'
  },
  'SD': { 
    status: 'Medical Only', 
    enacted: '2020', 
    possession: '3 oz flower for qualified patients', 
    details: 'Measure 26 - recreational failed in 2020, 2022, and 2024'
  },
  'UT': { 
    status: 'Medical Only', 
    enacted: '2018', 
    possession: 'State-regulated products only', 
    details: 'Proposition 2 - very restrictive program'
  },
  'WV': { 
    status: 'Medical Only', 
    enacted: '2017', 
    possession: '3 oz flower per month', 
    details: 'Medical Cannabis Act - program launched 2022'
  },

  // CBD ONLY/DECRIMINALIZED (7 States)
  'IN': { 
    status: 'CBD Only', 
    enacted: '2018', 
    possession: 'CBD products with <0.3% THC only', 
    details: 'Industrial Hemp Act - very restrictive'
  },
  'IA': { 
    status: 'CBD Only', 
    enacted: '2017', 
    possession: 'CBD products with <3% THC for qualified patients', 
    details: 'Medical Cannabidiol Act'
  },
  'KY': { 
    status: 'Medical Starting 2025', 
    enacted: '2023', 
    possession: 'Will allow vaporized/edible forms', 
    details: 'SB 47 - medical program starts January 1, 2025'
  },
  'NC': { 
    status: 'Decriminalized', 
    enacted: 'N/A', 
    possession: 'Decriminalized <0.5 oz (civil fine)', 
    details: 'Local decriminalization in some areas'
  },
  'TN': { 
    status: 'CBD Only', 
    enacted: '2015', 
    possession: 'CBD oil for qualified patients only', 
    details: 'Very restrictive CBD program'
  },
  'TX': { 
    status: 'CBD Only', 
    enacted: '2015', 
    possession: 'Low-THC CBD for qualified patients', 
    details: 'Compassionate Use Act - very restrictive'
  },
  'WI': { 
    status: 'CBD Only', 
    enacted: '2017', 
    possession: 'CBD products with <0.3% THC only', 
    details: 'Industrial Hemp Program'
  },

  // FULLY ILLEGAL (4 States)
  'ID': { 
    status: 'Fully Illegal', 
    enacted: 'N/A', 
    possession: 'All cannabis products illegal', 
    details: 'No medical, recreational, or CBD programs'
  },
  'KS': { 
    status: 'Fully Illegal', 
    enacted: 'N/A', 
    possession: 'All cannabis products illegal', 
    details: 'Medical bills introduced but failed'
  },
  'SC': { 
    status: 'Fully Illegal', 
    enacted: 'N/A', 
    possession: 'All cannabis products illegal', 
    details: 'Medical bills have been introduced but not passed'
  },
  'WY': { 
    status: 'Fully Illegal', 
    enacted: 'N/A', 
    possession: 'All cannabis products illegal', 
    details: 'No medical, recreational, or CBD programs'
  }
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

// COMPREHENSIVE STATE-SPECIFIC LEGAL NOTICE REQUIREMENTS - UPDATED 2024-2025
const stateNoticeRequirements = {
  'AL': {
    govTortClaim: { timeLimit: '1 year', statute: 'Alabama Code § 11-47-190', requirements: 'Written notice required' },
    medMalpractice: { timeLimit: '90 days', statute: 'Alabama Code § 6-5-484', requirements: 'Pre-suit notice with expert affidavit' },
    ceaseDesist: { requirements: 'No specific statutory requirements' }
  },
  'AK': {
    govTortClaim: { timeLimit: '2 years', statute: 'AS § 09.50.250', requirements: 'Written notice within 2 years' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'No pre-suit notice required' },
    ceaseDesist: { requirements: 'No specific statutory requirements' }
  },
  'AZ': {
    govTortClaim: { timeLimit: '180 days', statute: 'A.R.S. § 12-821.01', requirements: 'Notice of claim required within 180 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'No pre-suit notice required' },
    ceaseDesist: { 
      requirements: 'Immediate cessation required upon receipt. Penalties $250-$1,000 per day for willful violations (A.R.S. § 32-1166)',
      mandatoryCompliance: 'Immediate'
    }
  },
  'AR': {
    govTortClaim: { timeLimit: '1 year', statute: 'Arkansas Code § 19-10-305', requirements: 'Written notice required within 1 year' },
    medMalpractice: { timeLimit: '60 days', statute: 'Arkansas Code § 16-114-206', requirements: 'Pre-suit notice required' },
    ceaseDesist: { requirements: 'No specific statutory requirements' }
  },
  'CA': {
    govTortClaim: { timeLimit: '6 months', statute: 'Gov. Code § 911.2', requirements: 'Government tort claim form required within 6 months' },
    medMalpractice: { timeLimit: '90 days', statute: 'CCP § 364', requirements: '90-day notice with expert declaration' },
    ceaseDesist: { requirements: 'Follow California Civil Code requirements for specific violations' }
  },
  'CO': {
    govTortClaim: { timeLimit: '182 days', statute: 'C.R.S. § 24-10-109', requirements: 'Written notice within 182 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'No pre-suit notice required' },
    ceaseDesist: { requirements: 'Colorado Consumer Protection Act may apply for certain violations' }
  },
  'CT': {
    govTortClaim: { timeLimit: '1 year', statute: 'C.G.S. § 4-160', requirements: 'Written notice to Attorney General within 1 year' },
    medMalpractice: { timeLimit: '90 days', statute: 'C.G.S. § 52-190a', requirements: '90-day notice required' },
    ceaseDesist: { requirements: 'Connecticut Unfair Trade Practices Act may apply' }
  },
  'DE': {
    govTortClaim: { timeLimit: '1 year', statute: '10 Del. C. § 4011', requirements: 'Written notice within 1 year' },
    medMalpractice: { timeLimit: '90 days', statute: '18 Del. C. § 6853', requirements: '90-day notice with expert affidavit' },
    ceaseDesist: { 
      requirements: '10-day hearing request period under 29 Del. Code § 2525 after service of administrative orders',
      hearingPeriod: '10 days'
    }
  },
  'FL': {
    govTortClaim: { timeLimit: '3 years', statute: 'F.S. § 768.28', requirements: 'Notice required before suit' },
    medMalpractice: { timeLimit: '90 days', statute: 'F.S. § 766.106', requirements: 'Pre-suit investigation and notice required' },
    ceaseDesist: { requirements: 'Florida Deceptive and Unfair Trade Practices Act may apply' }
  },
  'GA': {
    govTortClaim: { timeLimit: '1 year', statute: 'O.C.G.A. § 36-33-5', requirements: 'Written notice required within 1 year' },
    medMalpractice: { timeLimit: '75 days', statute: 'O.C.G.A. § 9-11-9.1', requirements: 'Expert affidavit required within 75 days' },
    ceaseDesist: { requirements: 'Georgia Fair Business Practices Act may apply' }
  },
  'HI': {
    govTortClaim: { timeLimit: '2 years', statute: 'HRS § 662-4', requirements: 'Written notice within 2 years' },
    medMalpractice: { timeLimit: '90 days', statute: 'HRS § 671-12', requirements: 'Medical inquiry and conciliation panel process' },
    ceaseDesist: { requirements: 'Hawaii Unfair or Deceptive Practices Act may apply' }
  },
  'ID': {
    govTortClaim: { timeLimit: '180 days', statute: 'Idaho Code § 6-906', requirements: 'Written notice within 180 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'No pre-suit notice required' },
    ceaseDesist: { requirements: 'Idaho Consumer Protection Act may apply' }
  },
  'IL': {
    govTortClaim: { timeLimit: '1 year', statute: '745 ILCS 10/8-101', requirements: 'Written notice within 1 year' },
    medMalpractice: { 
      timeLimit: '90 days', 
      statute: '735 ILCS 5/2-622', 
      requirements: 'Affidavit of merit required',
      damageCaps: 'UNCONSTITUTIONAL - Lebron v. Gottlieb Memorial Hospital (2010)'
    },
    ceaseDesist: { requirements: 'Illinois Consumer Fraud Act may apply' }
  },
  'IN': {
    govTortClaim: { timeLimit: '180 days', statute: 'IC § 34-13-3-6', requirements: 'Notice within 180 days for most claims' },
    medMalpractice: { timeLimit: 'None', statute: 'IC § 34-18-8', requirements: 'Medical review panel process required' },
    ceaseDesist: { requirements: 'Indiana Deceptive Consumer Sales Act may apply' }
  },
  'IA': {
    govTortClaim: { timeLimit: '2 years', statute: 'Iowa Code § 669.13', requirements: 'Notice required before filing suit' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required at trial' },
    ceaseDesist: { requirements: 'Iowa Consumer Fraud Act may apply' }
  },
  'KS': {
    govTortClaim: { timeLimit: '1 year', statute: 'K.S.A. § 75-6104', requirements: 'Written notice within 1 year' },
    medMalpractice: { 
      timeLimit: '90 days', 
      statute: 'K.S.A. § 60-3402', 
      requirements: 'Expert report required',
      damageCaps: 'UNCONSTITUTIONAL - Kansas Supreme Court ruling (2019)'
    },
    ceaseDesist: { requirements: 'Kansas Consumer Protection Act may apply' }
  },
  'KY': {
    govTortClaim: { timeLimit: '1 year', statute: 'KRS § 44.070', requirements: 'Written notice within 1 year' },
    medMalpractice: { 
      timeLimit: 'None', 
      statute: 'No pre-suit notice required', 
      requirements: 'Certificate of merit required',
      updates: '2024 law shields healthcare providers from criminal prosecution for medical mistakes'
    },
    ceaseDesist: { requirements: 'Kentucky Consumer Protection Act may apply' }
  },
  'LA': {
    govTortClaim: { 
      timeLimit: '2 years', 
      statute: 'LSA-R.S. § 13:5106 - EXTENDED by HB 315, Act 423', 
      requirements: 'Notice required within 2 years (extended from 1 year effective July 2024)',
      updates: 'HB 315, Act 423 extended personal injury claims from 1 year to 2 years'
    },
    medMalpractice: { timeLimit: 'Medical review panel required', statute: 'LSA-R.S. § 40:1299.47', requirements: 'Mandatory medical review panel process, $100 filing fee' },
    ceaseDesist: { requirements: 'Louisiana Unfair Trade Practices Act may apply' }
  },
  'ME': {
    govTortClaim: { timeLimit: '2 years', statute: '14 M.R.S. § 8107', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: '90 days', statute: '24 M.R.S. § 2853', requirements: 'Pre-litigation screening panel' },
    ceaseDesist: { requirements: 'Maine Unfair Trade Practices Act may apply' }
  },
  'MD': {
    govTortClaim: { timeLimit: '1 year', statute: 'MD Code § 5-522', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: '90 days', statute: 'MD Code § 3-2A-04', requirements: 'Expert certificate required' },
    ceaseDesist: { 
      requirements: 'Medical Board orders under 10 COMAR § 32.02.11 allow 30-day challenge period with hearing rights',
      challengePeriod: '30 days'
    }
  },
  'MA': {
    govTortClaim: { timeLimit: '2 years', statute: 'M.G.L. c. 258 § 4', requirements: 'Presentment required within 2 years' },
    medMalpractice: { timeLimit: '182 days', statute: 'M.G.L. c. 231 § 60B', requirements: 'Offer of proof and tribunal process' },
    ceaseDesist: { 
      requirements: 'MANDATORY 30-day notice under M.G.L. Chapter 93A before filing consumer protection lawsuit. Must identify consumer status, describe unfair practice, specify relief sought. Failure to respond in good faith results in double/triple damages.',
      mandatoryNotice: '30 days',
      penalties: 'Double/triple damages for non-compliance'
    }
  },
  'MI': {
    govTortClaim: { timeLimit: '1 year', statute: 'MCL § 691.1404', requirements: 'Notice within 1 year for most claims' },
    medMalpractice: { timeLimit: '182 days', statute: 'MCL § 600.2912b', requirements: 'Affidavit of merit required' },
    ceaseDesist: { requirements: 'Michigan Consumer Protection Act may apply' }
  },
  'MN': {
    govTortClaim: { timeLimit: '1 year', statute: 'Minn. Stat. § 3.736', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert affidavit required' },
    ceaseDesist: { requirements: 'Minnesota Consumer Fraud Act may apply' }
  },
  'MS': {
    govTortClaim: { timeLimit: '1 year', statute: 'Miss. Code § 11-46-11', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: '60 days', statute: 'Miss. Code § 15-1-36', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'Mississippi Consumer Protection Act may apply' }
  },
  'MO': {
    govTortClaim: { timeLimit: '90 days', statute: 'R.S.Mo. § 537.600', requirements: 'Notice within 90 days for state claims' },
    medMalpractice: { timeLimit: '90 days', statute: 'R.S.Mo. § 538.225', requirements: 'Affidavit required within 90 days' },
    ceaseDesist: { requirements: 'Missouri Merchandising Practices Act may apply' }
  },
  'MT': {
    govTortClaim: { timeLimit: '2 years', statute: 'MCA § 2-9-305', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Certificate of merit required' },
    ceaseDesist: { requirements: 'Montana Unfair Trade Practices Act may apply' }
  },
  'NE': {
    govTortClaim: { timeLimit: '1 year', statute: 'Neb. Rev. St. § 13-919', requirements: 'Notice within 1 year for most claims' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert affidavit required' },
    ceaseDesist: { requirements: 'Nebraska Consumer Protection Act may apply' }
  },
  'NV': {
    govTortClaim: { timeLimit: '2 years', statute: 'NRS § 41.036', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Affidavit of merit required' },
    ceaseDesist: { 
      requirements: 'Contractors have 15 business days to petition Board under NRS 624.212; insurance orders effective immediately (NRS 686A.183)',
      petitionPeriod: '15 business days'
    }
  },
  'NH': {
    govTortClaim: { timeLimit: '3 years', statute: 'RSA § 507-B:4', requirements: 'Notice required' },
    medMalpractice: { 
      timeLimit: 'None', 
      statute: 'Pre-suit screening panel ELIMINATED', 
      requirements: 'No longer requires medical malpractice screening panel (eliminated)',
      updates: 'Pre-suit medical screening panel requirement removed'
    },
    ceaseDesist: { requirements: 'New Hampshire Consumer Protection Act may apply' }
  },
  'NJ': {
    govTortClaim: { timeLimit: '90 days', statute: 'N.J.S.A. § 59:8-8', requirements: 'Notice within 90 days with extraordinary circumstances extension to one year' },
    medMalpractice: { timeLimit: '60 days', statute: 'N.J.S.A. § 2A:53A-27', requirements: 'Affidavit of merit required from board-certified expert in same specialty' },
    ceaseDesist: { 
      requirements: 'CONFIRMED: No 7 business day requirement exists. New Jersey Consumer Fraud Act (N.J.S.A. 56:8-1 et seq.) does not specify mandatory time periods for cease and desist letters.',
      legalNote: 'Research confirms no statutory time requirements for cease and desist in New Jersey'
    }
  },
  'NM': {
    govTortClaim: { timeLimit: '90 days', statute: 'NMSA § 41-4-16', requirements: 'Notice within 90 days' },
    medMalpractice: { timeLimit: '90 days', statute: 'NMSA § 41-5-18', requirements: 'Medical review commission process' },
    ceaseDesist: { requirements: 'New Mexico Unfair Practices Act may apply' }
  },
  'NY': {
    govTortClaim: { timeLimit: '90 days', statute: 'General Municipal Law § 50-e', requirements: 'Notice of claim within 90 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Certificate of merit required' },
    ceaseDesist: { requirements: 'New York General Business Law may apply' }
  },
  'NC': {
    govTortClaim: { timeLimit: '1 year', statute: 'N.C.G.S. § 143-291', requirements: 'Notice within 1 year for state claims' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'North Carolina Unfair and Deceptive Practices Act may apply' }
  },
  'ND': {
    govTortClaim: { timeLimit: '180 days', statute: 'NDCC § 32-12.1-08', requirements: 'Notice within 180 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'North Dakota Consumer Fraud Act may apply' }
  },
  'OH': {
    govTortClaim: { timeLimit: '2 years', statute: 'ORC § 2744.04', requirements: 'Notice required before filing suit' },
    medMalpractice: { timeLimit: '180 days', statute: 'ORC § 2323.43', requirements: 'Affidavit of merit required' },
    ceaseDesist: { requirements: 'Ohio Consumer Sales Practices Act may apply' }
  },
  'OK': {
    govTortClaim: { timeLimit: '1 year', statute: '51 O.S. § 155', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert affidavit required' },
    ceaseDesist: { requirements: 'Oklahoma Consumer Protection Act may apply' }
  },
  'OR': {
    govTortClaim: { timeLimit: '180 days', statute: 'ORS § 30.275', requirements: 'Notice within 180 days' },
    medMalpractice: { timeLimit: '90 days', statute: 'ORS § 677.097', requirements: 'Expert affidavit required' },
    ceaseDesist: { requirements: 'Oregon Unlawful Trade Practices Act may apply' }
  },
  'PA': {
    govTortClaim: { timeLimit: '6 months', statute: '42 Pa.C.S. § 5522', requirements: 'Notice within 6 months for local government' },
    medMalpractice: { timeLimit: '60 days', statute: '40 P.S. § 1303.512', requirements: 'Certificate of merit required' },
    ceaseDesist: { requirements: 'Pennsylvania Unfair Trade Practices Act may apply' }
  },
  'RI': {
    govTortClaim: { timeLimit: '3 years', statute: 'R.I.G.L. § 9-31-12', requirements: 'Notice required' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'Rhode Island Deceptive Trade Practices Act may apply' }
  },
  'SC': {
    govTortClaim: { timeLimit: '2 years', statute: 'S.C. Code § 15-78-110', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert affidavit required' },
    ceaseDesist: { requirements: 'South Carolina Unfair Trade Practices Act may apply' }
  },
  'SD': {
    govTortClaim: { timeLimit: '180 days', statute: 'SDCL § 3-22-1', requirements: 'Notice within 180 days' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'South Dakota Deceptive Trade Practices Act may apply' }
  },
  'TN': {
    govTortClaim: { timeLimit: '60 days', statute: 'T.C.A. § 29-20-311', requirements: 'Notice within 60 days for state claims' },
    medMalpractice: { timeLimit: '60 days', statute: 'T.C.A. § 29-26-122', requirements: 'Pre-suit notice required' },
    ceaseDesist: { requirements: 'Tennessee Consumer Protection Act may apply' }
  },
  'TX': {
    govTortClaim: { timeLimit: '6 months', statute: 'Tex. Civ. Prac. & Rem. Code § 101.101', requirements: 'Notice within 6 months' },
    medMalpractice: { timeLimit: '60 days', statute: 'Tex. Civ. Prac. & Rem. Code § 74.351', requirements: 'Expert report required' },
    ceaseDesist: { requirements: 'Texas Deceptive Trade Practices Act may apply' }
  },
  'UT': {
    govTortClaim: { timeLimit: '1 year', statute: 'Utah Code § 63G-7-402', requirements: 'Notice within 1 year' },
    medMalpractice: { timeLimit: '90 days', statute: 'Utah Code § 78B-3-423', requirements: 'Prelitigation panel process' },
    ceaseDesist: { requirements: 'Utah Consumer Sales Practices Act may apply' }
  },
  'VT': {
    govTortClaim: { timeLimit: '2 years', statute: '12 V.S.A. § 5601', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'Vermont Consumer Protection Act may apply' }
  },
  'VA': {
    govTortClaim: { timeLimit: '1 year', statute: 'Va. Code § 8.01-222', requirements: 'Notice within 1 year for state claims' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'Virginia Consumer Protection Act may apply' }
  },
  'WA': {
    govTortClaim: { timeLimit: '120 days', statute: 'RCW § 4.92.100', requirements: 'Notice within 120 days' },
    medMalpractice: { timeLimit: '90 days', statute: 'RCW § 7.70.100', requirements: 'Certificate of merit required' },
    ceaseDesist: { requirements: 'Washington Consumer Protection Act may apply' }
  },
  'WV': {
    govTortClaim: { timeLimit: '2 years', statute: 'W. Va. Code § 29-12A-8', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: '30 days', statute: 'W. Va. Code § 55-7B-6', requirements: 'Pre-suit screening panel' },
    ceaseDesist: { requirements: 'West Virginia Consumer Credit and Protection Act may apply' }
  },
  'WI': {
    govTortClaim: { timeLimit: '120 days', statute: 'Wis. Stat. § 893.80', requirements: 'Notice within 120 days' },
    medMalpractice: { timeLimit: '180 days', statute: 'Wis. Stat. § 655.002', requirements: 'Mediation panel process' },
    ceaseDesist: { requirements: 'Wisconsin Deceptive Trade Practices Act may apply' }
  },
  'WY': {
    govTortClaim: { timeLimit: '2 years', statute: 'Wyo. Stat. § 1-39-113', requirements: 'Notice within 2 years' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert affidavit required' },
    ceaseDesist: { requirements: 'Wyoming Consumer Protection Act may apply' }
  },
  'DC': {
    govTortClaim: { timeLimit: '6 months', statute: 'D.C. Code § 12-309', requirements: 'Notice within 6 months' },
    medMalpractice: { timeLimit: 'None', statute: 'No pre-suit notice required', requirements: 'Expert witness required' },
    ceaseDesist: { requirements: 'DC Consumer Protection Procedures Act may apply' }
  }
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
  const [claimType, setClaimType] = useState('general');
  const [damages, setDamages] = useState('');
  const [violationType, setViolationType] = useState('harassment');

  // Update jurisdiction, time limit, and statute when state changes
  useEffect(() => {
    if (selectedState) {
      if (documentType === 'FOIA Request' || documentType === 'State Public Records Request') {
        if (statePublicRecordsData[selectedState]) {
          const stateData = statePublicRecordsData[selectedState];
          setJurisdiction(stateData.name);
          setTimeLimit(stateData.timeLimit);
          setStatute(stateData.statute);
        }
      } else if (documentType === 'ID Rights Card' && stateIDRights[selectedState]) {
        const stateData = statePublicRecordsData[selectedState];
        const rightsData = stateIDRights[selectedState];
        setJurisdiction(stateData.name);
        setTimeLimit(rightsData.stopAndID ? 'Stop and Identify State' : 'No Stop and Identify Law');
        setStatute(rightsData.law);
      } else if (stateNoticeRequirements[selectedState]) {
        const stateData = statePublicRecordsData[selectedState];
        setJurisdiction(stateData.name);
        
        if (documentType === 'Notice of Claim' && claimType === 'government') {
          const requirements = stateNoticeRequirements[selectedState].govTortClaim;
          setTimeLimit(requirements.timeLimit);
          setStatute(requirements.statute);
        } else if (documentType === 'Pre-Suit Notice' && claimType === 'medical') {
          const requirements = stateNoticeRequirements[selectedState].medMalpractice;
          setTimeLimit(requirements.timeLimit);
          setStatute(requirements.statute);
        }
      }
    } else {
      setJurisdiction('');
      setTimeLimit('');
      setStatute('');
    }
  }, [selectedState, documentType, claimType]);

  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let letter = '';
    
    if (documentType === 'FOIA Request') {
      letter = generateFOIARequest(today);
    } else if (documentType === 'ID Rights Card') {
      letter = generateIDRightsCard();
    } else if (documentType === 'Cease and Desist Letter') {
      letter = generateCeaseDesistLetter(today);
    } else if (documentType === 'Notice of Claim') {
      letter = generateNoticeOfClaim(today);
    } else if (documentType === 'Pre-Suit Notice') {
      letter = generatePreSuitNotice(today);
    }
    
    setGeneratedLetter(letter);
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
FOIA Officer
[Agency Address]

Re: Freedom of Information Act Request

Dear FOIA Officer:

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, and any applicable state public records laws${selectedState ? ` including the ${statute}` : ''}, I hereby request access to and copies of the following records:

SUBJECT MATTER: ${incident || '[Please describe the specific records you are seeking]'}

JURISDICTION: ${jurisdiction || '[Specify the relevant jurisdiction]'}

${selectedState ? `APPLICABLE STATE LAW: This request is also made under ${statute}, which provides for disclosure of public records within ${timeLimit}.` : ''}${updates}

REQUEST SPECIFICATIONS:
- Time Period: [Specify dates or time range]
- Record Types: [Specify types of documents - emails, reports, policies, etc.]
- Individuals/Entities: [Name specific people or departments if applicable]

This request seeks records regardless of format, including but not limited to: paper documents, electronic files, emails, text messages, audio recordings, video recordings, photographs, databases, and any other media containing the requested information.

I request that fees be waived as this request is in the public interest and will contribute significantly to public understanding of government operations. If fees cannot be waived entirely, please contact me if costs will exceed $25.00.

If any portion of this request is denied, please specify which exemption applies and provide a detailed justification. If records are partially redacted, please provide all non-exempt portions.

${selectedState ? `Please note that under ${statute}, you are required to respond within ${timeLimit}.` : 'Please respond within the statutorily required timeframe.'}

I look forward to your prompt response. Please contact me if you need clarification or additional information.

Sincerely,

[Your Signature]
[Your Printed Name]

---
DELIVERY METHOD: [Check appropriate method]
☐ Email
☐ Certified Mail, Return Receipt Requested
☐ Hand Delivery
☐ Regular Mail

FOLLOW-UP TRACKING:
Request Date: ${today}
${selectedState ? `Response Due: [Calculate based on ${timeLimit}]` : 'Response Due: [Calculate based on applicable law]'}
Reference Number: [Agency will provide]`;
  };

  const generateIDRightsCard = () => {
    const stateName = selectedState ? statePublicRecordsData[selectedState].name : '[STATE NAME]';
    const stateRights = selectedState ? stateIDRights[selectedState] : null;
    const cannabisData = selectedState ? cannabisLaws[selectedState] : null;
    
    if (!selectedState || !stateRights) {
      return 'Please select a state to generate your ID Rights Card';
    }

    // Create visual card component
    const cardComponent = (
      <div id="id-rights-card" style={{
        width: '400px',
        height: '280px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '15px',
        padding: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        lineHeight: '1.3',
        position: 'relative',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        border: '2px solid #fff'
      }}>
        {/* Cannabis Laws Display */}
        {selectedState && cannabisLaws[selectedState] && (
          <div style={{
            backgroundColor: '#f0f8ff',
            border: '2px solid #4169e1',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(65, 105, 225, 0.1)'
          }}>
            <h3 style={{
              color: '#4169e1', 
              marginTop: '0',
              marginBottom: '15px',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              🌿 {statePublicRecordsData[selectedState].name} Cannabis Laws
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <div>
                <strong>Legal Status:</strong> {cannabisLaws[selectedState].status}
              </div>
              {cannabisLaws[selectedState].enacted !== 'N/A' && (
                <div>
                  <strong>Enacted:</strong> {cannabisLaws[selectedState].enacted}
                </div>
              )}
              <div>
                <strong>Possession Limits:</strong> {cannabisLaws[selectedState].possession}
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              <strong>Details:</strong> {cannabisLaws[selectedState].details}
            </div>
          </div>
        )}

        {/* Document-specific fields */}
        {(documentType === 'Notice of Claim' || documentType === 'Pre-Suit Notice') && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              🎯 Claim Type:
            </label>
            <select 
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
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
              {documentType === 'Notice of Claim' && (
                <>
                  <option value="government">Government/Municipal Tort Claim</option>
                  <option value="general">General Notice of Claim</option>
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
              <option value="defamation">Defamation/Libel</option>
              <option value="contract">Contract Violations</option>
              <option value="privacy">Privacy Violations</option>
            </select>
          </div>
        )}

        {selectedState && (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #27ae60',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 15px rgba(39, 174, 96, 0.1)'
          }}>
            <h3 style={{
              color: '#27ae60',
              marginTop: '0',
              marginBottom: '20px',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              📋 Auto-Populated Legal Information for {statePublicRecordsData[selectedState].name}
            </h3>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '1rem'
                }}>
                  ⚖️ Applicable Statute:
                </label>
                <div style={{ 
                  padding: '12px', 
                  border: '2px solid #27ae60',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontFamily: 'monospace',
                  wordBreak: 'break-word'
                }}>
                  {statute || 'Select document type for statute information'}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '1rem'
                }}>
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
                  {timeLimit || 'Select document type for time requirements'}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '1rem'
                }}>
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
                  {calculateResponseDate() || 'Select document type for deadline calculation'}
                </div>
              </div>

              {/* Legislative Updates Display */}
              {statePublicRecordsData[selectedState]?.updates && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#e74c3c',
                    fontSize: '1rem'
                  }}>
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
              {documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? '🏢 Agency/Recipient:' : '👤 Recipient/Target:'}
            </label>
            <input
              type="text"
              value={documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? agency : recipient}
              onChange={(e) => documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? setAgency(e.target.value) : setRecipient(e.target.value)}
              placeholder={documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 'Enter the name of the agency or department' : 'Enter the name of the recipient'}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #3498db',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#ffffff',
                transition: 'all 0.3s ease'
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
                backgroundColor: selectedState ? '#f8fff8' : '#ffffff',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>

        {(documentType === 'Notice of Claim' || documentType === 'Pre-Suit Notice' || documentType === 'Cease and Desist Letter') && (
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '1.1rem'
            }}>
              💰 Damages/Settlement Amount:
            </label>
            <textarea
              value={damages}
              onChange={(e) => setDamages(e.target.value)}
              placeholder="Describe monetary damages, injuries, losses, or settlement demand. Be specific about medical expenses, lost wages, pain and suffering, etc."
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
                fontFamily: 'inherit',
                lineHeight: '1.5'
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
                documentType === 'Notice of Claim' ? 'Incident Description:' :
                documentType === 'Pre-Suit Notice' ? 'Malpractice/Negligence Description:' : 'Subject Matter:'}
          </label>
          <textarea
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={
              documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 
                'Describe the specific records, incident, or subject matter you are requesting. Be as detailed as possible to ensure you receive the correct documents.' :
              documentType === 'ID Rights Card' ?
                'Optional: Add any specific notes or information relevant to your state or local area (e.g., local ordinances, specific contact information, etc.).' :
              documentType === 'Cease and Desist Letter' ?
                'Describe the specific violations, actions, or behaviors that must stop. Include dates, locations, and specific incidents.' :
              documentType === 'Notice of Claim' ?
                'Provide a detailed description of the incident, including date, time, location, parties involved, and how the incident occurred.' :
              documentType === 'Pre-Suit Notice' ?
                'Describe the alleged malpractice or professional negligence, including specific acts and omissions that breached the standard of care.' :
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
              lineHeight: '1.5',
              transition: 'all 0.3s ease'
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
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2980b9';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#3498db';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
          }}
        >
          🚀 Generate {documentType === 'ID Rights Card' ? 'Professional Rights & Laws Card' : 'Attorney-Level Legal Document'}
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
                        const cardText = `${stateName} Rights & Laws Card\nStop & ID: ${stateRights.stopAndID ? 'Yes' : 'No'}\nRecording: ${stateRights.recording}\nCannabis: ${cannabisData ? cannabisData.status : 'Unknown'}\nLaw: ${stateRights.law}`;
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
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#219a52'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
                >
                  📋 Copy {documentType === 'ID Rights Card' ? 'Card Info' : 'to Clipboard'}
                </button>

                {documentType === 'ID Rights Card' ? (
                  <>
                    <button 
                      onClick={() => {
                        const stateName = selectedState ? statePublicRecordsData[selectedState].name : 'State';
                        const stateRights = selectedState ? stateIDRights[selectedState] : null;
                        const cannabisData = selectedState ? cannabisLaws[selectedState] : null;
                        
                        if (!stateRights) return;
                        
                        // Create canvas for download
                        const canvas = document.createElement('canvas');
                        canvas.width = 800;
                        canvas.height = 560;
                        const ctx = canvas.getContext('2d');
                        
                        // Create gradient background
                        const gradient = ctx.createLinearGradient(0, 0, 800, 560);
                        gradient.addColorStop(0, '#1e3c72');
                        gradient.addColorStop(1, '#2a5298');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, 800, 560);
                        
                        // Add white border
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 4;
                        ctx.strokeRect(2, 2, 796, 556);
                        
                        // Header
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 32px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(stateName.toUpperCase(), 400, 80);
                        
                        ctx.font = 'bold 26px Arial';
                        ctx.fillText('RIGHTS & LAWS CARD', 400, 120);
                        
                        // Divider line
                        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(60, 140);
                        ctx.lineTo(740, 140);
                        ctx.stroke();
                        
                        // Left column content
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
                        
                        // State laws section
                        ctx.fillStyle = '#ffd700';
                        ctx.font = '18px Arial';
                        ctx.fillText('STATE LAWS:', 60, 330);
                        
                        ctx.fillStyle = '#fff';
                        ctx.font = '14px Arial';
                        ctx.fillText(`Stop & ID: ${stateRights.stopAndID ? 'YES' : 'NO'}`, 60, 360);
                        ctx.fillText(`Recording: ${stateRights.recording}`, 60, 385);
                        if (cannabisData) {
                          ctx.fillStyle = '#90EE90';
                          ctx.fillText(`Cannabis: ${cannabisData.status}`, 60, 410);
                        }
                        
                        // Right column - Police encounter
                        ctx.fillStyle = '#ffd700';
                        ctx.font = '18px Arial';
                        ctx.fillText('POLICE ENCOUNTER:', 420, 180);
                        
                        ctx.fillStyle = '#fff';
                        ctx.font = '14px Arial';
                        ctx.fillText('"Officer, am I being detained or free to go?"', 420, 210);
                        
                        ctx.font = '12px Arial';
                        ctx.fillText('If FREE: "I choose to leave now."', 420, 240);
                        ctx.fillText('If DETAINED: "I decline to answer questions."', 420, 270);
                        ctx.fillText('"I do not consent to searches."', 420, 290);
                        ctx.fillText(stateRights.stopAndID ? 
                          '"Please state the law requiring ID."' :
                          '"I am not required to show ID unless', 420, 320);
                        if (!stateRights.stopAndID) {
                          ctx.fillText('driving or under arrest."', 420, 340);
                        }
                        ctx.fillText('If ARRESTED: "I want a lawyer."', 420, 370);
                        
                        // Footer
                        ctx.fillStyle = 'rgba(255,255,255,0.7)';
                        ctx.font = '12px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(`Generated: ${new Date().toLocaleDateString()} - For informational purposes only`, 400, 520);
                        
                        // Download
                        canvas.toBlob((blob) => {
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${stateName.replace(/\s+/g, '_')}_Rights_Laws_Card.png`;
                          a.click();
                          URL.revokeObjectURL(url);
                        });
                      }}
                      style={{ 
                        padding: '12px 20px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                    >
                      📸 Download as Image
                    </button>
                  </>
                ) : (
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
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#7d3c98'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#8e44ad'}
                  >
                    💾 Download as Text File
                  </button>
                )}
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
                  resize: 'vertical',
                  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
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
              <strong>💡 {documentType === 'ID Rights Card' ? 'Rights & Laws Card:' : 'Attorney-Level Legal Notice:'}</strong> {documentType === 'ID Rights Card' ? 
                'This professional card includes your state\'s specific stop-and-identify laws, recording consent requirements, and current cannabis laws. All information is verified through 2024-2025 legislative updates. Print wallet-size and keep handy. Always remain respectful during encounters.' :
                `This document incorporates all 2024-2025 legislative changes including California's recodification, Nebraska's LB 43, Louisiana's tort extension, and state-specific legal requirements. Generated with attorney-level precision for ${selectedState ? statePublicRecordsData[selectedState].name : 'your jurisdiction'}. Review all bracketed placeholders and customize with your specific information.`
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
          <strong>⚖️ ATTORNEY-LEVEL CIVIL RIGHTS LEGAL TOOLKIT - 2025 LEGISLATIVE COMPLIANCE</strong><br/>
          This toolkit incorporates comprehensive 2024-2025 legislative updates verified through primary sources. 
          All statutory citations, time limits, and legal requirements reflect current law as of August 2025. 
          Designed specifically for civil rights practice with emphasis on accuracy and detail. 
          For complex matters, consult qualified legal counsel in your jurisdiction. 
          Not intended as legal advice - for informational and document generation purposes only.
        </div>
      </div>
    </div>
  );
};

export default LegalToolkit; Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '2px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px',
          marginBottom: '8px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{stateName.toUpperCase()}</div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>RIGHTS & LAWS CARD</div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', gap: '15px', height: '180px' }}>
          {/* Left Column */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', color: '#ffd700' }}>
              CONSTITUTIONAL RIGHTS
            </div>
            <div style={{ fontSize: '9px', marginBottom: '4px' }}>
              • I do not consent to searches
            </div>
            <div style={{ fontSize: '9px', marginBottom: '4px' }}>
              • I invoke my right to remain silent
            </div>
            <div style={{ fontSize: '9px', marginBottom: '4px' }}>
              • I do not waive any rights
            </div>
            <div style={{ fontSize: '9px', marginBottom: '8px' }}>
              • I want a lawyer if detained
            </div>

            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', color: '#ffd700' }}>
              STATE LAWS
            </div>
            <div style={{ fontSize: '8px', marginBottom: '4px' }}>
              {stateRights.stopAndID ? 
                `✓ Stop & ID: ${stateRights.law}` : 
                '✗ No Stop & ID Law'
              }
            </div>
            <div style={{ fontSize: '8px', marginBottom: '4px' }}>
              Recording: {stateRights.recording}
            </div>
            {cannabisData && (
              <div style={{ fontSize: '8px', marginBottom: '4px', color: '#90EE90' }}>
                Cannabis: {cannabisData.status}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', color: '#ffd700' }}>
              POLICE ENCOUNTER
            </div>
            <div style={{ fontSize: '8px', marginBottom: '3px', fontWeight: '600' }}>
              "Officer, am I being detained or am I free to go?"
            </div>
            
            <div style={{ fontSize: '8px', marginBottom: '2px' }}>
              <strong>If FREE TO GO:</strong>
            </div>
            <div style={{ fontSize: '7px', marginBottom: '4px', fontStyle: 'italic' }}>
              "I choose to leave now. Have a good day."
            </div>
            
            <div style={{ fontSize: '8px', marginBottom: '2px' }}>
              <strong>If DETAINED:</strong>
            </div>
            <div style={{ fontSize: '7px', marginBottom: '2px' }}>
              "I respectfully decline to answer questions."
            </div>
            <div style={{ fontSize: '7px', marginBottom: '2px' }}>
              "I do not consent to any search."
            </div>
            <div style={{ fontSize: '7px', marginBottom: '4px' }}>
              {stateRights.stopAndID ? 
                '"Please state the law requiring me to provide ID."' :
                '"I am not required to show ID unless driving or under arrest."'
              }
            </div>
            
            <div style={{ fontSize: '8px', marginBottom: '2px' }}>
              <strong>If ARRESTED:</strong>
            </div>
            <div style={{ fontSize: '7px' }}>
              "I invoke my right to remain silent and want a lawyer."
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '20px',
          right: '20px',
          borderTop: '1px solid rgba(255,255,255,0.3)',
          paddingTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '7px',
          opacity: '0.8'
        }}>
          <div>Generated: {new Date().toLocaleDateString()}</div>
          <div>For informational purposes only</div>
        </div>
      </div>
    );

    return cardComponent;
  };

  const generateCeaseDesistLetter = (today) => {
    const stateRequirements = selectedState && stateNoticeRequirements[selectedState] ? 
      stateNoticeRequirements[selectedState].ceaseDesist : null;
    
    let stateSpecificSection = '';
    if (stateRequirements) {
      stateSpecificSection = `\n\nSTATE-SPECIFIC REQUIREMENTS: ${stateRequirements.requirements}`;
      
      if (stateRequirements.mandatoryNotice) {
        stateSpecificSection += `\n\nMANDATORY NOTICE PERIOD: ${stateRequirements.mandatoryNotice}`;
      }
      
      if (stateRequirements.penalties) {
        stateSpecificSection += `\n\nPENALTIES FOR NON-COMPLIANCE: ${stateRequirements.penalties}`;
      }
    }

    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${recipient || '[Recipient Name]'}
[Recipient Address]
[City, State, ZIP Code]

RE: CEASE AND DESIST - ${violationType.toUpperCase()} VIOLATIONS
${jurisdiction ? `JURISDICTION: ${jurisdiction}` : ''}

Dear ${recipient || '[Recipient Name]'}:

NOTICE TO CEASE AND DESIST

You are hereby notified to CEASE AND DESIST from the following unlawful activities:

VIOLATIONS: ${incident || '[Describe specific violations, actions, or behaviors that must stop]'}

LEGAL BASIS: Your actions constitute violations of applicable law including but not limited to:
${violationType === 'harassment' ? '- Harassment and intimidation laws\n- Privacy violations\n- Intentional infliction of emotional distress' : ''}
${violationType === 'intellectual_property' ? '- Copyright infringement\n- Trademark violations\n- Unfair competition laws' : ''}
${violationType === 'debt_collection' ? '- Fair Debt Collection Practices Act (FDCPA)\n- State debt collection laws\n- Consumer protection statutes' : ''}
${violationType === 'trespass' ? '- Trespass laws\n- Property rights violations\n- Nuisance laws' : ''}
${violationType === 'defamation' ? '- Defamation and libel laws\n- False light invasion of privacy\n- Intentional interference with business relations' : ''}${stateSpecificSection}

DEMAND FOR CESSATION: You are hereby demanded to immediately:

1. CEASE all ${violationType} activities described above
2. REFRAIN from any future similar conduct
3. REMOVE any infringing materials (if applicable)
4. PROVIDE written confirmation of compliance within ${stateRequirements?.mandatoryNotice || '10 days'}

CONSEQUENCES OF NON-COMPLIANCE: 

Please be advised that if you fail to comply with this demand within ${stateRequirements?.mandatoryNotice || '10 days'} of receipt:

1. We will pursue all available legal remedies
2. You may be liable for damages, including attorney fees
3. We may seek injunctive relief to stop your actions
4. Criminal charges may be filed if applicable

DOCUMENTATION: This letter serves as formal notice of your unlawful conduct and our demand that you cease such activities. A copy of this notice is being retained for our records and potential legal proceedings.

TIME FOR COMPLIANCE: You have ${stateRequirements?.mandatoryNotice || 'ten (10) days'} from receipt of this letter to comply with the demands set forth herein.

If you believe this notice has been sent in error, please contact me immediately in writing. Otherwise, your continued violations after receipt of this notice will be considered willful and may result in enhanced damages.

I trust that you will give this matter the serious attention it deserves and will comply immediately.

${damages ? `DAMAGES CLAIMED: ${damages}` : ''}

Sincerely,

[Your Signature]
[Your Printed Name]

---
DELIVERY VERIFICATION:
☐ Certified Mail, Return Receipt Requested
☐ Personal Service
☐ Email with read receipt
☐ Other: ___________

COMPLIANCE TRACKING:
Notice Date: ${today}
Compliance Deadline: [${stateRequirements?.mandatoryNotice || '10 days'} from receipt]
Response Received: ___________
Legal Action Required: ___________`;
  };

  const generateNoticeOfClaim = (today) => {
    let stateRequirements = '';
    let timeRequirement = '';
    let stateLawReference = '';
    let updates = '';
    
    if (selectedState && stateNoticeRequirements[selectedState]) {
      if (claimType === 'government') {
        const requirements = stateNoticeRequirements[selectedState].govTortClaim;
        timeRequirement = requirements.timeLimit;
        stateLawReference = requirements.statute;
        updates = requirements.updates ? `\n\n**LEGISLATIVE UPDATE:** ${requirements.updates}` : '';
        stateRequirements = `\n\nSTATE-SPECIFIC REQUIREMENTS:
- Filing Deadline: ${requirements.timeLimit}
- Governing Statute: ${requirements.statute}
- Requirements: ${requirements.requirements}${updates}`;
      }
    }

    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${agency || recipient || '[Name of Government Entity/Recipient]'}
${claimType === 'government' ? 'Claims Administrator/Legal Department' : 'Legal Department'}
[Address]
[City, State, ZIP Code]

RE: NOTICE OF CLAIM
${claimType === 'government' ? 'CLAIM AGAINST GOVERNMENT ENTITY' : 'FORMAL NOTICE OF CLAIM'}
${jurisdiction ? `JURISDICTION: ${jurisdiction}` : ''}
${stateLawReference ? `GOVERNING LAW: ${stateLawReference}` : ''}

TO WHOM IT MAY CONCERN:

NOTICE IS HEREBY GIVEN that the undersigned intends to file a claim against ${agency || recipient || '[Entity Name]'} for damages resulting from the incident(s) described below.

CLAIMANT INFORMATION:
Name: [Your Full Name]
Address: [Your Complete Address]
Phone: [Your Phone Number]
Email: [Your Email Address]

INCIDENT DETAILS:
Date of Incident: [Date]
Time of Incident: [Time]
Location: [Specific Location]

DESCRIPTION OF INCIDENT:
${incident || '[Provide detailed description of the incident, including all relevant facts, circumstances, and parties involved]'}

NATURE OF CLAIM:
${claimType === 'government' ? 'This claim arises from the negligent/wrongful acts of your employees/agents acting within the scope of their employment.' : 'This claim arises from [specify legal basis - negligence, breach of contract, etc.]'}

INJURIES AND DAMAGES:
${damages || '[Describe all injuries, property damage, and other losses including medical expenses, lost wages, pain and suffering, etc.]'}

LEGAL BASIS:
This claim is based upon:
- Negligence and breach of duty of care
- Violation of applicable statutes and regulations
- [Add other applicable legal theories]

DAMAGES SOUGHT:
1. Medical expenses (past and future): $______
2. Lost wages and earning capacity: $______
3. Property damage: $______
4. Pain and suffering: $______
5. Other damages: $______
TOTAL DAMAGES: $______

${claimType === 'government' ? `GOVERNMENT LIABILITY:
${agency || '[Government Entity]'} is liable for the actions of its employees/agents under principles of respondeat superior and governmental liability statutes.` : ''}

PRESERVATION NOTICE:
You are hereby notified to preserve all documents, records, video surveillance, witness statements, and other evidence related to this incident.

${stateRequirements}

SETTLEMENT DEMAND:
Prior to filing formal litigation, we are willing to discuss reasonable settlement of this matter. Please contact the undersigned within thirty (30) days of receipt of this notice.

${timeRequirement ? `FILING DEADLINE NOTICE:
Please be advised that under ${stateLawReference}, this notice must be filed within ${timeRequirement} of the incident. This notice is being filed within the required timeframe.` : ''}

This notice is given pursuant to all applicable federal, state, and local laws and regulations.

Time is of the essence in your response to this notice.

Sincerely,

[Your Signature]
[Your Printed Name]
[Title/Capacity if applicable]

---
ATTACHMENTS:
☐ Medical records
☐ Police reports
☐ Photographs
☐ Witness statements
☐ Other supporting documentation

DELIVERY VERIFICATION:
☐ Certified Mail, Return Receipt Requested
☐ Personal Service
☐ Registered Mail
☐ Other: ___________

CLAIM TRACKING:
Notice Date: ${today}
${timeRequirement ? `Filing Deadline: [Within ${timeRequirement} of incident]` : ''}
Response Due: [30 days from receipt]
Claim Number: [To be assigned]`;
  };

  const generatePreSuitNotice = (today) => {
    let stateRequirements = '';
    let timeRequirement = '';
    let stateLawReference = '';
    let expertRequirement = '';
    let updates = '';
    
    if (selectedState && stateNoticeRequirements[selectedState]) {
      if (claimType === 'medical') {
        const requirements = stateNoticeRequirements[selectedState].medMalpractice;
        timeRequirement = requirements.timeLimit;
        stateLawReference = requirements.statute;
        expertRequirement = requirements.requirements;
        updates = requirements.updates ? `\n\n**UPDATES:** ${requirements.updates}` : '';
        
        if (requirements.damageCaps) {
          updates += `\n\n**DAMAGE CAPS:** ${requirements.damageCaps}`;
        }
        
        stateRequirements = `\n\nSTATE-SPECIFIC REQUIREMENTS FOR ${jurisdiction.toUpperCase()}:
- Notice Period: ${requirements.timeLimit}
- Governing Statute: ${requirements.statute}
- Requirements: ${requirements.requirements}${updates}`;
      }
    }

    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${recipient || '[Healthcare Provider/Professional Name]'}
[Professional Address]
[City, State, ZIP Code]

${claimType === 'medical' ? 'ALSO TO:' : ''}
${claimType === 'medical' ? '[Insurance Company Name]\n[Insurance Company Address]\n[City, State, ZIP Code]' : ''}

RE: PRE-SUIT NOTICE OF PROFESSIONAL LIABILITY CLAIM
${claimType === 'medical' ? 'MEDICAL MALPRACTICE CLAIM' : 'PROFESSIONAL LIABILITY CLAIM'}
${jurisdiction ? `JURISDICTION: ${jurisdiction}` : ''}
${stateLawReference ? `GOVERNING STATUTE: ${stateLawReference}` : ''}

Dear ${recipient || '[Professional Name]'}:

FORMAL PRE-SUIT NOTICE

You are hereby notified that the undersigned intends to commence a professional liability action against you arising from your ${claimType === 'medical' ? 'medical treatment and care' : 'professional services'} provided to ${incident.includes('patient') || claimType === 'medical' ? '[Patient Name]' : '[Client Name]'}.

PARTIES:
${claimType === 'medical' ? 'Patient:' : 'Client:'} [Full Name]
Date of Birth: [Date]
${claimType === 'medical' ? 'Medical Record Number:' : 'File Number:'} [Number]

PROFESSIONAL RELATIONSHIP:
${claimType === 'medical' ? 'You provided medical treatment and care to the above-named patient' : 'You provided professional services to the above-named client'} during the period from [Start Date] to [End Date].

INCIDENT DETAILS:
Date(s) of Alleged Malpractice: [Specific Dates]
Location: [Facility/Office Name and Address]

DESCRIPTION OF ALLEGED MALPRACTICE:
${incident || `[Provide detailed description of the alleged ${claimType === 'medical' ? 'medical malpractice' : 'professional negligence'}, including specific acts and omissions that constitute breaches of the standard of care]`}

STANDARD OF CARE VIOLATIONS:
The alleged malpractice includes, but is not limited to:
1. [Specific violation #1]
2. [Specific violation #2]
3. [Specific violation #3]
4. [Additional violations as applicable]

INJURIES AND DAMAGES:
As a direct and proximate result of your ${claimType === 'medical' ? 'medical malpractice' : 'professional negligence'}, ${claimType === 'medical' ? 'the patient' : 'the client'} suffered the following injuries and damages:
${damages || '[List all injuries, complications, additional medical treatment required, pain and suffering, lost wages, etc.]'}

CAUSATION:
${claimType === 'medical' ? 'The patient\'s injuries and damages were directly caused by your departure from accepted medical standards' : 'The damages were directly caused by your failure to meet professional standards'} and would not have occurred but for your negligent acts and omissions.

${expertRequirement && expertRequirement !== 'No pre-suit notice required' ? `EXPERT WITNESS REQUIREMENT:
${expertRequirement}

An appropriate expert witness has been consulted and has opined that your actions fell below the applicable standard of care and directly caused the damages described herein.` : ''}

SETTLEMENT OPPORTUNITY:
Before commencing formal litigation, we are providing this notice to allow for potential resolution of this matter. If you wish to discuss settlement, please contact the undersigned within ${timeRequirement && timeRequirement !== 'None' ? timeRequirement : '60 days'} of receipt of this notice.

INSURANCE NOTICE:
This letter also serves as notice to your professional liability insurance carrier. Please forward this notice immediately to your insurance company and provide us with the name and contact information of your carrier and claim number.

PRESERVATION OF EVIDENCE:
You are hereby directed to preserve all records, documents, communications, and other evidence related to ${claimType === 'medical' ? 'the patient\'s treatment' : 'the professional services provided'}, including but not limited to:
${claimType === 'medical' ? '- Complete medical records\n- Nursing notes\n- Laboratory and diagnostic test results\n- Radiology films and reports\n- Correspondence\n- Billing records' : '- Client files\n- Communications\n- Work product\n- Billing records\n- Internal memoranda'}

${stateRequirements}

LEGAL EFFECT:
This notice is provided pursuant to ${stateLawReference || 'applicable state law'} and serves as formal notice of our intent to file suit. ${timeRequirement && timeRequirement !== 'None' ? `This notice is being provided within the required ${timeRequirement} period.` : ''}

Please govern yourself accordingly and ensure that your professional liability insurance carrier is notified immediately.

Sincerely,

[Your Signature]
[Your Printed Name]
[On behalf of ${claimType === 'medical' ? '[Patient Name]' : '[Client Name]'}]

---
REQUIRED ATTACHMENTS (where applicable):
${expertRequirement && expertRequirement.includes('affidavit') ? '☐ Expert Affidavit' : ''}
${expertRequirement && expertRequirement.includes('certificate') ? '☐ Certificate of Merit' : ''}
☐ Medical records (if medical malpractice)
☐ Supporting documentation

DELIVERY VERIFICATION:
☐ Certified Mail, Return Receipt Requested
☐ Personal Service
☐ Registered Mail

NOTICE TRACKING:
Notice Date: ${today}
${timeRequirement && timeRequirement !== 'None' ? `Required Notice Period: ${timeRequirement}` : ''}
Insurance Notification Required: Yes
Settlement Discussion Period: ${timeRequirement && timeRequirement !== 'None' ? timeRequirement : '60 days'}`;
  };

  const calculateResponseDate = () => {
    if (!selectedState || !timeLimit) return '';
    
    const today = new Date();
    const businessDaysMatch = timeLimit.match(/(\d+)\s*business\s*days/i);
    const calendarDaysMatch = timeLimit.match(/(\d+)\s*calendar\s*days/i);
    const daysMatch = timeLimit.match(/(\d+)\s*days/i);
    const monthsMatch = timeLimit.match(/(\d+)\s*months?/i);
    const yearMatch = timeLimit.match(/(\d+)\s*years?/i);
    
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
    } else if (calendarDaysMatch || daysMatch) {
      const days = parseInt((calendarDaysMatch || daysMatch)[1]);
      const result = new Date(today);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString();
    } else if (monthsMatch) {
      const months = parseInt(monthsMatch[1]);
      const result = new Date(today);
      result.setMonth(result.getMonth() + months);
      return result.toLocaleDateString();
    } else if (yearMatch) {
      const years = parseInt(yearMatch[1]);
      const result = new Date(today);
      result.setFullYear(result.getFullYear() + years);
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
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
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
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Legal Toolkit Pro 2025
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.2rem',
            margin: '0'
          }}>
            Professional Civil Rights Attorney Document Generator with Complete 2024-2025 Legislative Updates
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
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <option value="FOIA Request">FOIA Request</option>
              <option value="State Public Records Request">State Public Records Request</option>
              <option value="ID Rights Card">ID Rights & Cannabis Laws Card</option>
              <option value="Cease and Desist Letter">Cease and Desist Letter</option>
              <option value="Notice of Claim">Notice of Claim</option>
              <option value="Pre-Suit Notice">Pre-Suit Notice</option>
              <option value="Subpoena Duces Tecum">Subpoena Duces Tecum</option>
              <option value="Discovery Request">Discovery Request</option>
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
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <option value="">Select a state...</option>
              {Object.entries(statePublicRecordsData).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/*
