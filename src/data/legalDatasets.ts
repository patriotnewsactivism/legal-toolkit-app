// src/data/legalDatasets.ts
// Comprehensive legal datasets for all 50 states + DC

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
// Legal Topics
// -----------------------------
export type LawEntry = {
  title: string;
  summary: string; // human-friendly note
  citation?: string;
  url?: string;
  updatedAt?: string; // ISO date
};

// Hostile states data - states known to be problematic for auditors and journalists
export type HostileStateEntry = {
  title: string;
  summary: string;
  warningLevel: "low" | "medium" | "high";
  specificLaws: string[];
};

// Public records laws data
export const PUBLIC_RECORDS: Record<StateCode, LawEntry> = {
  AL: {
    title: "Alabama Public Records Law",
    summary: "Alabama's Public Records Law requires government agencies to provide access to public records upon request. Response time is typically 10 business days.",
    citation: "Ala. Code § 36-12-40",
    url: "https://law.justia.com/codes/alabama/2017/title-36/chapter-12/article-2/",
    updatedAt: "2025-01-01"
  },
  AK: {
    title: "Alaska Public Records Law",
    summary: "Alaska's Public Records Act provides broad access to government records. Most records must be made available within 10 business days.",
    citation: "AS § 40.25.110-220",
    url: "https://www.akleg.gov/basis/statutes/40.25.110.htm",
    updatedAt: "2025-01-01"
  },
  AZ: {
    title: "Arizona Public Records Law",
    summary: "Arizona's Public Records Law requires disclosure of public records upon request. Records should be provided 'promptly' but no specific time limit is mandated.",
    citation: "A.R.S. § 39-121",
    url: "https://www.azleg.gov/ars/39/00121.htm",
    updatedAt: "2025-01-01"
  },
  AR: {
    title: "Arkansas Freedom of Information Act",
    summary: "Arkansas' FOIA requires public agencies to respond to record requests within 3 business days. Extensions are possible for complex requests.",
    citation: "A.C.A. § 25-19-101",
    url: "https://casetext.com/statute/arkansas-code-of-1987/title-25-government-organization-and-elections/subtitle-5-public-officers-and-employees/chapter-19-freedom-of-information-act/subchapter-1-general-provisions/section-25-19-101-purpose-and-policy",
    updatedAt: "2025-01-01"
  },
  CA: {
    title: "California Public Records Act",
    summary: "California's Public Records Act requires agencies to respond within 10 calendar days. Extensions are possible for voluminous requests.",
    citation: "Gov. Code § 6250-6276.48",
    url: "https://leginfo.legislature.ca.gov/faces/codes.xhtml?lawCode=GOV&title=1&part=2.4&division=7&chapter=3.5",
    updatedAt: "2025-01-01"
  },
  CO: {
    title: "Colorado Open Records Act",
    summary: "Colorado's Open Records Act requires responses within 3 business days. Extensions are possible with proper justification.",
    citation: "C.R.S. § 24-72-201",
    url: "https://law.justia.com/codes/colorado/2022/title-24/article-72/part-2/",
    updatedAt: "2025-01-01"
  },
  CT: {
    title: "Connecticut Freedom of Information Act",
    summary: "Connecticut's FOIA requires responses within 4 business days. Extensions are possible for voluminous requests.",
    citation: "C.G.S. § 1-200",
    url: "https://www.cga.ct.gov/current/pub/chap_001.htm#sec_21",
    updatedAt: "2025-01-01"
  },
  DE: {
    title: "Delaware Freedom of Information Act",
    summary: "Delaware's FOIA requires responses within 15 business days. Extensions are possible for complex requests.",
    citation: "29 Del. C. § 10001",
    url: "https://delcode.delaware.gov/title29/c0100/index.html",
    updatedAt: "2025-01-01"
  },
  FL: {
    title: "Florida Public Records Law",
    summary: "Florida's Government-in-the-Sunshine Law provides broad access to public records. No specific time limit but records should be provided promptly.",
    citation: "F.S. Ch. 119",
    url: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0100-0199/0119/Sections/0119.011.html",
    updatedAt: "2025-01-01"
  },
  GA: {
    title: "Georgia Open Records Act",
    summary: "Georgia's Open Records Act requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "O.C.G.A. § 50-18-70",
    url: "https://law.justia.com/codes/georgia/2010/title-50/chapter-18/article-3/",
    updatedAt: "2025-01-01"
  },
  HI: {
    title: "Hawaii Uniform Information Practices Act",
    summary: "Hawaii's UIPA requires responses within 10 business days. Extensions are possible for complex requests.",
    citation: "HRS § 92F",
    url: "https://law.justia.com/codes/hawaii/2022/title-8/chapter-92f/",
    updatedAt: "2025-01-01"
  },
  ID: {
    title: "Idaho Public Records Law",
    summary: "Idaho's Public Records Law requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "Idaho Code § 74-101",
    url: "https://legislature.idaho.gov/statutesrules/idstat/title/t63/chapter/18/section/63-1801/",
    updatedAt: "2025-01-01"
  },
  IL: {
    title: "Illinois Freedom of Information Act",
    summary: "Illinois' FOIA requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "5 ILCS 140/",
    url: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=1985&ChapterID=54",
    updatedAt: "2025-01-01"
  },
  IN: {
    title: "Indiana Access to Public Records Act",
    summary: "Indiana's APRA requires responses within 24 hours if records are readily available. Otherwise, 7 business days.",
    citation: "IC § 5-14-3",
    url: "https://iga.in.gov/legislative/laws/2021/ic/titles/05#5-14-3",
    updatedAt: "2025-01-01"
  },
  IA: {
    title: "Iowa Public Records Law",
    summary: "Iowa's Public Records Law requires records to be provided 'as soon as reasonably possible'. No specific time limit.",
    citation: "Iowa Code § 22.1",
    url: "https://www.legis.iowa.gov/docs/code/22.pdf",
    updatedAt: "2025-01-01"
  },
  KS: {
    title: "Kansas Open Records Act",
    summary: "Kansas' KORA requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "K.S.A. § 45-215",
    url: "https://www.ksrevisor.org/statutes/chapters/ch45/000000000215.html",
    updatedAt: "2025-01-01"
  },
  KY: {
    title: "Kentucky Open Records Act",
    summary: "Kentucky's Open Records Act requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "KRS § 61.870",
    url: "https://law.justia.com/codes/kentucky/2022/chapter-61/article-8/section-61-870/",
    updatedAt: "2025-01-01"
  },
  LA: {
    title: "Louisiana Public Records Law",
    summary: "Louisiana's Public Records Law requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "R.S. 44:1",
    url: "https://www.legis.la.gov/legis/Law.aspx?d=75315",
    updatedAt: "2025-01-01"
  },
  ME: {
    title: "Maine Freedom of Access Act",
    summary: "Maine's FOAA requires responses within a reasonable time. No specific time limit mandated.",
    citation: "1 M.R.S. § 401",
    url: "https://www.mainelegislature.org/legis/statutes/title1/chap401.html",
    updatedAt: "2025-01-01"
  },
  MD: {
    title: "Maryland Public Information Act",
    summary: "Maryland's PIA requires responses within 30 days. Extensions are possible for complex requests.",
    citation: "GP § 4-101",
    url: "https://govt.westlaw.com/mdc/Document/NF48A73A0E22711E8ABBEE50DE853D039?viewType=FullText&originationContext=documenttoc&transitionType=CategoryPageItem&contextData=(sc.Default)",
    updatedAt: "2025-01-01"
  },
  MA: {
    title: "Massachusetts Public Records Law",
    summary: "Massachusetts' Public Records Law requires responses within 10 business days. Extensions are possible for voluminous requests.",
    citation: "M.G.L. c.66 § 10",
    url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXVI/Chapter66/Section10",
    updatedAt: "2025-01-01"
  },
  MI: {
    title: "Michigan Freedom of Information Act",
    summary: "Michigan's FOIA requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "MCL § 15.231",
    url: "https://www.legislature.mi.gov/(S(oy05xq40dv13w0tj20t4k20a))/mileg.aspx?page=getObject&objectName=mcl-15-231",
    updatedAt: "2025-01-01"
  },
  MN: {
    title: "Minnesota Data Practices Act",
    summary: "Minnesota's Data Practices Act requires records to be provided 'promptly'. No specific time limit.",
    citation: "M.S. § 13.01",
    url: "https://www.revisor.mn.gov/statutes/cite/13.01",
    updatedAt: "2025-01-01"
  },
  MS: {
    title: "Mississippi Public Records Law",
    summary: "Mississippi's Public Records Law requires responses within 7 business days. Extensions are possible for voluminous requests.",
    citation: "Miss. Code § 25-61-1",
    url: "https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=ed4789bd-00f4-415a-8f5a-44e95552107b&nodeid=AAOAERSHADAAAAAAM&contentcomponentid=4712&hilite",
    updatedAt: "2025-01-01"
  },
  MO: {
    title: "Missouri Sunshine Law",
    summary: "Missouri's Sunshine Law requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "RSMo § 610.010",
    url: "https://revisor.mo.gov/main/OneSection.aspx?section=610.010&bid=45747&hl=public+records",
    updatedAt: "2025-01-01"
  },
  MT: {
    title: "Montana Right to Know Act",
    summary: "Montana's Right to Know Act requires records to be provided within a reasonable time. No specific time limit.",
    citation: "MCA § 2-6-1001",
    url: "https://leg.mt.gov/bills/mca/title_0020/chapter_0060/part_0100/section_0010/0020-0060-0100-0010.html",
    updatedAt: "2025-01-01"
  },
  NE: {
    title: "Nebraska Public Records Law",
    summary: "Nebraska's Public Records Law requires responses within 4 business days. Extensions are possible for voluminous requests.",
    citation: "Neb. Rev. Stat. § 84-712",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712",
    updatedAt: "2025-01-01"
  },
  NV: {
    title: "Nevada Public Records Law",
    summary: "Nevada's NPRA requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "NRS § 239",
    url: "https://www.leg.state.nv.us/NRS/NRS-239.html",
    updatedAt: "2025-01-01"
  },
  NH: {
    title: "New Hampshire Right-to-Know Law",
    summary: "New Hampshire's Right-to-Know Law requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "RSA § 91-A",
    url: "https://www.gencourt.state.nh.us/rsa/html/IX/91-A/91-A-1.htm",
    updatedAt: "2025-01-01"
  },
  NJ: {
    title: "New Jersey Open Public Records Act",
    summary: "New Jersey's OPRA requires responses within 7 business days. Extensions are possible for voluminous requests.",
    citation: "N.J.S.A. § 47:1A-1",
    url: "https://law.justia.com/codes/new-jersey/2022/title-47/section-47-1a-1/",
    updatedAt: "2025-01-01"
  },
  NM: {
    title: "New Mexico Inspection of Public Records Act",
    summary: "New Mexico's IPRA requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "NMSA § 14-2-1",
    url: "https://nmonesource.com/nmos/nmsa/en/item/4587/index.do#!fragment/zoupio-_fragDlgBodyStateConversionHref",
    updatedAt: "2025-01-01"
  },
  NY: {
    title: "New York Freedom of Information Law",
    summary: "New York's FOIL requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "POL § 84",
    url: "https://law.justia.com/codes/new-york/2022/pbo/article-6/84/",
    updatedAt: "2025-01-01"
  },
  NC: {
    title: "North Carolina Public Records Law",
    summary: "North Carolina's Public Records Law requires records to be provided 'promptly'. No specific time limit.",
    citation: "N.C.G.S. § 132-1",
    url: "https://www.ncleg.gov/Laws/Chapter-132",
    updatedAt: "2025-01-01"
  },
  ND: {
    title: "North Dakota Public Records Law",
    summary: "North Dakota's Public Records Law requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "NDCC § 44-04-18",
    url: "https://ndlegis.gov/cencode/t44c04.pdf",
    updatedAt: "2025-01-01"
  },
  OH: {
    title: "Ohio Public Records Law",
    summary: "Ohio's Public Records Law requires records to be provided 'promptly'. No specific time limit.",
    citation: "R.C. § 149.43",
    url: "https://codes.ohio.gov/ohio-revised-code/section-149.43",
    updatedAt: "2025-01-01"
  },
  OK: {
    title: "Oklahoma Open Records Act",
    summary: "Oklahoma's Open Records Act requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "51 O.S. § 24A.1",
    url: "https://oklahoma.gov/content/dam/ok/en/documents/statutes/title51/51-0024.1-opra.pdf",
    updatedAt: "2025-01-01"
  },
  OR: {
    title: "Oregon Public Records Law",
    summary: "Oregon's Public Records Law requires records to be provided within a reasonable time. No specific time limit.",
    citation: "ORS § 192.410",
    url: "https://www.oregonlegislature.gov/bills_laws/ors/ors192.html",
    updatedAt: "2025-01-01"
  },
  PA: {
    title: "Pennsylvania Right-to-Know Law",
    summary: "Pennsylvania's RTKL requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "65 P.S. § 67.101",
    url: "https://www.legis.state.pa.us/cfdocs/legis/li/consCheck.cfm?txtType=HTM&ttl=65&div=SUBTITLE&chpt=67&Sctn=1&SubSctn=101",
    updatedAt: "2025-01-01"
  },
  RI: {
    title: "Rhode Island Access to Public Records Act",
    summary: "Rhode Island's APRA requires responses within 10 business days. Extensions are possible for voluminous requests.",
    citation: "R.I.G.L. § 38-2-1",
    url: "https://law.justia.com/codes/rhode-island/2022/title-38/chapter-2/",
    updatedAt: "2025-01-01"
  },
  SC: {
    title: "South Carolina Freedom of Information Act",
    summary: "South Carolina's FOIA requires responses within 15 business days. Extensions are possible for voluminous requests.",
    citation: "S.C. Code § 30-4-10",
    url: "https://www.scstatehouse.gov/code/t30/c004.php",
    updatedAt: "2025-01-01"
  },
  SD: {
    title: "South Dakota Public Records Law",
    summary: "South Dakota's Public Records Law requires records to be provided 'as soon as practicable'. No specific time limit.",
    citation: "SDCL § 1-27-1",
    url: "https://sdlegislature.gov/Statutes/Codified_Laws/DisplayStatute.aspx?Type=Statute&Statute=1-27-1",
    updatedAt: "2025-01-01"
  },
  TN: {
    title: "Tennessee Public Records Act",
    summary: "Tennessee's Public Records Act requires responses within 7 business days. Extensions are possible for voluminous requests.",
    citation: "T.C.A. § 10-7-503",
    url: "https://law.justia.com/codes/tennessee/2022/title-10/chapter-7/part-5/",
    updatedAt: "2025-01-01"
  },
  TX: {
    title: "Texas Public Information Act",
    summary: "Texas' PIA requires responses within 10 business days. Extensions are possible for voluminous requests.",
    citation: "Gov. Code § 552",
    url: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.552.htm",
    updatedAt: "2025-01-01"
  },
  UT: {
    title: "Utah Government Records Access and Management Act",
    summary: "Utah's GRAMA requires responses within 5-10 business days. Extensions are possible for voluminous requests.",
    citation: "Utah Code § 63G-2-101",
    url: "https://le.utah.gov/xcode/Title63G/Chapter2/63G-2-S101.html",
    updatedAt: "2025-01-01"
  },
  VT: {
    title: "Vermont Public Records Law",
    summary: "Vermont's Public Records Law requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "1 V.S.A. § 315",
    url: "https://legislature.vermont.gov/statutes/section/1/003/00315",
    updatedAt: "2025-01-01"
  },
  VA: {
    title: "Virginia Freedom of Information Act",
    summary: "Virginia's FOIA requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "Va. Code § 2.2-3700",
    url: "https://law.lis.virginia.gov/vacode/title2.2/chapter37/section2.2-3700/",
    updatedAt: "2025-01-01"
  },
  WA: {
    title: "Washington Public Records Act",
    summary: "Washington's PRA requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "RCW § 42.56",
    url: "https://app.leg.wa.gov/RCW/default.aspx?cite=42.56",
    updatedAt: "2025-01-01"
  },
  WV: {
    title: "West Virginia Freedom of Information Act",
    summary: "West Virginia's FOIA requires responses within 5 business days. Extensions are possible for voluminous requests.",
    citation: "W. Va. Code § 29B-1-1",
    url: "https://code.wvlegislature.gov/29B-1-1/",
    updatedAt: "2025-01-01"
  },
  WI: {
    title: "Wisconsin Public Records Law",
    summary: "Wisconsin's Public Records Law requires records to be provided 'as soon as practicable'. No specific time limit.",
    citation: "Wis. Stat. § 19.31",
    url: "https://docs.legis.wisconsin.gov/statutes/statutes/19/i/10/31",
    updatedAt: "2025-01-01"
  },
  WY: {
    title: "Wyoming Public Records Act",
    summary: "Wyoming's Public Records Act requires responses within 3 business days. Extensions are possible for voluminous requests.",
    citation: "Wyo. Stat. § 16-4-201",
    url: "https://legisweb.state.wy.us/statutes/statute.aspx?url=https://lawfilesext.leg.wa.gov/biennium/2021-22/Pdf/Bills/Session%20Laws/SF0070S1.pdf",
    updatedAt: "2025-01-01"
  },
  DC: {
    title: "District of Columbia Freedom of Information Act",
    summary: "DC's FOIA requires responses within 15 business days. Extensions are possible for voluminous requests.",
    citation: "D.C. Code § 2-531",
    url: "https://code.dccouncil.gov/us/dc/council/code/sections/2-531",
    updatedAt: "2025-01-01"
  }
};

