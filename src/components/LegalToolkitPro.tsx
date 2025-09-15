// src/components/LegalToolkitPro.tsx
import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, FileText, IdCard, Printer, RefreshCw, AlertTriangle, Info } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { PricingPlans } from "@/components/PricingPlans";
import { useSubscription } from "@/context/SubscriptionContext";
import { ALL_STATES, PUBLIC_RECORDS, STOP_AND_ID, CANNABIS, HOSTILE_STATES, NOTICE_RULES, type StateCode } from "@/data/legalDatasets";

// -----------------------------
// Helpers
// -----------------------------
const fmtDate = (d = new Date()) => d.toLocaleDateString();
function addBusinessDays(start: Date, days: number): Date { 
  const d = new Date(start); 
  let a = 0; 
  while (a < days) { 
    d.setDate(d.getDate() + 1); 
    const w = d.getDay(); 
    if (w !== 0 && w !== 6) a++; 
  } 
  return d; 
}

function copyToClipboard(text: string) { 
  return navigator.clipboard.writeText(text); 
}

function downloadText(filename: string, contents: string) { 
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" }); 
  const url = URL.createObjectURL(blob); 
  const a = document.createElement("a"); 
  a.href = url; 
  a.download = filename; 
  a.click(); 
  URL.revokeObjectURL(url); 
}

// -----------------------------
// Validation (Zod)
// -----------------------------
const DocType = z.enum([
  "FOIA Request", 
  "State Public Records Request", 
  "ID Rights Card", 
  "Cease and Desist Letter", 
  "Notice of Claim", 
  "Pre-Suit Notice", 
  "Subpoena Duces Tecum", 
  "Discovery Request",
  "Marijuana Law Lookup"
]);
type DocType = z.infer<typeof DocType>;

const BaseFormSchema = z.object({
  documentType: DocType,
  agency: z.string().optional().default(""),
  selectedState: z.custom<StateCode | "">().default(""),
  jurisdiction: z.string().optional().default(""),
  incident: z.string().optional().default(""),
  recipient: z.string().optional().default(""),
  damages: z.string().optional().default(""),
  violationType: z.enum([
    "harassment", 
    "intellectual_property", 
    "debt_collection", 
    "trespass", 
    "defamation", 
    "contract", 
    "privacy"
  ]).default("harassment"),
  claimType: z.enum([
    "general", 
    "government", 
    "medical"
  ]).default("general"),
  plaintiffName: z.string().optional().default(""),
  defendantName: z.string().optional().default(""),
  caseNumber: z.string().optional().default(""),
  courtName: z.string().optional().default(""),
});

type FormState = z.infer<typeof BaseFormSchema> & { 
  timeLimit: string; 
  statute: string; 
  generated: string; 
};

type Action = 
  | { type: "set"; key: keyof FormState; value: any } 
  | { type: "hydrate"; payload: Partial<FormState> } 
  | { type: "generate"; value: string } 
  | { type: "reset" };

function reducer(state: FormState, action: Action): FormState {
  switch(action.type){
    case "set": 
      return { ...state, [action.key]: action.value } as FormState;
    case "hydrate": 
      return { ...state, ...action.payload } as FormState;
    case "generate": 
      return { ...state, generated: action.value };
    case "reset": 
      return initialState;
    default: 
      return state;
  }
}

const initialState: FormState = { 
  ...BaseFormSchema.parse({}), 
  documentType: "FOIA Request", 
  agency: "", 
  selectedState: "", 
  jurisdiction: "", 
  incident: "", 
  recipient: "", 
  damages: "", 
  violationType: "harassment", 
  claimType: "general", 
  plaintiffName: "", 
  defendantName: "", 
  caseNumber: "", 
  courtName: "", 
  timeLimit: "", 
  statute: "", 
  generated: "" 
};

