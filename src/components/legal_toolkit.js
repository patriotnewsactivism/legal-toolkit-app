// filepath: src/components/LegalToolkitPro.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * LegalToolkitPro 2025 – fixed & compilable
 * Notes:
 * - Replace the SAMPLE data objects with your full datasets when ready.
 * - `generatedLetter` can be a string (letters) or a React node (ID card).
 */

// ========================= SAMPLE DATASETS (truncate/extend as needed) =========================
// Public Records (sample subset)
const statePublicRecordsData = {
  AL: {
    name: "Alabama",
    statute: "Alabama Open Records Act (Code of Alabama § 36-12-40)",
    timeLimit: "7-10 business days",
  },
  AK: {
    name: "Alaska",
    statute: "Alaska Public Records Act (AS § 40.25.110-40.25.220)",
    timeLimit: "10 business days",
  },
  AZ: {
    name: "Arizona",
    statute: "Arizona Public Records Law (A.R.S. § 39-121)",
    timeLimit: "Promptly (no specific timeframe)",
  },
  AR: {
    name: "Arkansas",
    statute: "Arkansas Freedom of Information Act (A.C.A. § 25-19-101)",
    timeLimit: "3 business days",
  },
  CA: {
    name: "California",
    statute:
      "California Public Records Act (Government Code §§ 7920.000 et seq.) - RECODIFIED 2023",
    timeLimit: "10 calendar days",
    updates: "Complete recodification under AB 473, effective January 1, 2023",
  },
  CO: {
    name: "Colorado",
    statute: "Colorado Open Records Act (C.R.S. § 24-72-201)",
    timeLimit: "3 business days",
  },
  DC: {
    name: "District of Columbia",
    statute: "DC Freedom of Information Act (DC Code § 2-531)",
    timeLimit: "15 business days",
  },
};

// Cannabis Laws (sample subset)
const cannabisLaws = {
  AK: {
    status: "Recreational & Medical",
    enacted: "2014",
    possession: "1 oz flower, 6 plants (3 mature)",
    details: "Ballot Measure 2 with 53% support",
  },
  AZ: {
    status: "Recreational & Medical",
    enacted: "2020",
    possession: "1 oz flower, 6 plants, 5g concentrates",
    details: "Smart and Safe Arizona Act (Prop 207)",
  },
  CA: {
    status: "Recreational & Medical",
    enacted: "2016",
    possession: "1 oz flower, 6 plants, 8g concentrates",
    details: "Prop 64",
  },
  CO: {
    status: "Recreational & Medical",
    enacted: "2012",
    possession: "1 oz flower, 6 plants (3 mature)",
    details: "Amendment 64",
  },
  DC: {
    status: "Recreational & Medical",
    enacted: "2014",
    possession: "2 oz flower, 6 plants",
    details: "Initiative 71 (no retail sales)",
  },
  AL: {
    status: "Medical Only",
    enacted: "2021",
    possession: "Qualified patients only",
    details: "Compassion Act",
  },
  AR: {
    status: "Medical Only",
    enacted: "2016",
    possession: "2.5 oz per 14 days",
    details: "Arkansas Medical Marijuana Amendment",
  },
};

// Stop-and-Identify & recording (sample subset; simplify complex nuances)
const stateIDRights = {
  AL: {
    stopAndID: true,
    law: "Ala. Code § 15-5-30",
    idRequired: "Name/address on reasonable suspicion",
    recording: "One-party consent",
  },
  AK: {
    stopAndID: false,
    law: "No stop-and-identify statute",
    idRequired: "Only when driving/under arrest",
    recording: "One-party consent",
  },
  AZ: {
    stopAndID: true,
    law: "A.R.S. § 13-2412",
    idRequired: "True full name if lawfully detained",
    recording: "One-party consent",
  },
  CA: {
    stopAndID: false,
    law: "No stop-and-identify statute",
    idRequired: "Only when driving/under arrest",
    recording: "Two-party consent",
  },
  CO: {
    stopAndID: true,
    law: "C.R.S. § 16-3-103",
    idRequired: "Name/address; ID if available",
    recording: "One-party consent",
  },
  DC: {
    stopAndID: false,
    law: "No stop-and-identify statute",
    idRequired: "Only when driving/under arrest",
    recording: "One-party consent",
  },
};

// Notice requirements (sample subset)
const stateNoticeRequirements = {
  AL: {
    govTortClaim: {
      timeLimit: "1 year",
      statute: "Ala. Code § 11-47-190",
      requirements: "Written notice required",
    },
    medMalpractice: {
      timeLimit: "90 days",
      statute: "Ala. Code § 6-5-484",
      requirements: "Pre-suit notice with expert affidavit",
    },
    ceaseDesist: { requirements: "No specific statutory requirements" },
  },
  AZ: {
    govTortClaim: {
      timeLimit: "180 days",
      statute: "A.R.S. § 12-821.01",
      requirements: "Notice of claim required within 180 days",
    },
    medMalpractice: {
      timeLimit: "None",
      statute: "No pre-suit notice required",
      requirements: "No pre-suit notice required",
    },
    ceaseDesist: {
      requirements:
        "Immediate cessation on receipt for some regulated contexts (see title-specific statutes)",
    },
  },
  CA: {
    govTortClaim: {
      timeLimit: "6 months",
      statute: "Gov. Code § 911.2",
      requirements: "Gov tort claim form within 6 months",
    },
    medMalpractice: {
      timeLimit: "90 days",
      statute: "CCP § 364",
      requirements: "90-day notice; expert declaration best practice",
    },
    ceaseDesist: { requirements: "Varies by cause of action (e.g., Civ. Code)" },
  },
  CO: {
    govTortClaim: {
      timeLimit: "182 days",
      statute: "C.R.S. § 24-10-109",
      requirements: "Written notice within 182 days",
    },
    medMalpractice: {
      timeLimit: "None",
      statute: "No pre-suit notice required",
      requirements: "No pre-suit notice required",
    },
    ceaseDesist: { requirements: "C.R.S. § 6-1-105 (UDAP) may apply" },
  },
  DC: {
    govTortClaim: {
      timeLimit: "6 months",
      statute: "D.C. Code § 12-309",
      requirements: "Notice to Mayor within 6 months",
    },
    medMalpractice: {
      timeLimit: "None",
      statute: "No pre-suit notice required",
      requirements: "Expert required at litigation stage",
    },
    ceaseDesist: { requirements: "CPPA may apply (D.C. Code § 28-3901 et seq.)" },
  },
};