// Stop and ID laws data
export const STOP_AND_ID: Record<StateCode, LawEntry> = {
  AL: {
    title: "Alabama Stop and ID Law",
    summary: "Alabama requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "Ala. Code § 32-5A-182",
    url: "https://law.justia.com/codes/alabama/2017/title-32/chapter-5a/article-3/",
    updatedAt: "2025-01-01"
  },
  AK: {
    title: "Alaska Stop and ID Law",
    summary: "Alaska does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "AS § 12.25.070",
    url: "https://www.akleg.gov/basis/statutes/12.25.070.htm",
    updatedAt: "2025-01-01"
  },
  AZ: {
    title: "Arizona Stop and ID Law",
    summary: "Arizona has a 'show me your papers' law that requires individuals to provide identification when demanded by law enforcement.",
    citation: "A.R.S. § 28-3511",
    url: "https://www.azleg.gov/ars/28/03511.htm",
    updatedAt: "2025-01-01"
  },
  AR: {
    title: "Arkansas Stop and ID Law",
    summary: "Arkansas requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "A.C.A. § 5-71-213",
    url: "https://casetext.com/statute/arkansas-code-of-1987/title-5/criminal-offenses/subtitle-7/searches-seizures-and-arrests-of-persons/chapter-71-stop-and-identify-statute/section-5-71-213-stop-and-identify-statute",
    updatedAt: "2025-01-01"
  },
  CA: {
    title: "California Stop and ID Law",
    summary: "California does not require individuals to provide identification during police encounters unless driving or under arrest.",
    citation: "Cal. Penal Code § 854",
    url: "https://leginfo.legislature.ca.gov/faces/codes.xhtml?lawCode=PEN&sectionCode=854",
    updatedAt: "2025-01-01"
  },
  CO: {
    title: "Colorado Stop and ID Law",
    summary: "Colorado requires individuals to provide identification when stopped by law enforcement if there is reasonable suspicion of criminal activity.",
    citation: "C.R.S. § 16-3-103",
    url: "https://law.justia.com/codes/colorado/2022/title-16/article-3/part-1/section-16-3-103/",
    updatedAt: "2025-01-01"
  },
  CT: {
    title: "Connecticut Stop and ID Law",
    summary: "Connecticut does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Conn. Gen. Stat. § 54-100a",
    url: "https://www.cga.ct.gov/current/pub/chap_208.htm#sec_54-100a",
    updatedAt: "2025-01-01"
  },
  DE: {
    title: "Delaware Stop and ID Law",
    summary: "Delaware requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "11 Del. C. § 1902",
    url: "https://delcode.delaware.gov/title11/c019/index.html",
    updatedAt: "2025-01-01"
  },
  FL: {
    title: "Florida Stop and ID Law",
    summary: "Florida requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "Fla. Stat. § 322.05",
    url: "https://www.legis.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0300-0399/0322/Sections/0322.05.html",
    updatedAt: "2025-01-01"
  },
  GA: {
    title: "Georgia Stop and ID Law",
    summary: "Georgia requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "O.C.G.A. § 40-5-67.1",
    url: "https://law.justia.com/codes/georgia/2010/title-40/chapter-5/article-2/section-40-5-67.1/",
    updatedAt: "2025-01-01"
  },
  HI: {
    title: "Hawaii Stop and ID Law",
    summary: "Hawaii requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "HRS § 291C-172",
    url: "https://law.justia.com/codes/hawaii/2022/title-17/chapter-291c/section-291c-172/",
    updatedAt: "2025-01-01"
  },
  ID: {
    title: "Idaho Stop and ID Law",
    summary: "Idaho does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Idaho Code § 19-611",
    url: "https://legislature.idaho.gov/statutesrules/idstat/title/t19/chapter/6/section/19-611/",
    updatedAt: "2025-01-01"
  },
  IL: {
    title: "Illinois Stop and ID Law",
    summary: "Illinois requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "725 ILCS 5/107-14",
    url: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=1985&ChapterID=54",
    updatedAt: "2025-01-01"
  },
  IN: {
    title: "Indiana Stop and ID Law",
    summary: "Indiana requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "IC § 9-19-16-1",
    url: "https://iga.in.gov/legislative/laws/2021/ic/titles/09#9-19-16-1",
    updatedAt: "2025-01-01"
  },
  IA: {
    title: "Iowa Stop and ID Law",
    summary: "Iowa does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Iowa Code § 804.7",
    url: "https://www.legis.iowa.gov/docs/code/804.pdf",
    updatedAt: "2025-01-01"
  },
  KS: {
    title: "Kansas Stop and ID Law",
    summary: "Kansas requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "K.S.A. § 22-2402",
    url: "https://www.ksrevisor.org/statutes/chapters/ch22/000000002402.html",
    updatedAt: "2025-01-01"
  },
  KY: {
    title: "Kentucky Stop and ID Law",
    summary: "Kentucky does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "KRS § 15.250",
    url: "https://law.justia.com/codes/kentucky/2022/chapter-15/article-2/section-15-250/",
    updatedAt: "2025-01-01"
  },
  LA: {
    title: "Louisiana Stop and ID Law",
    summary: "Louisiana requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "La. R.S. § 32:412",
    url: "https://www.legis.la.gov/legis/Law.aspx?d=86156",
    updatedAt: "2025-01-01"
  },
  ME: {
    title: "Maine Stop and ID Law",
    summary: "Maine does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "30-A M.R.S. § 2751",
    url: "https://www.mainelegislature.org/legis/statutes/title30a/chap2751.html",
    updatedAt: "2025-01-01"
  },
  MD: {
    title: "Maryland Stop and ID Law",
    summary: "Maryland does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Md. Code Ann., Cts. & Jud. Proc. § 5-105",
    url: "https://govt.westlaw.com/mdc/Document/NF48A73A0E22711E8ABBEE50DE853D039?viewType=FullText&originationContext=documenttoc&transitionType=CategoryPageItem&contextData=(sc.Default)",
    updatedAt: "2025-01-01"
  },
  MA: {
    title: "Massachusetts Stop and ID Law",
    summary: "Massachusetts does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "M.G.L. c.276 § 20A",
    url: "https://malegislature.gov/Laws/GeneralLaws/PartIII/TitleII/Chapter276/Section20A",
    updatedAt: "2025-01-01"
  },
  MI: {
    title: "Michigan Stop and ID Law",
    summary: "Michigan does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "MCL § 750.479",
    url: "https://www.legislature.mi.gov/(S(oy05xq40dv13w0tj20t4k20a))/mileg.aspx?page=getObject&objectName=mcl-750-479",
    updatedAt: "2025-01-01"
  },
  MN: {
    title: "Minnesota Stop and ID Law",
    summary: "Minnesota does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "M.S.A. § 629.34",
    url: "https://www.revisor.mn.gov/statutes/cite/629.34",
    updatedAt: "2025-01-01"
  },
  MS: {
    title: "Mississippi Stop and ID Law",
    summary: "Mississippi does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Miss. Code Ann. § 97-37-29",
    url: "https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=ed4789bd-00f4-415a-8f5a-44e95552107b&nodeid=AAOAERSHADAAAAAAM&contentcomponentid=4712&hilite",
    updatedAt: "2025-01-01"
  },
  MO: {
    title: "Missouri Stop and ID Law",
    summary: "Missouri requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "RSMo § 577.023",
    url: "https://revisor.mo.gov/main/OneSection.aspx?section=577.023&bid=36198&hl=identification",
    updatedAt: "2025-01-01"
  },
  MT: {
    title: "Montana Stop and ID Law",
    summary: "Montana requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "MCA § 46-5-401",
    url: "https://leg.mt.gov/bills/mca/title_0460/chapter_0050/part_0040/section_0010/0460-0050-0040-0010.html",
    updatedAt: "2025-01-01"
  },
  NE: {
    title: "Nebraska Stop and ID Law",
    summary: "Nebraska requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "Neb. Rev. Stat. § 29-829",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=29-829",
    updatedAt: "2025-01-01"
  },
  NV: {
    title: "Nevada Stop and ID Law",
    summary: "Nevada requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "NRS § 484B.107",
    url: "https://www.leg.state.nv.us/NRS/NRS-484B.html#NRS484BSec107",
    updatedAt: "2025-01-01"
  },
  NH: {
    title: "New Hampshire Stop and ID Law",
    summary: "New Hampshire requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "RSA § 265:67-a",
    url: "https://www.gencourt.state.nh.us/rsa/html/XXVI/265/265-67-a.htm",
    updatedAt: "2025-01-01"
  },
  NJ: {
    title: "New Jersey Stop and ID Law",
    summary: "New Jersey does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "N.J.S.A. § 2C:3-5",
    url: "https://law.justia.com/codes/new-jersey/2022/title-2c/section-2c-3-5/",
    updatedAt: "2025-01-01"
  },
  NM: {
    title: "New Mexico Stop and ID Law",
    summary: "New Mexico requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "NMSA § 30-22-3",
    url: "https://nmonesource.com/nmos/nmsa/en/item/4587/index.do#!fragment/zoupio-_fragDlgBodyStateConversionHref",
    updatedAt: "2025-01-01"
  },
  NY: {
    title: "New York Stop and ID Law",
    summary: "New York requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "CPL § 140.50",
    url: "https://law.justia.com/codes/new-york/2022/cpn/article-140/140-50/",
    updatedAt: "2025-01-01"
  },
  NC: {
    title: "North Carolina Stop and ID Law",
    summary: "North Carolina does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "N.C.G.S. § 20-16-2",
    url: "https://www.ncleg.gov/Laws/Chapter-20",
    updatedAt: "2025-01-01"
  },
  ND: {
    title: "North Dakota Stop and ID Law",
    summary: "North Dakota requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "NDCC § 39-10-09",
    url: "https://ndlegis.gov/cencode/t39c10.pdf",
    updatedAt: "2025-01-01"
  },
  OH: {
    title: "Ohio Stop and ID Law",
    summary: "Ohio requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "ORC § 4507.02",
    url: "https://codes.ohio.gov/ohio-revised-code/section-4507.02",
    updatedAt: "2025-01-01"
  },
  OK: {
    title: "Oklahoma Stop and ID Law",
    summary: "Oklahoma does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "63 O.S. § 2-506",
    url: "https://oklahoma.gov/content/dam/ok/en/documents/statutes/title63/63-00506-failure-to-identify.pdf",
    updatedAt: "2025-01-01"
  },
  OR: {
    title: "Oregon Stop and ID Law",
    summary: "Oregon does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "ORS § 163.525",
    url: "https://www.oregonlegislature.gov/bills_laws/ors/ors163.html",
    updatedAt: "2025-01-01"
  },
  PA: {
    title: "Pennsylvania Stop and ID Law",
    summary: "Pennsylvania does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "18 Pa.C.S. § 4904",
    url: "https://www.legis.state.pa.us/cfdocs/legis/li/consCheck.cfm?txtType=HTM&ttl=18&div=PART&chpt=49&Sctn=4&SubSctn=0",
    updatedAt: "2025-01-01"
  },
  RI: {
    title: "Rhode Island Stop and ID Law",
    summary: "Rhode Island requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "R.I.G.L. § 12-28-1",
    url: "https://law.justia.com/codes/rhode-island/2022/title-12/chapter-28/section-12-28-1/",
    updatedAt: "2025-01-01"
  },
  SC: {
    title: "South Carolina Stop and ID Law",
    summary: "South Carolina does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "S.C. Code § 16-23-620",
    url: "https://www.scstatehouse.gov/code/t16/c023.php",
    updatedAt: "2025-01-01"
  },
  SD: {
    title: "South Dakota Stop and ID Law",
    summary: "South Dakota does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "SDCL § 23A-32-2",
    url: "https://sdlegislature.gov/Statutes/Codified_Laws/DisplayStatute.aspx?Type=Statute&Statute=23A-32-2",
    updatedAt: "2025-01-01"
  },
  TN: {
    title: "Tennessee Stop and ID Law",
    summary: "Tennessee does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "T.C.A. § 39-17-308",
    url: "https://law.justia.com/codes/tennessee/2022/title-39/chapter-17/part-3/",
    updatedAt: "2025-01-01"
  },
  TX: {
    title: "Texas Stop and ID Law",
    summary: "Texas requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "Tex. Penal Code § 38.02",
    url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.38.htm",
    updatedAt: "2025-01-01"
  },
  UT: {
    title: "Utah Stop and ID Law",
    summary: "Utah requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "Utah Code § 77-7-15",
    url: "https://le.utah.gov/xcode/Title77/Chapter7/77-7-S15.html",
    updatedAt: "2025-01-01"
  },
  VT: {
    title: "Vermont Stop and ID Law",
    summary: "Vermont does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "13 V.S.A. § 5301",
    url: "https://legislature.vermont.gov/statutes/section/13/015/05301",
    updatedAt: "2025-01-01"
  },
  VA: {
    title: "Virginia Stop and ID Law",
    summary: "Virginia does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Va. Code § 18.2-216",
    url: "https://law.lis.virginia.gov/vacode/title18.2/chapter6/section18.2-216/",
    updatedAt: "2025-01-01"
  },
  WA: {
    title: "Washington Stop and ID Law",
    summary: "Washington does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "RCW § 9A.76.040",
    url: "https://app.leg.wa.gov/RCW/default.aspx?cite=9A.76.040",
    updatedAt: "2025-01-01"
  },
  WV: {
    title: "West Virginia Stop and ID Law",
    summary: "West Virginia does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "W. Va. Code § 61-5-4a",
    url: "https://code.wvlegislature.gov/61-5-4a/",
    updatedAt: "2025-01-01"
  },
  WI: {
    title: "Wisconsin Stop and ID Law",
    summary: "Wisconsin requires individuals to provide identification when stopped by law enforcement under certain circumstances.",
    citation: "Wis. Stat. § 968.24",
    url: "https://docs.legis.wisconsin.gov/statutes/statutes/968/i/24",
    updatedAt: "2025-01-01"
  },
  WY: {
    title: "Wyoming Stop and ID Law",
    summary: "Wyoming does not generally require individuals to provide identification during police encounters unless under arrest.",
    citation: "Wyo. Stat. § 6-2-104",
    url: "https://legisweb.state.wy.us/statutes/statute.aspx?url=https://lawfilesext.leg.wa.gov/biennium/2021-22/Pdf/Bills/Session%20Laws/SF0070S1.pdf",
    updatedAt: "2025-01-01"
  },
  DC: {
    title: "District of Columbia Stop and ID Law",
    summary: "DC requires individuals to provide identification when stopped by law enforcement during traffic stops.",
    citation: "D.C. Code § 50-2302.02",
    url: "https://code.dccouncil.gov/us/dc/council/code/sections/50-2302.02",
    updatedAt: "2025-01-01"
  }
};