// -----------------------------
// Pure Generators
// -----------------------------
function generateFOIARequest(params: {
  today: string;
  agency?: string;
  selectedState?: StateCode | "";
  statute?: string;
  timeLimit?: string;
  incident?: string;
  jurisdiction?: string;
  stateUpdates?: string;
}) {
  const { today, agency, selectedState, statute, timeLimit, incident, jurisdiction, stateUpdates } = params;
  const stateLaw = selectedState && statute && timeLimit ? ` including the ${statute}` : "";
  const stateClause = selectedState && statute && timeLimit ? 
    `APPLICABLE STATE LAW: This request is also made under ${statute}, which provides for disclosure within ${timeLimit}.` : "";
  const updates = stateUpdates ? `\n\nLEGISLATIVE UPDATE: ${stateUpdates}` : "";
  
  return `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

${today}

${agency || "[Agency Name]"}
FOIA Officer / Records Custodian
[Agency Address]
[City, State, ZIP Code]

Re: Freedom of Information Act Request — EXPEDITED PROCESSING REQUESTED

Dear FOIA Officer:

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, and any applicable state public records laws${stateLaw}, I request access to and copies of the following records:

SUBJECT MATTER: ${incident || "[Describe the specific records sought with maximum specificity]"}

JURISDICTION: ${jurisdiction || "[Specify the relevant jurisdiction]"}

${stateClause}${updates}

DETAILED REQUEST SPECIFICATIONS:
- Time Period: [Specify exact dates]
- Record Types: emails, reports, policies, audio/video, databases, metadata
- Individuals/Entities: [Name people/departments]
- Keywords: [Search terms, case numbers]
- Format: Electronic (searchable PDFs/native with metadata)

PUBLIC INTEREST & FEE WAIVER REQUEST: I request a fee waiver...

SEGREGABILITY & PARTIAL DISCLOSURE: If any portion is denied...

PRESERVATION NOTICE: Preserve all responsive records.

${selectedState && timeLimit ? 
  `RESPONSE TIMEFRAME: Under ${statute}, a response is due within ${timeLimit}.` : 
  `Please respond within the statutory timeframe and acknowledge receipt.`}

Sincerely,
[Your Name]`;
}

function generateCeaseDesistLetter(params: {
  today: string;
  selectedState?: StateCode | "";
  stateNotice?: any;
  recipient?: string;
  violationType: FormState["violationType"];
  incident?: string;
  jurisdiction?: string;
  damages?: string;
}) {
  const { today, selectedState, stateNotice, recipient, violationType, incident, jurisdiction, damages } = params;
  const stateSection = (() => { 
    if (!stateNotice) return "";
    let s = `\n\nSTATE-SPECIFIC REQUIREMENTS: ${stateNotice.requirements}`;
    if (stateNotice.mandatoryNotice) s += `\n\nMANDATORY NOTICE PERIOD: ${stateNotice.mandatoryNotice}`;
    if (stateNotice.penalties) s += `\n\nSTATUTORY PENALTIES: ${stateNotice.penalties}`;
    return s;
  })();
  
  const blocks: Record<FormState["violationType"], string> = {
    harassment: "• Harassment/IIED/Stalking • Privacy • Civil rights (42 U.S.C. § 1983)",
    intellectual_property: "• Copyright • Trademark/Lanham • DMCA • Trade secrets",
    debt_collection: "• FDCPA • FCRA • TCPA • State licensing • UDAP",
    trespass: "• Trespass • Nuisance • Privacy • Interference with business",
    defamation: "• Defamation (libel/slander) • False light • Trade libel",
    contract: "• Breach • Good faith/fair dealing • Estoppel • Unjust enrichment",
    privacy: "• Intrusion • Public disclosure • Appropriation • ECPA • State privacy acts",
  };
  
  return `[Your Name]
[Your Address]
[City, State ZIP]
[Email] | [Phone]

${today}

${recipient || "[Recipient Name]"}
[Recipient Address]

RE: FORMAL CEASE AND DESIST — ${violationType.toUpperCase()} VIOLATIONS
${jurisdiction ? `JURISDICTION: ${jurisdiction}` : ""}

Dear ${recipient || "[Recipient]"}:

You are hereby notified to immediately CEASE AND DESIST from the following unlawful activities:

SPECIFIC VIOLATIONS:
${incident || "[Provide detailed description — dates/times/locations/witnesses]"}

LEGAL BASIS:
${blocks[violationType]}${stateSection}

DEMAND: (1) Cease all activities; (2) Remove infringing/false materials; (3) Confirm compliance within ${stateNotice?.mandatoryNotice || "10 business days"}.

EVIDENCE: [List]
DAMAGES/HARM: ${damages || "[Monetary/reputational/emotional/fees]"}

CONSEQUENCES: Civil action (damages; injunction) • Penalties where applicable • Regulatory complaints

No rights are waived.

Sincerely,
[Your Name]`;
}