// ========================= COMPONENT =========================
const LegalToolkitPro = () => {
  const [documentType, setDocumentType] = useState("FOIA Request");
  const [agency, setAgency] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [incident, setIncident] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState(/** string | React.ReactNode */ "");
  const [timeLimit, setTimeLimit] = useState("");
  const [statute, setStatute] = useState("");
  const [recipient, setRecipient] = useState("");
  const [claimType, setClaimType] = useState("general");
  const [damages, setDamages] = useState("");
  const [violationType, setViolationType] = useState("harassment");
  const [plaintiffName, setPlaintiffName] = useState("");
  const [plaintiffAddress, setPlaintiffAddress] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [defendantAddress, setDefendantAddress] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [courtName, setCourtName] = useState("");
  const [discoveryType, setDiscoveryType] = useState("interrogatories");
  const [requestNumber, setRequestNumber] = useState("001");

  // Helper: current state data
  const currentStateData = useMemo(
    () => (selectedState ? statePublicRecordsData[selectedState] : undefined),
    [selectedState]
  );

  // When state/document/claim changes, update statute/time/jurisdiction
  useEffect(() => {
    if (!selectedState) {
      setJurisdiction("");
      setTimeLimit("");
      setStatute("");
      return;
    }

    // FOIA / Public Records
    if (documentType === "FOIA Request" || documentType === "State Public Records Request") {
      if (currentStateData) {
        setJurisdiction(currentStateData.name);
        setTimeLimit(currentStateData.timeLimit);
        setStatute(currentStateData.statute);
      }
      return;
    }

    // Notice of Claim (government) / Pre-Suit (medical)
    const reqs = stateNoticeRequirements[selectedState];
    if (documentType === "Notice of Claim" && claimType === "government" && reqs?.govTortClaim) {
      setJurisdiction(currentStateData?.name || "");
      setTimeLimit(reqs.govTortClaim.timeLimit);
      setStatute(reqs.govTortClaim.statute);
      return;
    }
    if (documentType === "Pre-Suit Notice" && claimType === "medical" && reqs?.medMalpractice) {
      setJurisdiction(currentStateData?.name || "");
      setTimeLimit(reqs.medMalpractice.timeLimit);
      setStatute(reqs.medMalpractice.statute);
      return;
    }

    // ID Rights Card
    if (documentType === "ID Rights Card" && stateIDRights[selectedState]) {
      setJurisdiction(currentStateData?.name || "");
      setTimeLimit(stateIDRights[selectedState].stopAndID ? "Stop-and-Identify State" : "No Stop-and-Identify Law");
      setStatute(stateIDRights[selectedState].law);
      return;
    }

    // Default
    setJurisdiction(currentStateData?.name || "");
    setTimeLimit("");
    setStatute("");
  }, [selectedState, documentType, claimType, currentStateData]);

  // Deadline calculator
  const calculateResponseDate = () => {
    if (!timeLimit) return "";

    const today = new Date();
    const businessDaysMatch = timeLimit.match(/(\d+)\s*business\s*days/i);
    const calendarDaysMatch = timeLimit.match(/(\d+)\s*calendar\s*days/i);
    const daysMatch = timeLimit.match(/(\d+)\s*days/i);
    const monthsMatch = timeLimit.match(/(\d+)\s*months?/i);
    const yearsMatch = timeLimit.match(/(\d+)\s*years?/i);

    const result = new Date(today);

    if (businessDaysMatch) {
      const days = parseInt(businessDaysMatch[1], 10);
      let count = 0;
      while (count < days) {
        result.setDate(result.getDate() + 1);
        const dow = result.getDay();
        if (dow !== 0 && dow !== 6) count += 1; // skip weekends
      }
      return result.toLocaleDateString();
    }

    if (calendarDaysMatch || daysMatch) {
      const days = parseInt((calendarDaysMatch || daysMatch)[1], 10);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString();
    }

    if (monthsMatch) {
      const months = parseInt(monthsMatch[1], 10);
      result.setMonth(result.getMonth() + months);
      return result.toLocaleDateString();
    }

    if (yearsMatch) {
      const years = parseInt(yearsMatch[1], 10);
      result.setFullYear(result.getFullYear() + years);
      return result.toLocaleDateString();
    }

    return "Consult statute for specific deadline";
  };

  // ========================= Generators =========================
  const generateFOIARequest = (today) => {
    const updates = currentStateData?.updates ? `\n\n**LEGISLATIVE UPDATE:** ${currentStateData.updates}` : "";

    return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${agency || "[Agency Name]"}
FOIA Officer/Records Custodian
[Agency Address]
[City, State, ZIP Code]

Re: Freedom of Information Act Request - EXPEDITED PROCESSING REQUESTED

Dear FOIA Officer:

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, and any applicable state public records laws${
      selectedState ? ` including the ${statute}` : ""
    }, I hereby request access to and copies of the following records:

SUBJECT MATTER: ${
      incident || "[Please describe the specific records you are seeking with maximum specificity]"
    }

JURISDICTION: ${jurisdiction || "[Specify the relevant jurisdiction]"}

${
      selectedState
        ? `APPLICABLE STATE LAW: This request is also made under ${statute}, which provides for disclosure of public records within ${timeLimit}.`
        : ""
    }${updates}

DETAILED REQUEST SPECIFICATIONS:

- Time Period: [Specify exact dates or time range]
- Record Types: [emails, reports, policies, audio/video, databases, metadata]
- Individuals/Entities: [names/depts]
- Keywords: [terms, case numbers]
- Format: Electronic format preferred (searchable/native with metadata)

COMPREHENSIVE RECORD TYPES REQUESTED (any format):
• Paper & electronic files
• Emails & attachments
• Text/IM/chat logs
• Audio & video
• Photos/images
• Database/spreadsheets
• Calendars & minutes
• Contracts & legal docs
• Reports/studies/analyses
• Policies & SOPs
• Training/presentations
• Third-party correspondence
• All associated metadata

PUBLIC INTEREST & FEE WAIVER REQUEST:
I request a fee waiver as release will significantly contribute to public understanding of government operations. If fees cannot be fully waived:
1) Contact me if costs exceed $50; 2) Provide detailed estimate; 3) Consider partial waiver.