// Cannabis laws data
export const CANNABIS: Record<StateCode, LawEntry> = {
  AK: {
    title: "Alaska Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Alaska. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 6 plants for personal use.",
    citation: "AS § 17.38.005-18.99.310",
    url: "https://www.akleg.gov/basis/statutes/17.38.005.htm",
    updatedAt: "2025-01-01"
  },
  AZ: {
    title: "Arizona Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Arizona. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 6 plants for personal use.",
    citation: "A.R.S. § 36-2801 to 36-2815",
    url: "https://www.azleg.gov/ars/36/02801.htm",
    updatedAt: "2025-01-01"
  },
  CA: {
    title: "California Cannabis Law",
    summary: "Recreational and medical cannabis are legal in California. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 6 plants for personal use.",
    citation: "Cal. Health & Safety Code § 11362.2",
    url: "https://leginfo.legislature.ca.gov/faces/codes.xhtml?lawCode=HSC&division=10.&title=&part=&chapter=10.&article=3.",
    updatedAt: "2025-01-01"
  },
  CO: {
    title: "Colorado Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Colorado. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 6 plants for personal use.",
    citation: "C.R.S. § 18-18-406",
    url: "https://law.justia.com/codes/colorado/2022/title-18/article-18/part-4/section-18-18-406/",
    updatedAt: "2025-01-01"
  },
  CT: {
    title: "Connecticut Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Connecticut. Adults 21+ can possess up to 1.5 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "Conn. Gen. Stat. § 21a-408",
    url: "https://www.cga.ct.gov/current/pub/chap_420.htm",
    updatedAt: "2025-01-01"
  },
  DE: {
    title: "Delaware Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Delaware. Adults 21+ can possess up to 1 ounce of cannabis but home cultivation is not permitted.",
    citation: "21 Del. C. § 4901",
    url: "https://delcode.delaware.gov/title21/c049/index.html",
    updatedAt: "2025-01-01"
  },
  IL: {
    title: "Illinois Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Illinois. Adults 21+ can possess up to 30 grams of cannabis and grow up to 5 plants for personal use.",
    citation: "410 ILCS 705/",
    url: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3594&ChapterID=49",
    updatedAt: "2025-01-01"
  },
  ME: {
    title: "Maine Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Maine. Adults 21+ can possess up to 2.5 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "34-A M.R.S. § 5001",
    url: "https://www.mainelegislature.org/legis/statutes/title34a/chap5001.html",
    updatedAt: "2025-01-01"
  },
  MD: {
    title: "Maryland Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Maryland. Adults 21+ can possess up to 1.5 ounces of cannabis and grow up to 2 plants for personal use.",
    citation: "Md. Code Ann., Crim. Law § 5-601",
    url: "https://govt.westlaw.com/mdc/Document/NF48A73A0E22711E8ABBEE50DE853D039?viewType=FullText&originationContext=documenttoc&transitionType=CategoryPageItem&contextData=(sc.Default)",
    updatedAt: "2025-01-01"
  },
  MA: {
    title: "Massachusetts Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Massachusetts. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 6 plants for personal use.",
    citation: "M.G.L. c. 94G",
    url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXVI/Chapter94G",
    updatedAt: "2025-01-01"
  },
  MI: {
    title: "Michigan Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Michigan. Adults 21+ can possess up to 2.5 ounces of cannabis and grow up to 12 plants for personal use.",
    citation: "MCL § 333.27401",
    url: "https://www.legislature.mi.gov/(S(oy05xq40dv13w0tj20t4k20a))/mileg.aspx?page=getObject&objectName=mcl-333-27401",
    updatedAt: "2025-01-01"
  },
  MN: {
    title: "Minnesota Cannabis Law",
    summary: "Recreational cannabis is legal in Minnesota. Adults 21+ can possess up to 2 ounces of cannabis and grow up to 8 plants for personal use.",
    citation: "M.S.A. § 152.21",
    url: "https://www.revisor.mn.gov/statutes/cite/152.21",
    updatedAt: "2025-01-01"
  },
  MO: {
    title: "Missouri Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Missouri. Adults 21+ can possess up to 3 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "Mo. Rev. Stat. § 195.005",
    url: "https://revisor.mo.gov/main/OneSection.aspx?section=195.005&bid=10898&hl=cannabis",
    updatedAt: "2025-01-01"
  },
  MT: {
    title: "Montana Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Montana. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 4 plants for personal use.",
    citation: "MCA § 45-8-101",
    url: "https://leg.mt.gov/bills/mca/title_0450/chapter_0080/part_0010/section_0010/0450-0080-0010-0010.html",
    updatedAt: "2025-01-01"
  },
  NV: {
    title: "Nevada Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Nevada. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 6 plants for personal use.",
    citation: "NRS § 453A.010",
    url: "https://www.leg.state.nv.us/NRS/NRS-453A.html",
    updatedAt: "2025-01-01"
  },
  NJ: {
    title: "New Jersey Cannabis Law",
    summary: "Recreational and medical cannabis are legal in New Jersey. Adults 21+ can possess up to 1 ounce of cannabis but home cultivation is not permitted.",
    citation: "N.J.S.A. § 24:6I-1",
    url: "https://law.justia.com/codes/new-jersey/2022/title-24/section-24-6i-1/",
    updatedAt: "2025-01-01"
  },
  NM: {
    title: "New Mexico Cannabis Law",
    summary: "Recreational and medical cannabis are legal in New Mexico. Adults 21+ can possess up to 2 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "NMSA § 30-31-1",
    url: "https://nmonesource.com/nmos/nmsa/en/item/4587/index.do#!fragment/zoupio-_fragDlgBodyStateConversionHref",
    updatedAt: "2025-01-01"
  },
  NY: {
    title: "New York Cannabis Law",
    summary: "Recreational and medical cannabis are legal in New York. Adults 21+ can possess up to 3 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "NY CPL § 224-a",
    url: "https://law.justia.com/codes/new-york/2022/cpn/article-224-a/",
    updatedAt: "2025-01-01"
  },
  OH: {
    title: "Ohio Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Ohio. Adults 21+ can possess up to 2.5 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "ORC § 3796.01",
    url: "https://codes.ohio.gov/ohio-revised-code/section-3796.01",
    updatedAt: "2025-01-01"
  },
  OR: {
    title: "Oregon Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Oregon. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 4 plants for personal use.",
    citation: "ORS § 475B.005",
    url: "https://www.oregonlegislature.gov/bills_laws/ors/ors475B.html",
    updatedAt: "2025-01-01"
  },
  RI: {
    title: "Rhode Island Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Rhode Island. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 3 plants for personal use.",
    citation: "R.I.G.L. § 21-28.6-4",
    url: "https://law.justia.com/codes/rhode-island/2022/title-21/chapter-28.6/section-21-28.6-4/",
    updatedAt: "2025-01-01"
  },
  VT: {
    title: "Vermont Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Vermont. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 2 mature and 4 immature plants for personal use.",
    citation: "33 V.S.A. § 501",
    url: "https://legislature.vermont.gov/statutes/section/33/005/00501",
    updatedAt: "2025-01-01"
  },
  VA: {
    title: "Virginia Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Virginia. Adults 21+ can possess up to 1 ounce of cannabis and grow up to 4 plants for personal use.",
    citation: "Va. Code § 18.2-248.1",
    url: "https://law.lis.virginia.gov/vacode/title18.2/chapter7/section18.2-248.1/",
    updatedAt: "2025-01-01"
  },
  WA: {
    title: "Washington Cannabis Law",
    summary: "Recreational and medical cannabis are legal in Washington. Adults 21+ can possess up to 1 ounce of cannabis. Medical patients can grow up to 6 plants.",
    citation: "RCW § 69.50.360",
    url: "https://app.leg.wa.gov/RCW/default.aspx?cite=69.50.360",
    updatedAt: "2025-01-01"
  },
  DC: {
    title: "District of Columbia Cannabis Law",
    summary: "Recreational and medical cannabis are legal in DC. Adults 21+ can possess up to 2 ounces of cannabis and grow up to 6 plants for personal use.",
    citation: "D.C. Code § 48-901.02",
    url: "https://code.dccouncil.gov/us/dc/council/code/sections/48-901.02",
    updatedAt: "2025-01-01"
  },
  // Medical-only states
  AL: {
    title: "Alabama Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Alabama. Qualified patients can possess up to 70 days supply but home cultivation is not permitted.",
    citation: "Ala. Code § 20-2H-1",
    url: "https://law.justia.com/codes/alabama/2021/title-20/chapter-2h/",
    updatedAt: "2025-01-01"
  },
  AR: {
    title: "Arkansas Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Arkansas. Qualified patients can possess up to 2.5 ounces every 14 days but home cultivation is not permitted.",
    citation: "A.C.A. § 17-87-101",
    url: "https://casetext.com/statute/arkansas-code-of-1987/title-17/controlled-substances-and-drugs-of-abuse/subtitle-87/medical-marijuana-act-of-2016/chapter-101-general-provisions",
    updatedAt: "2025-01-01"
  },
  FL: {
    title: "Florida Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Florida. Qualified patients can possess up to 4 ounces but home cultivation is not permitted.",
    citation: "Fla. Stat. § 381.986",
    url: "https://www.legis.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0300-0399/0381/Sections/0381.986.html",
    updatedAt: "2025-01-01"
  },
  GA: {
    title: "Georgia Low-THC Cannabis Law",
    summary: "Only low-THC cannabis oil is legal in Georgia for qualified patients. Possession of other cannabis products remains illegal.",
    citation: "O.C.G.A. § 16-13-32",
    url: "https://law.justia.com/codes/georgia/2010/title-16/chapter-13/article-2/part-3/section-16-13-32/",
    updatedAt: "2025-01-01"
  },
  HI: {
    title: "Hawaii Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Hawaii. Qualified patients can possess up to 4 ounces and grow up to 7 plants.",
    citation: "HRS § 329-121",
    url: "https://law.justia.com/codes/hawaii/2022/title-18/chapter-329/part-xv/",
    updatedAt: "2025-01-01"
  },
  LA: {
    title: "Louisiana Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Louisiana. Qualified patients can possess up to 2.5 ounces but home cultivation is not permitted.",
    citation: "La. R.S. § 40:1317.1001",
    url: "https://www.legis.la.gov/legis/Law.aspx?d=117036",
    updatedAt: "2025-01-01"
  },
  MS: {
    title: "Mississippi Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Mississippi. Qualified patients can possess up to 2.5 ounces every 14 days but home cultivation is not permitted.",
    citation: "Miss. Code § 41-29-136",
    url: "https://advance.lexis.com/documentpage/?pdmfid=1000516&crid=ed4789bd-00f4-415a-8f5a-44e95552107b&nodeid=AAOAERSHADAAAAAAM&contentcomponentid=4712&hilite",
    updatedAt: "2025-01-01"
  },
  ND: {
    title: "North Dakota Medical Cannabis Law",
    summary: "Only medical cannabis is legal in North Dakota. Qualified patients can possess up to 3 ounces but home cultivation is not permitted.",
    citation: "NDCC § 19-03.1-01",
    url: "https://ndlegis.gov/cencode/t19c03_1.pdf",
    updatedAt: "2025-01-01"
  },
  NH: {
    title: "New Hampshire Medical Cannabis Law",
    summary: "Only medical cannabis is legal in New Hampshire. Qualified patients can possess up to 2 ounces per month but home cultivation is not permitted.",
    citation: "RSA § 126-X:1",
    url: "https://www.gencourt.state.nh.us/rsa/html/126-X/126-X-1.htm",
    updatedAt: "2025-01-01"
  },
  OK: {
    title: "Oklahoma Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Oklahoma. Qualified patients can possess up to 3 ounces of cannabis and grow up to 6 mature plants and 6 seedlings.",
    citation: "63 O.S. § 2-601",
    url: "https://oklahoma.gov/content/dam/ok/en/documents/statutes/title63/63-00601-medical-marijuana-and-industrial-hemp.pdf",
    updatedAt: "2025-01-01"
  },
  PA: {
    title: "Pennsylvania Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Pennsylvania. Qualified patients can possess up to 3 ounces but home cultivation is not permitted.",
    citation: "35 P.S. § 10231.101",
    url: "https://www.legis.state.pa.us/cfdocs/legis/li/consCheck.cfm?txtType=HTM&ttl=35&div=SUBTITLE&chpt=10231&Sctn=1&SubSctn=101",
    updatedAt: "2025-01-01"
  },
  SD: {
    title: "South Dakota Medical Cannabis Law",
    summary: "Only medical cannabis is legal in South Dakota. Qualified patients can possess up to 3 ounces but home cultivation is not permitted.",
    citation: "SDCL § 34-20B-1",
    url: "https://sdlegislature.gov/Statutes/Codified_Laws/DisplayStatute.aspx?Type=Statute&Statute=34-20B-1",
    updatedAt: "2025-01-01"
  },
  UT: {
    title: "Utah Medical Cannabis Law",
    summary: "Only medical cannabis is legal in Utah. Qualified patients can possess up to 113 grams but home cultivation is not permitted.",
    citation: "Utah Code § 58-37-8.2",
    url: "https://le.utah.gov/xcode/Title58/Chapter37/58-37-S8.2.html",
    updatedAt: "2025-01-01"
  },
  WV: {
    title: "West Virginia Medical Cannabis Law",
    summary: "Only medical cannabis is legal in West Virginia. Qualified patients can possess up to 3 ounces per month but home cultivation is not permitted.",
    citation: "W. Va. Code § 16-29-1",
    url: "https://code.wvlegislature.gov/16-29-1/",
    updatedAt: "2025-01-01"
  },
  // CBD-only states
  IN: {
    title: "Indiana CBD Law",
    summary: "Only CBD products with less than 0.3% THC are legal in Indiana. Possession of other cannabis products remains illegal.",
    citation: "IC § 16-42-19-1",
    url: "https://iga.in.gov/legislative/laws/2021/ic/titles/16#16-42-19-1",
    updatedAt: "2025-01-01"
  },
  IA: {
    title: "Iowa CBD Law",
    summary: "Only CBD products with less than 0.3% THC are legal in Iowa. Possession of other cannabis products remains illegal.",
    citation: "Iowa Code § 124.504",
    url: "https://www.legis.iowa.gov/docs/code/124.pdf",
    updatedAt: "2025-01-01"
  },
  KY: {
    title: "Kentucky Cannabis Law",
    summary: "Only medical cannabis is legal in Kentucky. Qualified patients can possess up to 8 ounces but home cultivation is not permitted.",
    citation: "KRS § 218A.010",
    url: "https://law.justia.com/codes/kentucky/2022/chapter-218a/article-1/section-218a-010/",
    updatedAt: "2025-01-01"
  },
  NC: {
    title: "North Carolina Cannabis Law",
    summary: "Possession of up to 0.5 ounces of cannabis is decriminalized in North Carolina. Medical cannabis is also legal for qualified patients.",
    citation: "N.C.G.S. § 90-95",
    url: "https://www.ncleg.gov/Laws/Chapter-90",
    updatedAt: "2025-01-01"
  },
  TN: {
    title: "Tennessee CBD Law",
    summary: "Only CBD products with less than 0.9% THC are legal in Tennessee. Possession of other cannabis products remains illegal.",
    citation: "T.C.A. § 39-17-418",
    url: "https://law.justia.com/codes/tennessee/2022/title-39/chapter-17/part-4/",
    updatedAt: "2025-01-01"
  },
  TX: {
    title: "Texas CBD Law",
    summary: "Only CBD products with less than 0.3% THC are legal in Texas. Possession of other cannabis products remains illegal.",
    citation: "Tex. Health & Safety Code § 487.001",
    url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.487.htm",
    updatedAt: "2025-01-01"
  },
  WI: {
    title: "Wisconsin CBD Law",
    summary: "Only CBD products with less than 0.3% THC are legal in Wisconsin. Possession of other cannabis products remains illegal.",
    citation: "Wis. Stat. § 961.01",
    url: "https://docs.legis.wisconsin.gov/statutes/statutes/961/i/01/1",
    updatedAt: "2025-01-01"
  },
  // Illegal states
  ID: {
    title: "Idaho Cannabis Law",
    summary: "Cannabis remains illegal in Idaho. Possession of any amount of cannabis is a criminal offense.",
    citation: "Idaho Code § 37-2705",
    url: "https://legislature.idaho.gov/statutesrules/idstat/title/t37/chapter/27/section/37-2705/",
    updatedAt: "2025-01-01"
  },
  KS: {
    title: "Kansas Cannabis Law",
    summary: "Cannabis remains illegal in Kansas. Possession of any amount of cannabis is a criminal offense.",
    citation: "K.S.A. § 65-4161",
    url: "https://www.ksrevisor.org/statutes/chapters/ch65/00000004161.html",
    updatedAt: "2025-01-01"
  },
  SC: {
    title: "South Carolina Cannabis Law",
    summary: "Cannabis remains illegal in South Carolina. Possession of any amount of cannabis is a criminal offense.",
    citation: "S.C. Code § 44-53-370",
    url: "https://www.scstatehouse.gov/code/t44/c053.php",
    updatedAt: "2025-01-01"
  },
  WY: {
    title: "Wyoming Cannabis Law",
    summary: "Cannabis remains illegal in Wyoming. Possession of any amount of cannabis is a criminal offense.",
    citation: "Wyo. Stat. § 35-7-1031",
    url: "https://legisweb.state.wy.us/statutes/statute.aspx?url=https://lawfilesext.leg.wa.gov/biennium/2021-22/Pdf/Bills/Session%20Laws/SF0070S1.pdf",
    updatedAt: "2025-01-01"
  }
};