function generateNoticeOfClaim(params: {
  today: string;
  gov?: any;
  plaintiff?: string;
  defendant?: string;
  incident?: string;
  jurisdiction?: string;
}) {
  const { today, gov, plaintiff, defendant, incident, jurisdiction } = params;
  return `NOTICE OF CLAIM

Date: ${today}
Jurisdiction: ${jurisdiction || "[Jurisdiction]"}
Claimant: ${plaintiff || "[Plaintiff]"}
Respondent: ${defendant || "[Defendant]"}
Time Limit: ${gov?.timeLimit || "[See statute]"}
Statute: ${gov?.statute || "[Statute]"}

FACTS: ${incident || "[Describe incident with dates/locations/damages]"}

DEMAND: Preserve evidence; acknowledge receipt; advise on claim processing.`;
}

function generatePreSuitNotice(params: {
  today: string;
  med?: any;
  plaintiff?: string;
  defendant?: string;
  incident?: string;
}) {
  const { today, med, plaintiff, defendant, incident } = params;
  return `PRE-SUIT NOTICE (Medical)

Date: ${today}
Plaintiff: ${plaintiff || "[Plaintiff]"}
Defendant: ${defendant || "[Defendant]"}
Statute: ${med?.statute || "[Statute]"}
Time Limit: ${med?.timeLimit || "[Timeframe]"}

BASIS: ${incident || "[Negligence, standard of care, causation, damages]"}`;
}

function generateSubpoenaDucesTecum(params: {
  today: string;
  courtName?: string;
  caseNumber?: string;
  plaintiff?: string;
  defendant?: string;
  recipient?: string;
  incident?: string;
}) {
  const { today, courtName, caseNumber, plaintiff, defendant, recipient, incident } = params;
  return `SUBPOENA DUCES TECUM

${courtName || "[Court Name]"}
Case No.: ${caseNumber || "[Case Number]"}
${plaintiff || "[Plaintiff]"} v. ${defendant || "[Defendant]"}

TO: ${recipient || "[Custodian of Records]"}

YOU ARE COMMANDED to produce:
${incident || "[Describe categories/date ranges/formats]"}

DATE OF ISSUANCE: ${today}`;
}

function generateDiscoveryRequest(params: {
  today: string;
  caseNumber?: string;
  plaintiff?: string;
  defendant?: string;
  incident?: string;
}) {
  const { today, caseNumber, plaintiff, defendant, incident } = params;
  return `PLAINTIFF'S FIRST SET OF REQUESTS FOR PRODUCTION

Date: ${today}
Case: ${caseNumber || "[Case Number]"}
Parties: ${plaintiff || "[Plaintiff]"} v. ${defendant || "[Defendant]"}

REQUESTS:
1. All documents concerning ${incident || "[Subject matter]"}.
2. All communications referring to the subject.
3. Policies/procedures in effect during the period.
4. All audio/video/photos relating to the incident.
5. ESI in native format with metadata.`;
}