EXPEDITED PROCESSING REQUEST:
☐ Compelling need to inform the public
☐ Exceptional media interest
☐ Time-sensitive constitutional concerns

SEGREGABILITY & PARTIAL DISCLOSURE:
If any portion is withheld, identify the exemption for each document, provide a Vaughn index, and release all reasonably segregable portions with marked redactions.

PRESERVATION NOTICE:
Please preserve all responsive records and suspend routine destruction.

${
      selectedState
        ? `RESPONSE TIMEFRAME: Under ${statute}, respond within ${timeLimit}. Please acknowledge receipt and provide an estimated completion date.`
        : "Please respond within the statutorily required timeframe and acknowledge receipt."
    }

Sincerely,

[Your Signature]
[Your Printed Name]
[Your Title/Organization]

-----
DELIVERY VERIFICATION:
☐ Email (read receipt) ☐ Certified Mail ☐ Portal ☐ Hand Delivery

REQUEST TRACKING:
Request Date: ${today}
Response Due: [Calculate based on ${timeLimit || "applicable law"}]
Request No.: [Assigned by agency]
Follow-up: [Set reminder]

APPEAL RIGHTS:
If denied, I reserve the right to appeal to the appropriate authority within the statutory window.`;
  };

  const generateSubpoenaDucesTecum = (today) => {
    return `${courtName || "[COURT NAME]"}
${jurisdiction || "[JURISDICTION]"}

${plaintiffName || "[PLAINTIFF]"}, Plaintiff(s),

v.                                     Case No. ${caseNumber || "[CASE NUMBER]"}

${defendantName || "[DEFENDANT]"}, Defendant(s).

SUBPOENA DUCES TECUM

TO: ${recipient || "[WITNESS NAME]"}
[Address]\n[City, State, ZIP]

YOU ARE COMMANDED to appear at the time, date, and place below to testify and to produce the documents, ESI, or objects described below.

APPEARANCE DETAILS:
Date: [Date]\nTime: [Time]\nLocation: [Location]\nBefore: [Officer/Court Reporter]

DOCUMENTS/ESI TO BE PRODUCED:
${incident || "[Describe with specificity the documents/ESI/tangible things]"}

TIME PERIOD: [Start]–[End]
FORMAT: Native with metadata; if unavailable, PDF with available metadata.
PRIVILEGE LOG: If withholding, provide log identifying each item and basis.
INSPECTION: Items may be inspected/copied at [location] by appointment.

${
      selectedState
        ? `APPLICABLE LAW: Issued pursuant to ${statute} and applicable rules of civil procedure.`
        : `Issued pursuant to applicable rules of civil procedure.`
    }

WITNESS FEES: Tendered as provided by law.

Date: ${today}

_________________________
[Attorney Name]\n[Bar No.]\nAttorney for ${plaintiffName || "[Plaintiff]"}\n[Law Firm]\n[Address]\n[City, State, ZIP]\n[Phone]\n[Email]

CERTIFICATE OF SERVICE:
Method: ☐ Personal ☐ Certified Mail ☐ Email ☐ Other\nDate: ________\n
_________________________
[Signature]
`;
  };

  const generateDiscoveryRequest = (today) => {
    const title =
      discoveryType === "interrogatories"
        ? "INTERROGATORIES"
        : discoveryType === "requests_for_production"
        ? "REQUESTS FOR PRODUCTION OF DOCUMENTS"
        : discoveryType === "requests_for_admission"
        ? "REQUESTS FOR ADMISSION"
        : "DISCOVERY REQUESTS";

    const interro = `
INTERROGATORIES:
1. State your full name, aliases, address, phone, DOB, and SSN (last 4).
2. Identify persons with knowledge of ${incident || "the matters alleged"}.
3. Describe in detail your actions regarding ${incident || "the subject matter"}.
4. Identify documents in your possession relating to ${incident || "the subject matter"}.
5. State all facts supporting your denials.
6. Identify expert witnesses and anticipated testimony.
7. Describe all damages claimed.
8. Identify insurance policies applicable to this suit.
9. State whether you have given any statements; provide details.
10. List lawsuits to which you have been a party in 10 years.
`;

    const rfp = `