// Hostile states data - states known to be problematic for auditors and journalists
export const HOSTILE_STATES: Record<StateCode, HostileStateEntry> = {
  FL: {
    title: "Florida - Hostile to Journalists",
    summary: "Florida has been identified as increasingly hostile to journalists and auditors. Recent laws have made it more difficult to access public records and conduct investigations.",
    warningLevel: "high",
    specificLaws: [
      "Florida's 'Stop WOKE Act' restricts how educational institutions can discuss current events",
      "New restrictions on public records requests for certain government communications",
      "Increased surveillance of journalists and media organizations"
    ]
  },
  TX: {
    title: "Texas - Hostile to Journalists",
    summary: "Texas has implemented several laws that make it difficult for journalists and auditors to operate freely.",
    warningLevel: "medium",
    specificLaws: [
      "Strict identification requirements during police encounters",
      "Restrictions on access to government records",
      "Laws targeting 'fake news' and media credibility"
    ]
  },
  OH: {
    title: "Ohio - Hostile to Auditors",
    summary: "Ohio has been identified as having laws that can make auditing and investigative work challenging.",
    warningLevel: "medium",
    specificLaws: [
      "Recent restrictions on public records requests",
      "Increased scrutiny of organizations filing frequent FOIA requests",
      "Penalties for perceived misuse of public records"
    ]
  }
};

