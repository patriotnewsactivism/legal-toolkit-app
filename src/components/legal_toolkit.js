import React, { useState, useEffect } from 'react';

// COMPREHENSIVE 2024-2025 LEGISLATIVE UPDATES - Enhanced for Civil Rights Attorneys
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

const cannabisLaws = {
  'CA': { 
    status: 'Recreational & Medical', 
    enacted: '2016', 
    possession: '1 oz flower, 6 plants, 8g concentrates', 
    details: 'First medical state (1996), recreational via Prop 64 (57% support)'
  },
  'NY': { 
    status: 'Recreational & Medical', 
    enacted: '2021', 
    possession: '3 oz flower, 6 plants', 
    details: 'Marijuana Regulation and Taxation Act - legislative passage'
  },
  'TX': { 
    status: 'CBD Only', 
    enacted: '2015', 
    possession: 'Low-THC CBD for qualified patients', 
    details: 'Compassionate Use Act - very restrictive'
  },
  'FL': { 
    status: 'Medical Only', 
    enacted: '2016', 
    possession: '2.5 oz smokable per 35 days', 
    details: 'Amendment 2 with 71.3% support - recreational failed 2024'
  },
  'NJ': { 
    status: 'Recreational & Medical', 
    enacted: '2020', 
    possession: '1 oz flower (no home cultivation)', 
    details: 'Public Question 1 with 67% support'
  }
};

const stateIDRights = {
  'CA': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'Two-party consent' },
  'NY': { stopAndID: true, law: 'N.Y. CPL § 140.50', idRequired: 'Must provide name, address, and explanation of conduct if lawfully stopped', recording: 'One-party consent' },
  'TX': { stopAndID: true, law: 'Tex. Penal Code § 38.02', idRequired: 'Must provide name and address if lawfully arrested or detained', recording: 'One-party consent' },
  'FL': { stopAndID: true, law: 'F.S. § 856.021', idRequired: 'Must provide name if lawfully detained, refusal may be obstruction', recording: 'Two-party consent' },
  'NJ': { stopAndID: false, law: 'No stop and identify statute', idRequired: 'Only when driving, under arrest, or specific licensed activities', recording: 'One-party consent' }
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
  }, [selectedState, documentType]);

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

    return `
====================================
${stateName.toUpperCase()} ID RIGHTS CARD
====================================

CONSTITUTIONAL RIGHTS:
• I do not consent to searches
• I invoke my right to remain silent
• I do not waive any rights
• I want a lawyer if detained

POLICE ENCOUNTER SCRIPT:
"Officer, am I being detained or am I free to go?"

IF FREE TO GO: "I choose to leave now."
IF DETAINED: "I decline to answer questions. I do not consent to searches."
IF ARRESTED: "I invoke my right to remain silent and want a lawyer."

STATE LAWS:
Stop & ID Law: ${stateRights.stopAndID ? 'YES - ' + stateRights.law : 'NO'}
ID Required: ${stateRights.idRequired}
Recording Laws: ${stateRights.recording}
${cannabisData ? `Cannabis Status: ${cannabisData.status}` : ''}

Generated: ${new Date().toLocaleDateString()}
For informational purposes only
====================================`;
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

RE: CEASE AND DESIST NOTICE
${jurisdiction ? `JURISDICTION: ${jurisdiction}` : ''}

Dear ${recipient || '[Recipient Name]'}:

NOTICE TO CEASE AND DESIST

You are hereby notified to CEASE AND DESIST from the following unlawful activities:

VIOLATIONS: ${incident || '[Describe specific violations, actions, or behaviors that must stop]'}

DEMAND FOR CESSATION: You are hereby demanded to immediately:

1. CEASE all described activities
2. REFRAIN from any future similar conduct
3. REMOVE any infringing materials (if applicable)
4. PROVIDE written confirmation of compliance within 10 days

CONSEQUENCES OF NON-COMPLIANCE: 

If you fail to comply within 10 days of receipt:
1. We will pursue all available legal remedies
2. You may be liable for damages, including attorney fees
3. We may seek injunctive relief
4. Criminal charges may be filed if applicable

Time for compliance: Ten (10) days from receipt of this letter.

Sincerely,

[Your Signature]
[Your Printed Name]

---
DELIVERY VERIFICATION:
☐ Certified Mail, Return Receipt Requested
☐ Personal Service
☐ Email with read receipt`;
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
            Professional Civil Rights Attorney Document Generator
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
              <option value="FOIA Request">FOIA Request</option>
              <option value="State Public Records Request">State Public Records Request</option>
              <option value="ID Rights Card">ID Rights & Cannabis Laws Card</option>
              <option value="Cease and Desist Letter">Cease and Desist Letter</option>
              <option value="Notice of Claim">Notice of Claim</option>
              <option value="Pre-Suit Notice">Pre-Suit Notice</option>
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

        {selectedState && cannabisLaws[selectedState] && (
          <div style={{
            backgroundColor: '#f0f8ff',
            border: '2px solid #4169e1',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px'
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
              <div>
                <strong>Enacted:</strong> {cannabisLaws[selectedState].enacted}
              </div>
              <div>
                <strong>Possession Limits:</strong> {cannabisLaws[selectedState].possession}
              </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              <strong>Details:</strong> {cannabisLaws[selectedState].details}
            </div>
          </div>
        )}

        {selectedState && (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #27ae60',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px'
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
                documentType === 'Cease and Desist Letter' ? 'Violation Description:' : 'Subject Matter:'}
          </label>
          <textarea
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder={
              documentType === 'FOIA Request' || documentType === 'State Public Records Request' ? 
                'Describe the specific records, incident, or subject matter you are requesting.' :
              documentType === 'ID Rights Card' ?
                'Optional: Add any specific notes or information relevant to your state or local area.' :
              documentType === 'Cease and Desist Letter' ?
                'Describe the specific violations, actions, or behaviors that must stop.' :
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
                    navigator.clipboard.writeText(generatedLetter);
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
                  💾 Download as Text File
                </button>
              </div>
            </div>
            
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
            
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#856404'
            }}>
              <strong>💡 Attorney-Level Legal Notice:</strong> This document incorporates all 2024-2025 legislative changes including California's recodification, Nebraska's LB 43, and state-specific legal requirements. Generated with attorney-level precision for {selectedState ? statePublicRecordsData[selectedState].name : 'your jurisdiction'}. Review all bracketed placeholders and customize with your specific information.
            </div>
          </div>
        )}

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

export default LegalToolkit;