REQUESTS FOR PRODUCTION:
1. All documents supporting your interrogatory answers.
2. All documents relating to ${incident || "the subject matter"}.
3. All communications with third parties regarding ${incident || "the subject matter"}.
4. All photos/videos/audio relating to ${incident || "the subject matter"}.
5. All contracts, policies, and procedures in effect at the time.
6. All training materials/guidelines relating to ${incident || "the subject matter"}.
7. All incident/accident reports relating to ${incident || "the incident"}.
8. All insurance policies and agreements that may provide coverage.
9. All expert reports/studies/analyses relating to ${incident || "the subject matter"}.
10. All electronic communications (email/text/social) relating to ${incident || "the subject"}.
`;

    const rfa = `
REQUESTS FOR ADMISSION:
1. Admit you were present at the location where ${incident || "the incident occurred"}.
2. Admit you had knowledge of the relevant facts and circumstances.
3. Admit genuineness of documents attached to the complaint.
4. Admit receipt of notice regarding ${incident || "the events"}.
5. Admit you failed to follow applicable policies and procedures.
6. Admit your actions were a proximate cause of plaintiff's damages.
7. Admit you have no evidence for your affirmative defenses.
8. Admit accuracy of statements attributed to you in the complaint.
9. Admit insurance coverage applies to the claims in this lawsuit.
10. Admit you consulted with experts regarding ${incident || "the subject matter"}.
`;

    const body =
      discoveryType === "interrogatories"
        ? interro
        : discoveryType === "requests_for_production"
        ? rfp
        : discoveryType === "requests_for_admission"
        ? rfa
        : "";

    return `${courtName || "[COURT NAME]"}
${jurisdiction || "[JURISDICTION]"}

${plaintiffName || "[PLAINTIFF]"}, Plaintiff(s),

v.                                     Case No. ${caseNumber || "[CASE NUMBER]"}

${defendantName || "[DEFENDANT]"}, Defendant(s).

${(plaintiffName || "[PLAINTIFF]").toUpperCase()}'S ${title} TO ${(defendantName || "[DEFENDANT]").toUpperCase()}
(SET ${requestNumber || "001"})

TO: ${defendantName || "[Defendant]"}\n${defendantAddress || "[Defendant Address]"}

YOU ARE HEREBY REQUESTED to respond to the following ${title.toLowerCase()} under the Rules of Civil Procedure.

DEFINITIONS & INSTRUCTIONS (abbrev.):
• “Document” includes ESI.
• “Communication” covers written/oral/electronic.
• “Identify” person => name, address, phone, title.
• “Identify” document => date, author, addressee, type, subject, custodian.
• Duty to supplement.

${body}

PRIVILEGE LOG: If withholding, provide a log (type, subject, date, author/recipients, privilege claimed).
ESI: Produce in native format with metadata when reasonably usable; otherwise PDF with available metadata.
${
      selectedState
        ? `APPLICABLE LAW: Propounded pursuant to ${statute} and applicable rules.`
        : `Propounded pursuant to applicable rules.`
    }

RESPONSE DEADLINE: 30 days from service (unless modified by order or agreement).

Date: ${today}

Respectfully submitted,\n\n[Attorney Name]\n[Bar No.]\nAttorney for ${plaintiffName || "[Plaintiff]"}\n[Law Firm]\n[Address]\n[City, State, ZIP]\n[Phone]\n[Email]
`;
  };

  const generateCeaseDesistLetter = (today) => {
    const req = selectedState && stateNoticeRequirements[selectedState]?.ceaseDesist;
    const stateSpecific = req?.requirements ? `\n\nSTATE-SPECIFIC REQUIREMENTS: ${req.requirements}` : "";

    return `[Your Name]
[Your Address]\n[City, State, ZIP]\n[Email]\n[Phone]

${today}

${recipient || "[Recipient Name]"}\n[Recipient Address]\n[City, State, ZIP]

RE: FORMAL CEASE AND DESIST – ${violationType.toUpperCase()} VIOLATIONS
${jurisdiction ? `JURISDICTION: ${jurisdiction}\n` : ""}
SENT VIA: CERTIFIED MAIL (RRR)

Dear ${recipient || "[Recipient]"}:

FORMAL NOTICE TO CEASE AND DESIST
You are hereby DEMANDED to immediately cease and desist from the following unlawful conduct:

SPECIFIC VIOLATIONS:
${
      incident || "[Describe violations with dates/times/locations/witnesses and evidence]"
    }

LEGAL BASIS:
• Applicable federal, state, and local laws (list specific statutes/regulations).${stateSpecific}

DEMANDS:
1) Cease all ${violationType} activities immediately.
2) Remove/retract infringing or unlawful materials.
3) Preserve all relevant evidence.
4) Provide written confirmation of compliance within ${req?.mandatoryNotice || "10 business days"}.

DAMAGES/HARM:
${
      damages ||
      "[Describe monetary losses, reputational harm, emotional distress, lost business, attorneys’ fees, etc.]"
    }

CONSEQUENCES OF NON-COMPLIANCE:
• TRO/preliminary injunction and permanent injunctive relief.
• Actual, statutory, and punitive damages; fees and costs where authorized.
• Referral to regulators or law enforcement where applicable.

This notice preserves all rights and remedies. No waiver is intended.

Very truly yours,\n\n[Signature]\n[Printed Name]\n[Title]
`;
  };

  const generateNoticeOfClaim = (today) => {
    let stateRequirements = "";
    let timeRequirement = "";
    let stateLawReference = "";

    const req = selectedState ? stateNoticeRequirements[selectedState] : undefined;
    if (claimType === "government" && req?.govTortClaim) {
      timeRequirement = req.govTortClaim.timeLimit;
      stateLawReference = req.govTortClaim.statute;
      stateRequirements = `\n\nSTATE REQUIREMENTS:\n- Filing Deadline: ${req.govTortClaim.timeLimit}\n- Statute: ${req.govTortClaim.statute}\n- Procedure: ${req.govTortClaim.requirements}`;
    }

    return `[Your Name]