// Notice requirements data
export const NOTICE_RULES: Record<StateCode, LawEntry> = {
  CA: {
    title: "California Notice Requirements",
    summary: "California requires a 6-month notice period for government tort claims. Use the standard government claim form and ensure timely presentment.",
    citation: "Gov. Code § 911.2",
    url: "https://leginfo.legislature.ca.gov/faces/codes.xhtml?lawCode=GOV&title=1&part=2.4&division=7&chapter=3.5",
    updatedAt: "2025-01-01"
  },
  MA: {
    title: "Massachusetts Notice Requirements",
    summary: "Massachusetts requires a 2-year notice period for government tort claims. Presentment to the executive officer is required.",
    citation: "M.G.L. c.258 § 4",
    url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXVI/Chapter258/Section4",
    updatedAt: "2025-01-01"
  },
  NJ: {
    title: "New Jersey Notice Requirements",
    summary: "New Jersey requires a 90-day notice period for government tort claims. Notice of claim with limited extension for extraordinary circumstances is required.",
    citation: "N.J.S.A. § 59:8-8",
    url: "https://law.justia.com/codes/new-jersey/2022/title-59/section-59-8-8/",
    updatedAt: "2025-01-01"
  }
};

// -----------------------------
// Datasets registry
// -----------------------------
export const legalDatasets: LegalDataset[] = [
  {
    id: "public-records",
    name: "Public Records Laws",
    description: "Comprehensive public records laws for all 50 states and DC with response timeframes and citations.",
    source: "State statutes",
    tags: ["records", "usa", "laws"],
    updatedAt: "2025-01-01",
  },
  {
    id: "stop-and-id",
    name: "Stop and ID Laws",
    description: "Detailed information about state laws regarding identification requirements during police encounters.",
    source: "State statutes",
    tags: ["id", "police", "usa", "laws"],
    updatedAt: "2025-01-01",
  },
  {
    id: "cannabis",
    name: "Cannabis Laws",
    description: "Complete cannabis laws for all 50 states and DC including recreational, medical, and CBD regulations.",
    source: "State statutes",
    tags: ["cannabis", "marijuana", "usa", "laws"],
    updatedAt: "2025-01-01",
  },
  {
    id: "hostile-states",
    name: "Hostile States Information",
    description: "Information about states that are known to be problematic for auditors and journalists.",
    source: "Legal research",
    tags: ["hostile", "journalists", "auditors", "usa"],
    updatedAt: "2025-01-01",
  },
  {
    id: "notice-requirements",
    name: "Notice Requirements",
    description: "State-specific notice requirements for legal actions against government entities.",
    source: "State statutes",
    tags: ["notice", "government", "claims", "usa"],
    updatedAt: "2025-01-01",
  }
];

export const DATASETS_BY_ID: Record<string, LegalDataset> = Object.fromEntries(
  legalDatasets.map((d) => [d.id, d])
);

export function getDatasetById(id: string): LegalDataset | undefined {
  return DATASETS_BY_ID[id];
}

export default legalDatasets;