function generateMarijuanaLawLookup(params: {
  selectedState?: StateCode | "";
  cannabisLaw?: any;
}) {
  const { selectedState, cannabisLaw } = params;
  if (!selectedState || !cannabisLaw) {
    return "Please select a state to view its marijuana laws.";
  }
  
  return `MARIJUANA/CANNABIS LAWS FOR ${selectedState.toUpperCase()}

${cannabisLaw.title}

SUMMARY:
${cannabisLaw.summary}

LEGAL CITATION:
${cannabisLaw.citation}

SOURCE:
${cannabisLaw.url}`;
}

// -----------------------------
// Component
// -----------------------------
export default function LegalToolkitPro() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const idCardRef = useRef<HTMLDivElement | null>(null);
  const { plan, isPro, isEnterprise } = useSubscription();

  // Persist key fields (without generated text)
  useEffect(() => { 
    const saved = localStorage.getItem("ltp-state"); 
    if(saved) dispatch({ type: "hydrate", payload: JSON.parse(saved) }); 
  }, []);
  
  useEffect(() => { 
    const { generated, ...rest } = state; 
    localStorage.setItem("ltp-state", JSON.stringify(rest)); 
  }, [state.documentType, state.selectedState, state.agency, state.violationType, state.claimType]);

  // Derive statute/time window from dataset
  useEffect(() => {
    const code = state.selectedState as StateCode | "";
    if(!code){ 
      dispatch({ type: "hydrate", payload: { jurisdiction: "", timeLimit: "", statute: "" } }); 
      return; 
    }
    
    const pr = PUBLIC_RECORDS[code];
    if(state.documentType === "FOIA Request" || state.documentType === "State Public Records Request"){
      if(pr) dispatch({ type: "hydrate", payload: { jurisdiction: pr.name, timeLimit: pr.summary, statute: pr.citation } });
      return;
    }
    
    if(state.documentType === "ID Rights Card"){
      const rights = STOP_AND_ID[code];
      if(pr && rights){ 
        dispatch({ 
          type: "hydrate", 
          payload: { 
            jurisdiction: pr.name, 
            timeLimit: rights.summary, 
            statute: rights.citation 
          } 
        }); 
      }
      return;
    }
    
    if(state.documentType === "Marijuana Law Lookup"){
      const cannabis = CANNABIS[code];
      if(cannabis){
        dispatch({ 
          type: "hydrate", 
          payload: { 
            jurisdiction: cannabis.title, 
            timeLimit: cannabis.summary, 
            statute: cannabis.citation 
          } 
        });
      }
      return;
    }
    
    const notice = NOTICE_RULES[code];
    if(notice){
      const payload: Partial<FormState> = { jurisdiction: pr?.name || state.jurisdiction };
      if(state.documentType === "Notice of Claim" && state.claimType === "government" && notice){
        payload.timeLimit = notice.summary;
        payload.statute = notice.citation;
      }
      else if(state.documentType === "Pre-Suit Notice" && state.claimType === "medical" && notice){
        payload.timeLimit = notice.summary;
        payload.statute = notice.citation;
      }
      dispatch({ type: "hydrate", payload });
    }
  }, [state.selectedState, state.documentType, state.claimType]);

  const today = useMemo(() => fmtDate(new Date()), []);

  function handleGenerate(){
    const code = state.selectedState as StateCode | "";
    const pr = code ? PUBLIC_RECORDS[code] : undefined;
    const notice = code ? NOTICE_RULES[code] : undefined;
    const updates = pr?.updatedAt;
    const cannabis = code ? CANNABIS[code] : undefined;
    const hostileState = code ? HOSTILE_STATES[code] : undefined;
    const stopAndId = code ? STOP_AND_ID[code] : undefined;

    let out = "";
    switch(state.documentType){
      case "FOIA Request":
        out = generateFOIARequest({ 
          today, 
          agency: state.agency, 
          selectedState: code, 
          statute: state.statute, 
          timeLimit: state.timeLimit, 
          incident: state.incident, 
          jurisdiction: state.jurisdiction, 
          stateUpdates: updates 
        });
        break;
      case "State Public Records Request":
        out = generateFOIARequest({ 
          today, 
          agency: state.agency, 
          selectedState: code, 
          statute: state.statute, 
          timeLimit: state.timeLimit, 
          incident: state.incident, 
          jurisdiction: state.jurisdiction, 
          stateUpdates: updates 
        });
        break;
      case "ID Rights Card":
        // For ID Rights Card, we don't generate text but show the card preview
        out = "";
        break;
      case "Marijuana Law Lookup":
        out = generateMarijuanaLawLookup({ 
          selectedState: code, 
          cannabisLaw: cannabis 
        });
        break;
      case "Cease and Desist Letter":
        out = generateCeaseDesistLetter({ 
          today, 
          selectedState: code, 
          stateNotice: notice, 
          recipient: state.recipient, 
          violationType: state.violationType, 
          incident: state.incident, 
          jurisdiction: state.jurisdiction, 
          damages: state.damages 
        });
        break;
      case "Notice of Claim":
        out = generateNoticeOfClaim({ 
          today, 
          gov: notice, 
          plaintiff: state.plaintiffName, 
          defendant: state.defendantName, 
          incident: state.incident, 
          jurisdiction: state.jurisdiction 
        });
        break;
      case "Pre-Suit Notice":
        out = generatePreSuitNotice({ 
          today, 
          med: notice, 
          plaintiff: state.plaintiffName, 
          defendant: state.defendantName, 
          incident: state.incident 
        });
        break;
      case "Subpoena Duces Tecum":
        out = generateSubpoenaDucesTecum({ 
          today, 
          courtName: state.courtName, 
          caseNumber: state.caseNumber, 
          plaintiff: state.plaintiffName, 
          defendant: state.defendantName, 
          recipient: state.recipient, 
          incident: state.incident 
        });
        break;
      case "Discovery Request":
        out = generateDiscoveryRequest({ 
          today, 
          caseNumber: state.caseNumber, 
          plaintiff: state.plaintiffName, 
          defendant: state.defendantName, 
          incident: state.incident 
        });
        break;
    }
    dispatch({ type: "generate", value: out });
  }

  async function exportIdCardPNG(){ 
    if(!idCardRef.current) return; 
    const dataUrl = await toPng(idCardRef.current, { cacheBust: true }); 
    const a = document.createElement("a"); 
    a.href = dataUrl; 
    a.download = `id-rights-card-${state.selectedState || "state"}.png`; 
    a.click(); 
  }
  
  async function exportIdCardPDF(){ 
    if(!idCardRef.current) return; 
    const dataUrl = await toPng(idCardRef.current, { cacheBust: true }); 
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [420, 320] }); 
    pdf.addImage(dataUrl, "PNG", 10, 10, 400, 300); 
    pdf.save(`id-rights-card-${state.selectedState || "state"}.pdf`); 
  }

  const rightsForState = state.selectedState ? STOP_AND_ID[state.selectedState as StateCode] : undefined;
  const cannabisForState = state.selectedState ? CANNABIS[state.selectedState as StateCode] : undefined;
  const prForState = state.selectedState ? PUBLIC_RECORDS[state.selectedState as StateCode] : undefined;
  const hostileStateForState = state.selectedState ? HOSTILE_STATES[state.selectedState as StateCode] : undefined;

  const coveragePR = Math.round((Object.keys(PUBLIC_RECORDS).length / (ALL_STATES.length)) * 100);

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Civil Rights Legal Toolkit Pro</h1>
          <p className="text-sm text-muted-foreground">Fast, accurate legal document generation • Mobile-ready • Attorney-grade exports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => dispatch({ type: "reset" })}>
            <RefreshCw className="mr-2 h-4 w-4" />Reset
          </Button>
          <Button onClick={handleGenerate}>
            <FileText className="mr-2 h-4 w-4" />Generate
          </Button>
        </div>
      </div>

      {/* Hostile State Warning */}
      {hostileStateForState && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-500">Hostile State Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{hostileStateForState.summary}</p>
            <div className="mt-2">
              <Label className="text-xs font-bold">Specific Laws:</Label>
              <ul className="mt-1 text-xs list-disc pl-5 space-y-1">
                {hostileStateForState.specificLaws.map((law, index) => (
                  <li key={index}>{law}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bundle & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Bundle with the Civil Rights Tool on the <span className="font-semibold">Enterprise</span> plan for team features and org branding.
          </p>
        </CardHeader>
        <CardContent>
          <PricingPlans />
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Document Type</Label>
              <Select 
                value={state.documentType} 
                onValueChange={(v) => dispatch({ type: "set", key: "documentType", value: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  {DocType.options.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>State</Label>
              <Select 
                value={state.selectedState as string} 
                onValueChange={(v) => dispatch({ type: "set", key: "selectedState", value: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {["", ...ALL_STATES].map((c) => (
                    <SelectItem key={c || "none"} value={c as string}>
                      {c || "—"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Agency / Recipient</Label>
              <Input 
                className="mt-1" 
                value={state.agency} 
                onChange={(e) => dispatch({ type: "set", key: "agency", value: e.target.value })} 
                placeholder="e.g., City Clerk / Records Custodian"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Jurisdiction</Label>
              <Input 
                className="mt-1" 
                value={state.jurisdiction} 
                onChange={(e) => dispatch({ type: "set", key: "jurisdiction", value: e.target.value })} 
                placeholder="Auto-filled by state"
              />
            </div>
            <div>
              <Label>Statute</Label>
              <Input 
                className="mt-1" 
                value={state.statute} 
                onChange={(e) => dispatch({ type: "set", key: "statute", value: e.target.value })} 
                placeholder="Auto-filled by doc type"
              />
            </div>
            <div>
              <Label>Time Limit</Label>
              <Input 
                className="mt-1" 
                value={state.timeLimit} 
                onChange={(e) => dispatch({ type: "set", key: "timeLimit", value: e.target.value })} 
                placeholder="Auto-filled by doc type"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Subject / Incident</Label>
              <Textarea 
                className="mt-1" 
                rows={5} 
                value={state.incident} 
                onChange={(e) => dispatch({ type: "set", key: "incident", value: e.target.value })} 
                placeholder="Describe records sought or facts (who/what/when/where)"
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label>Violation Type (Cease & Desist)</Label>
                <Select 
                  value={state.violationType} 
                  onValueChange={(v) => dispatch({ type: "set", key: "violationType", value: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "harassment",
                      "intellectual_property",
                      "debt_collection",
                      "trespass",
                      "defamation",
                      "contract",
                      "privacy"
                    ].map((t) => (
                      <SelectItem key={t} value={t}>{t.replaceAll("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Damages (optional)</Label>
                <Textarea 
                  className="mt-1" 
                  rows={3} 
                  value={state.damages} 
                  onChange={(e) => dispatch({ type: "set", key: "damages", value: e.target.value })} 
                  placeholder="Monetary damages, reputational harm, etc."
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="parties">
            <TabsList>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="case">Case</TabsTrigger>
            </TabsList>
            <TabsContent value="parties" className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Plaintiff</Label>
                <Input 
                  className="mt-1" 
                  value={state.plaintiffName} 
                  onChange={(e) => dispatch({ type: "set", key: "plaintiffName", value: e.target.value })}
                />
              </div>
              <div>
                <Label>Defendant</Label>
                <Input 
                  className="mt-1" 
                  value={state.defendantName} 
                  onChange={(e) => dispatch({ type: "set", key: "defendantName", value: e.target.value })}
                />
              </div>
              <div>
                <Label>Recipient (for C&D/Subpoena)</Label>
                <Input 
                  className="mt-1" 
                  value={state.recipient} 
                  onChange={(e) => dispatch({ type: "set", key: "recipient", value: e.target.value })}
                />
              </div>
            </TabsContent>
            <TabsContent value="case" className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Claim Type</Label>
                <Select 
                  value={state.claimType} 
                  onValueChange={(v) => dispatch({ type: "set", key: "claimType", value: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="government">Government Tort</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Case Number</Label>
                <Input 
                  className="mt-1" 
                  value={state.caseNumber} 
                  onChange={(e) => dispatch({ type: "set", key: "caseNumber", value: e.target.value })}
                />
              </div>
              <div>
                <Label>Court Name</Label>
                <Input 
                  className="mt-1" 
                  value={state.courtName} 
                  onChange={(e) => dispatch({ type: "set", key: "courtName", value: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Law chips */}
      <div className="flex flex-wrap gap-2">
        {prForState && (
          <Badge variant="secondary">
            FOIA: {prForState.citation} • {prForState.summary}
          </Badge>
        )}
        {rightsForState && (
          <Badge variant="outline">
            Stop & ID: {rightsForState.summary}
          </Badge>
        )}
        {cannabisForState && (
          <Badge variant="outline">
            Cannabis: {cannabisForState.summary}
          </Badge>
        )}
        <Badge variant="secondary">PR coverage: {coveragePR}%</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {state.documentType === "ID Rights Card" ? (
              <div className="flex justify-center">
                <div 
                  ref={idCardRef} 
                  className="relative w-[420px] h-[300px] rounded-2xl border border-white/10 shadow-xl"
                  style={{ 
                    background: "linear-gradient(135deg, #1B365D 0%, #2C5AA0 100%)", 
                    color: "#fff", 
                    fontFamily: "Inter, system-ui, Arial, sans-serif", 
                    fontSize: "11px", 
                    lineHeight: 1.3 
                  }}
                >
                  <div className="text-center border-b border-white/20 pb-2 px-4 pt-3">
                    <div className="text-base font-bold tracking-wide">
                      {(prForState?.name || "[STATE NAME]").toUpperCase()}
                    </div>
                    <div className="text-sm font-semibold">
                      CIVIL RIGHTS & LAWS REFERENCE CARD
                    </div>
                  </div>
                  <div className="flex gap-4 px-4 pt-3" style={{ height: 200 }}>
                    <div className="flex-1">
                      <div 
                        className="text-[10px] font-bold mb-1" 
                        style={{ color: "#ffd700" }}
                      >
                        CONSTITUTIONAL RIGHTS
                      </div>
                      <div className="text-[9px] mb-1">
                        • I do not consent to searches
                      </div>
                      <div className="text-[9px] mb-1">
                        • I invoke my right to remain silent
                      </div>
                      <div className="text-[9px] mb-1">
                        • I do not waive any rights
                      </div>
                      <div className="text-[9px] mb-2">
                        • I want a lawyer if detained
                      </div>
                      
                      <div 
                        className="text-[10px] font-bold mb-1" 
                        style={{ color: "#ffd700" }}
                      >
                        STATE LAWS
                      </div>
                      <div className="text-[8px] mb-1">
                        {rightsForState?.summary || "No specific Stop & ID Law"}
                      </div>
                      {cannabisForState && (
                        <div className="text-[8px] mb-1" style={{ color: "#90EE90" }}>
                          Cannabis: {cannabisForState.summary}
                        </div>
                      )}
                      {prForState && (
                        <div className="text-[8px] mb-1">
                          FOIA Response: {prForState.summary}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div 
                        className="text-[10px] font-bold mb-1" 
                        style={{ color: "#ffd700" }}
                      >
                        POLICE ENCOUNTER SCRIPT
                      </div>
                      <div className="text-[8px] mb-1 font-semibold">
                        "Officer, am I being detained or am I free to go?"
                      </div>
                      <div className="text-[8px]">
                        If <b>FREE TO GO</b>:
                      </div>
                      <div className="text-[7px] italic mb-1">
                        "I choose to leave now. Have a good day."
                      </div>
                      <div className="text-[8px]">
                        If <b>DETAINED</b>:
                      </div>
                      <div className="text-[7px] mb-0.5">
                        "I respectfully decline to answer questions."
                      </div>
                      <div className="text-[7px] mb-0.5">
                        "I do not consent to any search."
                      </div>
                      <div className="text-[7px] mb-1">
                        {rightsForState?.summary.includes("require") ? 
                          '"Please state the law requiring me to provide ID."' : 
                          '"I am not required to show ID unless driving or under arrest."'}
                      </div>
                      <div className="text-[8px]">
                        If <b>ARRESTED</b>:
                      </div>
                      <div className="text-[7px] mb-1">
                        "I invoke my right to remain silent and want a lawyer."
                      </div>
                      <div className="text-[8px]">
                        EMERGENCY CONTACTS:
                      </div>
                      <div className="text-[7px]">
                        Attorney: _______________
                      </div>
                      <div className="text-[7px]">
                        Emergency: _______________
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-5 right-5 bottom-2 border-t border-white/20 pt-1 flex justify-between text-[7px] opacity-80">
                    <div>Generated: {fmtDate()}</div>
                    <div>Civil Rights Toolkit Pro 2025</div>
                  </div>
                </div>
              </div>
            ) : (
              <Textarea 
                className="min-h-[300px]" 
                value={state.generated} 
                onChange={(e) => dispatch({ type: "generate", value: e.target.value })}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(state.generated)} 
                disabled={state.documentType === "ID Rights Card" && !state.generated}
              >
                <Copy className="mr-2 h-4 w-4" />Copy Text
              </Button>
              <Button 
                variant="outline" 
                onClick={() => downloadText(`${state.documentType.replaceAll(" ", "-").toLowerCase()}.txt`, state.generated)} 
                disabled={state.documentType === "ID Rights Card" && !state.generated}
              >
                <Download className="mr-2 h-4 w-4" />Download .txt
              </Button>
              {state.documentType === "ID Rights Card" && (
                <>
                  <Button onClick={exportIdCardPNG}>
                    <IdCard className="mr-2 h-4 w-4" />Export PNG
                  </Button>
                  <Button onClick={exportIdCardPDF}>
                    <Printer className="mr-2 h-4 w-4" />Export PDF
                  </Button>
                </>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Tip: For deadlines like "5 business days," a reminder from today ({fmtDate()}) might be{" "}
              <code>{fmtDate(addBusinessDays(new Date(), 5))}</code>.
            </div>
            
            {!isEnterprise && (
              <div className="rounded-md border p-3 text-sm">
                <div className="font-semibold mb-1">Bundle available</div>
                <p className="text-muted-foreground">
                  Unlock the <b>Civil Rights Tool</b> plus org features by choosing the <b>Enterprise Bundle</b> above.
                </p>
              </div>
            )}
            
            <div className="rounded-md border p-3 text-xs leading-relaxed text-muted-foreground">
              <b>Disclaimer:</b> This software provides legal information and document automation. It is not legal advice and does not create an attorney–client relationship. Statutes are jurisdiction-specific and change frequently—verify before filing.
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Information Cards */}
      {(state.documentType === "Marijuana Law Lookup" || state.documentType === "ID Rights Card") && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Marijuana Laws
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cannabisForState ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">{cannabisForState.title}</p>
                  <p className="text-sm">{cannabisForState.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    Legal Citation: {cannabisForState.citation}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(cannabisForState.url, "_blank")}
                  >
                    View Source
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a state to view its marijuana/cannabis laws.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Stop and ID Laws
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rightsForState ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">{rightsForState.title}</p>
                  <p className="text-sm">{rightsForState.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    Legal Citation: {rightsForState.citation}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(rightsForState.url, "_blank")}
                  >
                    View Source
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a state to view its stop and identification laws.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}