[Your Address]\n[City, State, ZIP]\n[Email]\n[Phone]

${today}

${agency || recipient || "[Government Entity/Recipient]"}\n${
      claimType === "government"
        ? "Claims Administrator/Risk Management Department"
        : "Legal Department"
    }\n[Address]\n[City, State, ZIP]

RE: FORMAL NOTICE OF CLAIM – ${
      claimType === "government" ? "GOVERNMENT LIABILITY" : "CIVIL LIABILITY"
    }
${jurisdiction ? `JURISDICTION: ${jurisdiction}\n` : ""}${
      stateLawReference ? `GOVERNING LAW: ${stateLawReference}\n` : ""
    }CLAIM VALUE: ${damages || "$[AMOUNT]"}

SENT VIA: CERTIFIED MAIL (RRR)

NOTICE OF CLAIM
This notice concerns substantial damages resulting from the incident(s) described below.

CLAIMANT INFO:
• Name/Address/Phone/Email/DOB/SSN (last 4)

INCIDENT DETAILS:
• Date/Time/Location/Weather/Witnesses

FACTUAL NARRATIVE:
${
      incident ||
      "[Provide exhaustive, chronological description of the incident and aftermath]"
    }

LEGAL THEORIES:
• Negligence, gross negligence; failure to train/supervise; dangerous condition; constitutional violations (42 U.S.C. § 1983), etc.

DAMAGES:
• Medical expenses, lost wages/earning capacity, property damage, non-economic damages, punitive (if warranted).

EVIDENCE PRESERVATION DEMAND: Preserve all documents, ESI, video, policies, training, and related materials.
${stateRequirements}

SETTLEMENT: Please contact to discuss resolution within 30 days.
${
      timeRequirement
        ? `DEADLINE: Under ${stateLawReference}, notice must be filed within ${timeRequirement} of the incident.`
        : ""
    }

Respectfully submitted,\n\n[Signature]\n[Printed Name]\n[Title]
`;
  };

  const generatePreSuitNotice = (today) => {
    let block = "";
    const req = selectedState ? stateNoticeRequirements[selectedState] : undefined;
    const med = req?.medMalpractice;

    if (claimType === "medical" && med) {
      block = `\n\nSTATE REQUIREMENTS (${(jurisdiction || "").toUpperCase()}):\n- Pre-Suit Notice Period: ${med.timeLimit}\n- Statute: ${med.statute}\n- Expert/Procedure: ${med.requirements}`;
    }

    return `[Your Name]
[Your Address]\n[City, State, ZIP]\n[Email]\n[Phone]

${today}

${recipient || "[Healthcare Professional]"}\n[License #]\n[Address]\n[City, State, ZIP]

RE: PRE-SUIT NOTICE OF PROFESSIONAL LIABILITY CLAIM – ${
      claimType === "medical" ? "MEDICAL MALPRACTICE" : "PROFESSIONAL NEGLIGENCE"
    }
${jurisdiction ? `JURISDICTION: ${jurisdiction}\n` : ""}
${statute ? `GOVERNING STATUTE: ${statute}\n` : ""}
CLAIM VALUE: ${damages || "$[SUBSTANTIAL DAMAGES]"}

Dear ${recipient || "[Professional]"}:

You are hereby notified of intent to commence a professional liability action arising from your ${
      claimType === "medical" ? "medical treatment" : "professional services"
    } provided to [Patient/Client Name].

PERIOD OF CARE/SERVICES: [Start]–[End]\nLOCATIONS: [Facilities/Offices]

DETAILED DESCRIPTION OF NEGLIGENCE:
${
      incident ||
      "[Exhaustive description of alleged negligence; specific acts/omissions; breaches of standard; causation]"
    }

STANDARD OF CARE VIOLATIONS (examples):
• Examination/history; diagnostics; timely diagnosis; appropriate treatment; monitoring; informed consent; referral; documentation; communication.

INJURIES & DAMAGES:
• Medical injuries/complications; economic/non-economic losses; future care.

EXPERT CERTIFICATION (if required):\n[Attach affidavit/certificate/qualifications summary].

SETTLEMENT WINDOW: Please contact within ${med?.timeLimit || "60 days"} to discuss resolution prior to suit.
${block}

Sincerely,\n\n[Signature]\n[Printed Name]
`;
  };

  // Main dispatcher
  const generateLetter = () => {
    const today = new Date().toLocaleDateString();

    let letterNode = "";
    if (documentType === "FOIA Request") letterNode = generateFOIARequest(today);
    else if (documentType === "ID Rights Card") letterNode = generateIDRightsCard();
    else if (documentType === "Cease and Desist Letter") letterNode = generateCeaseDesistLetter(today);
    else if (documentType === "Notice of Claim") letterNode = generateNoticeOfClaim(today);
    else if (documentType === "Pre-Suit Notice") letterNode = generatePreSuitNotice(today);
    else if (documentType === "Subpoena Duces Tecum") letterNode = generateSubpoenaDucesTecum(today);
    else if (documentType === "Discovery Request") letterNode = generateDiscoveryRequest(today);

    setGeneratedLetter(letterNode);
  };

  // Card generator (returns React node)
  const generateIDRightsCard = () => {
    if (!selectedState || !stateIDRights[selectedState]) {
      return (
        <div style={{ padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
          Select a state to generate your ID Rights Card
        </div>
      );
    }

    const stateName = statePublicRecordsData[selectedState]?.name || "[STATE]";
    const rights = stateIDRights[selectedState];
    const cannabisData = cannabisLaws[selectedState];

    return (
      <div
        id="id-rights-card"
        style={{
          width: 400,
          height: 300,
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          borderRadius: 15,
          padding: 20,
          color: "white",
          fontFamily: "Arial, sans-serif",
          fontSize: 11,
          lineHeight: 1.3,
          position: "relative",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          border: "2px solid #fff",
        }}
      >
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid rgba(255,255,255,0.3)",
            paddingBottom: 8,
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: "bold" }}>{stateName.toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>
            CIVIL RIGHTS & LAWS REFERENCE CARD
          </div>
        </div>

        <div style={{ display: "flex", gap: 15, height: 200 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: 10, fontWeight: "bold", marginBottom: 6, color: "#ffd700" }}
            >
              CONSTITUTIONAL RIGHTS
            </div>
            <div style={{ fontSize: 9, marginBottom: 4 }}>• I do not consent to searches</div>
            <div style={{ fontSize: 9, marginBottom: 4 }}>• I invoke my right to remain silent</div>
            <div style={{ fontSize: 9, marginBottom: 4 }}>• I do not waive any rights</div>
            <div style={{ fontSize: 9, marginBottom: 8 }}>• I want a lawyer if detained</div>

            <div
              style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4, color: "#ffd700" }}
            >
              STATE LAWS
            </div>
            <div style={{ fontSize: 8, marginBottom: 4 }}>
              {rights.stopAndID ? `✓ Stop & ID: ${rights.law}` : "✗ No Stop & ID Law"}
            </div>
            <div style={{ fontSize: 8, marginBottom: 4 }}>Recording: {rights.recording}</div>
            {cannabisData && (
              <div style={{ fontSize: 8, marginBottom: 4, color: "#90EE90" }}>
                Cannabis: {cannabisData.status}
              </div>
            )}
            <div style={{ fontSize: 8, marginBottom: 4 }}>
              FOIA Response: {statePublicRecordsData[selectedState]?.timeLimit || "N/A"}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: 10, fontWeight: "bold", marginBottom: 6, color: "#ffd700" }}
            >
              POLICE ENCOUNTER SCRIPT
            </div>
            <div style={{ fontSize: 8, marginBottom: 3, fontWeight: 600 }}>
              "Officer, am I being detained or am I free to go?"
            </div>
            <div style={{ fontSize: 8, marginBottom: 2 }}>
              <strong>If FREE TO GO:</strong>
            </div>
            <div style={{ fontSize: 7, marginBottom: 4, fontStyle: "italic" }}>
              "I choose to leave now. Have a good day."
            </div>
            <div style={{ fontSize: 8, marginBottom: 2 }}>
              <strong>If DETAINED:</strong>
            </div>
            <div style={{ fontSize: 7, marginBottom: 2 }}>
              "I respectfully decline to answer questions."
            </div>
            <div style={{ fontSize: 7, marginBottom: 2 }}>"I do not consent to any search."</div>
            <div style={{ fontSize: 7, marginBottom: 4 }}>
              {rights.stopAndID
                ? '"Please state the law requiring me to provide ID."'
                : '"I am not required to show ID unless driving or under arrest."'}
            </div>
            <div style={{ fontSize: 8, marginBottom: 2 }}>
              <strong>If ARRESTED:</strong>
            </div>
            <div style={{ fontSize: 7, marginBottom: 4 }}>
              "I invoke my right to remain silent and want a lawyer."
            </div>
            <div style={{ fontSize: 8, marginBottom: 2 }}>
              <strong>EMERGENCY CONTACTS:</strong>
            </div>
            <div style={{ fontSize: 7 }}>Attorney: _______________</div>
            <div style={{ fontSize: 7 }}>Emergency: _______________</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 20,
            right: 20,
            borderTop: "1px solid rgba(255,255,255,0.3)",
            paddingTop: 4,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 7,
            opacity: 0.8,
          }}
        >
          <div>Generated: {new Date().toLocaleDateString()}</div>
          <div>Civil Rights Toolkit Pro 2025</div>
        </div>
      </div>
    );
  };

  // ========================= UI =========================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            borderBottom: "3px solid #1e3c72",
            paddingBottom: 20,
          }}
        >
          <h1
            style={{
              color: "#1e3c72",
              fontSize: "3rem",
              fontWeight: 700,
              margin: "0 0 10px 0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Legal Toolkit Pro 2025
          </h1>
          <p style={{ color: "#666", fontSize: "1.2rem", margin: 0 }}>
            Attorney-Level Document Generator • 2024–2025 Legislative Hooks
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 25,
            marginBottom: 30,
          }}
        >
          <div>
            <label
              style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}
            >
              📄 Document Type:
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{
                width: "100%",
                padding: 15,
                border: "2px solid #3498db",
                borderRadius: 12,
                fontSize: 16,
                color: "#000",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
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
            <label
              style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}
            >
              🏛️ State/Jurisdiction:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: "100%",
                padding: 15,
                border: "2px solid #3498db",
                borderRadius: 12,
                fontSize: 16,
                color: "#000",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
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

        {/* Cannabis section */}
        {selectedState && cannabisLaws[selectedState] && (
          <div
            style={{
              backgroundColor: "#f0f8ff",
              border: "2px solid #4169e1",
              borderRadius: 15,
              padding: 20,
              marginBottom: 25,
              boxShadow: "0 4px 15px rgba(65, 105, 225, 0.1)",
            }}
          >
            <h3 style={{ color: "#4169e1", marginTop: 0, marginBottom: 15, fontSize: "1.3rem", fontWeight: 600 }}>
              🌿 {statePublicRecordsData[selectedState].name} Cannabis Laws – Civil Rights Impact
            </h3>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15 }}
            >
              <div>
                <strong>Legal Status:</strong> {cannabisLaws[selectedState].status}
              </div>
              {cannabisLaws[selectedState].enacted !== "N/A" && (
                <div>
                  <strong>Enacted:</strong> {cannabisLaws[selectedState].enacted}
                </div>
              )}
              <div>
                <strong>Possession Limits:</strong> {cannabisLaws[selectedState].possession}
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
              <strong>Details:</strong> {cannabisLaws[selectedState].details}
            </div>
            {(cannabisLaws[selectedState].status === "Fully Illegal" ||
              cannabisLaws[selectedState].status === "CBD Only") && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: "#ffebee",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#c62828",
                }}
              >
                <strong>⚠️ Civil Rights Notice:</strong> Possession remains illegal. Know your rights during encounters.
              </div>
            )}
          </div>
        )}

        {/* Litigation-specific fields */}
        {(documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request") && (
          <div style={{ backgroundColor: "#fff8e1", border: "2px solid #ffa726", borderRadius: 15, padding: 20, marginBottom: 25 }}>
            <h3 style={{ color: "#f57c00", marginTop: 0, marginBottom: 20 }}>⚖️ Litigation Document Fields</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>Plaintiff Name:</label>
                <input type="text" value={plaintiffName} onChange={(e) => setPlaintiffName(e.target.value)} placeholder="Enter plaintiff name" style={{ width: "100%", padding: 12, border: "2px solid #ffa726", borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>Defendant Name:</label>
                <input type="text" value={defendantName} onChange={(e) => setDefendantName(e.target.value)} placeholder="Enter defendant name" style={{ width: "100%", padding: 12, border: "2px solid #ffa726", borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>Case Number:</label>
                <input type="text" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} placeholder="Enter case number" style={{ width: "100%", padding: 12, border: "2px solid #ffa726", borderRadius: 8, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>Court Name:</label>
                <input type="text" value={courtName} onChange={(e) => setCourtName(e.target.value)} placeholder="Enter court name" style={{ width: "100%", padding: 12, border: "2px solid #ffa726", borderRadius: 8, fontSize: 14 }} />
              </div>
            </div>
            {documentType === "Discovery Request" && (
              <div style={{ marginTop: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>Discovery Type:</label>
                <select value={discoveryType} onChange={(e) => setDiscoveryType(e.target.value)} style={{ width: "100%", padding: 12, border: "2px solid #ffa726", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
                  <option value="interrogatories">Interrogatories</option>
                  <option value="requests_for_production">Requests for Production of Documents</option>
                  <option value="requests_for_admission">Requests for Admission</option>
                </select>
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50" }}>Set Number:</label>
                  <input type="text" value={requestNumber} onChange={(e) => setRequestNumber(e.target.value)} style={{ width: "100%", padding: 12, border: "2px solid #ffa726", borderRadius: 8, fontSize: 14 }} />
                </div>
              </div>
            )}
          </div>
        )}

        {(documentType === "Notice of Claim" || documentType === "Pre-Suit Notice") && (
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>🎯 Claim Type:</label>
            <select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              style={{ width: "100%", padding: 15, border: "2px solid #e74c3c", borderRadius: 12, fontSize: 16, color: "#000", backgroundColor: "#fff", cursor: "pointer" }}
            >
              {documentType === "Notice of Claim" && (
                <>
                  <option value="government">Government/Municipal Tort Claim</option>
                  <option value="general">General Civil Liability Claim</option>
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

        {documentType === "Cease and Desist Letter" && (
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>⚠️ Violation Type:</label>
            <select value={violationType} onChange={(e) => setViolationType(e.target.value)} style={{ width: "100%", padding: 15, border: "2px solid #e74c3c", borderRadius: 12, fontSize: 16, color: "#000", backgroundColor: "#fff", cursor: "pointer" }}>
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

        {selectedState && (
          <div style={{ backgroundColor: "#e8f5e8", border: "2px solid #27ae60", borderRadius: 15, padding: 25, marginBottom: 30, boxShadow: "0 4px 15px rgba(39, 174, 96, 0.1)" }}>
            <h3 style={{ color: "#27ae60", marginTop: 0, marginBottom: 20, fontSize: "1.3rem", fontWeight: 600 }}>
              📋 Auto-Populated Legal Information for {statePublicRecordsData[selectedState].name}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50", fontSize: "1rem" }}>⚖️ Applicable Statute:</label>
                <div style={{ padding: 12, border: "2px solid #27ae60", borderRadius: 8, fontSize: 14, backgroundColor: "#fff", fontFamily: "monospace", wordBreak: "break-word" }}>
                  {statute || "Select document type for statute information"}
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50", fontSize: "1rem" }}>⏰ Time Requirement:</label>
                <div style={{ padding: 12, border: "2px solid #27ae60", borderRadius: 8, fontSize: 16, backgroundColor: "#fff", fontWeight: 600 }}>
                  {timeLimit || "Select document type for time requirements"}
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#2c3e50", fontSize: "1rem" }}>📅 Deadline Calculation:</label>
                <div style={{ padding: 12, border: "2px solid #e74c3c", borderRadius: 8, fontSize: 16, backgroundColor: "#fff5f5", fontWeight: 600 }}>
                  {calculateResponseDate() || "Select document type for deadline calculation"}
                </div>
              </div>
              {statePublicRecordsData[selectedState]?.updates && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#e74c3c", fontSize: "1rem" }}>🚨 2024–2025 Legislative Updates:</label>
                  <div style={{ padding: 12, border: "2px solid #e74c3c", borderRadius: 8, fontSize: 14, backgroundColor: "#fff5f5", fontWeight: 600 }}>
                    {statePublicRecordsData[selectedState].updates}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 25, marginBottom: 30 }}>
          <div>
            <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>
              {documentType === "FOIA Request" || documentType === "State Public Records Request"
                ? "🏢 Agency/Records Custodian:"
                : documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request"
                ? "👤 Witness/Respondent Name:"
                : "👤 Recipient/Target:"}
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
                  ? "Enter the name of the agency or department"
                  : documentType === "Subpoena Duces Tecum" || documentType === "Discovery Request"
                  ? "Enter witness or respondent name"
                  : "Enter the name of the recipient"
              }
              style={{ width: "100%", padding: 15, border: "2px solid #3498db", borderRadius: 12, fontSize: 16, backgroundColor: "#fff" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>📍 Jurisdiction:</label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              placeholder="Auto-populates from state selection"
              style={{ width: "100%", padding: 15, border: selectedState ? "2px solid #27ae60" : "2px solid #3498db", borderRadius: 12, fontSize: 16, backgroundColor: selectedState ? "#f8fff8" : "#fff" }}
            />
          </div>
        </div>

        {(documentType === "Notice of Claim" || documentType === "Pre-Suit Notice" || documentType === "Cease and Desist Letter") && (
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>💰 Damages/Settlement Demand:</label>
            <textarea value={damages} onChange={(e) => setDamages(e.target.value)} placeholder="Describe monetary damages, injuries, losses, or settlement demand." style={{ width: "100%", height: 120, padding: 15, border: "2px solid #e74c3c", borderRadius: 12, fontSize: 16, backgroundColor: "#fff", resize: "vertical", lineHeight: 1.5 }} />
          </div>
        )}

        <div style={{ marginBottom: 30 }}>
          <label style={{ display: "block", marginBottom: 10, fontWeight: 600, color: "#2c3e50", fontSize: "1.1rem" }}>
            📝 {
              documentType === "FOIA Request" || documentType === "State Public Records Request"
                ? "Records Requested (Be Specific):"
                : documentType === "ID Rights Card"
                ? "Additional Legal Information (Optional):"
                : documentType === "Cease and Desist Letter"
                ? "Detailed Violation Description:"
                : documentType === "Notice of Claim"
                ? "Comprehensive Incident Description:"
                : documentType === "Pre-Suit Notice"
                ? "Professional Malpractice/Negligence Description:"
                : documentType === "Subpoena Duces Tecum"
                ? "Documents/Materials to be Produced:"
                : documentType === "Discovery Request"
                ? "Case Facts and Discovery Scope:"
                : "Subject Matter:"
            }
          </label>
          <textarea
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={
              documentType === "FOIA Request" || documentType === "State Public Records Request"
                ? "Describe the specific records, time range, custodians, keywords, and formats."
                : documentType === "ID Rights Card"
                ? "Optional: local ordinances, contacts, or notes."
                : documentType === "Cease and Desist Letter"
                ? "Dates/times/locations/witnesses; evidence; laws violated; ongoing impact."
                : documentType === "Notice of Claim"
                ? "Detailed chronological incident description."
                : documentType === "Pre-Suit Notice"
                ? "Specific acts/omissions breaching the standard of care; causation; injuries."
                : documentType === "Subpoena Duces Tecum"
                ? "Specific categories, time periods, and formats required."
                : documentType === "Discovery Request"
                ? "Key issues, period, witnesses, and evidence sought."
                : "Describe the subject matter in detail."
            }
            style={{ width: "100%", height: 200, padding: 15, border: "2px solid #3498db", borderRadius: 12, fontSize: 16, backgroundColor: "#fff", resize: "vertical", lineHeight: 1.5 }}
          />
        </div>

        <button
          onClick={generateLetter}
          style={{
            width: "100%",
            padding: 20,
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 20,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 30,
            textTransform: "uppercase",
            letterSpacing: 1,
            boxShadow: "0 4px 15px rgba(52,152,219,0.3)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#2980b9";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(52,152,219,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#3498db";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(52,152,219,0.3)";
          }}
        >
          🚀 Generate {documentType === "ID Rights Card" ? "Civil Rights Card" : "Legal Document"}
        </button>

        {generatedLetter && (
          <div style={{ backgroundColor: "#f8f9fa", border: "2px solid #27ae60", borderRadius: 15, padding: 25, boxShadow: "0 4px 15px rgba(39,174,96,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <h3 style={{ color: "#27ae60", margin: 0, fontSize: "1.4rem", fontWeight: 600 }}>
                📄 Generated {documentType} – 2025 Standards
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    if (documentType === "ID Rights Card") {
                      const stName = selectedState ? statePublicRecordsData[selectedState].name : "[STATE]";
                      const rights = selectedState ? stateIDRights[selectedState] : undefined;
                      const can = selectedState ? cannabisLaws[selectedState] : undefined;
                      if (!rights) return;
                      const cardText = `${stName} Civil Rights & Laws Reference\nStop & ID: ${rights.stopAndID ? "Yes" : "No"}\nRecording: ${rights.recording}\nCannabis: ${can ? can.status : "Unknown"}\nLaw: ${rights.law}\nFOIA Response: ${selectedState ? statePublicRecordsData[selectedState].timeLimit : "N/A"}`;
                      navigator.clipboard.writeText(cardText);
                    } else if (typeof generatedLetter === "string") {
                      navigator.clipboard.writeText(generatedLetter);
                    }
                  }}
                  style={{ padding: "12px 20px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                  📋 Copy {documentType === "ID Rights Card" ? "Card Info" : "to Clipboard"}
                </button>
              </div>
            </div>

            {/* Render string letters as <pre>, cards as node */}
            {typeof generatedLetter === "string" ? (
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{generatedLetter}</pre>
            ) : (
              <div>{generatedLetter}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalToolkitPro;
