// file: src/LegalToolkit.tsx
import React, { useCallback, useMemo, useState } from "react";

/***** Utilities *****/
function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

async function copyText(text: string): Promise<boolean> {
  // Why: `navigator.clipboard` is blocked in some contexts; provide robust fallback.
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function downloadText(filename: string, text: string) {
  // Why: Provide an offline artifact users can keep or edit.
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/***** UI Primitives *****/
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

/***** Tabs (WAI-ARIA + keyboard) *****/
const TABS = [
  { id: "foia", label: "FOIA / Public Records" },
  { id: "speech", label: "Speech & Protest" },
  { id: "police", label: "Police Stops / ID" },
] as const;

type TabId = typeof TABS[number]["id"];

function TabButton({ id, active, onSelect, label, index, count }: {
  id: TabId;
  active: boolean;
  onSelect: (id: TabId) => void;
  label: string;
  index: number;
  count: number;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(id)}
      className={classNames(
        "rounded-xl border px-3 py-2 text-sm font-semibold",
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
      )}
      // Why: keep visual focus distinct for keyboard users.
      style={{ outlineOffset: 2 }}
      data-index={index}
      data-count={count}
    >
      {label}
    </button>
  );
}

/***** Domain data *****/
const JURISDICTIONS = [
  "Federal",
  "Mississippi",
  "Texas",
  "Utah",
  "Louisiana",
  "Other State",
] as const;

type Jurisdiction = typeof JURISDICTIONS[number];

/***** FOIA Template *****/
function buildRequest({ jurisdiction, requester, topic }: {
  jurisdiction: Jurisdiction;
  requester: string;
  topic: string;
}) {
  const who = requester.trim() || "Requester";
  const what = topic.trim() || "[Describe the records with reasonable detail]";
  const header =
    jurisdiction === "Federal"
      ? "Freedom of Information Act, 5 U.S.C. § 552"
      : "State Public Records Law";

  const lines = [
    `${header} Request`,
    "",
    "To the Records Officer:",
    "",
    `This is a request from ${who}. I request access to and copies of the following records:`,
    `• ${what}.`,
    "",
    "Format: Electronic copies preferred.",
    "Fees: Please notify me if fees will exceed $25; I request a fee waiver as a journalist acting in the public interest.",
    "Time: Please respond within statutory timelines; if you deny any part, cite the specific exemption and release all reasonably segregable material.",
    "",
    "Sincerely,",
    who,
  ];
  return lines.join("\n");
}

/***** Main Component *****/
export default function LegalToolkit() {
  const [activeTab, setActiveTab] = useState<TabId>("foia");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("Federal");
  const [requester, setRequester] = useState("");
  const [topic, setTopic] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const requestText = useMemo(
    () => buildRequest({ jurisdiction, requester, topic }),
    [jurisdiction, requester, topic]
  );

  const onTabsKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % TABS.length;
      if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      if (e.key === "Home") nextIndex = 0;
      if (e.key === "End") nextIndex = TABS.length - 1;
      setActiveTab(TABS[nextIndex].id);
      const btn = document.getElementById(`tab-${TABS[nextIndex].id}`);
      btn?.focus();
    }
  }, [activeTab]);

  const handleCopy = async () => {
    const ok = await copyText(requestText);
    setToast(ok ? "Draft copied to clipboard." : "Copy failed. You can download or select & copy manually.");
  };

  const handleDownload = () => {
    const who = requester.trim() || "request";
    const file = `records-${who.replace(/\s+/g, "-").toLowerCase()}.txt`;
    downloadText(file, requestText);
    setToast("Draft downloaded.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 pb-14 pt-6">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">Constitutional Rights — Legal Toolkit</h1>
            <p className="text-sm text-gray-500">
              Fast templates and references for records requests, speech, and accountability.
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Sections"
          className="mb-6 flex gap-2"
          onKeyDown={onTabsKeyDown}
        >
          {TABS.map((t, i) => (
            <TabButton
              key={t.id}
              id={t.id}
              index={i}
              count={TABS.length}
              active={activeTab === t.id}
              onSelect={setActiveTab}
              label={t.label}
            />
          ))}
        </div>

        {activeTab === "foia" && (
          <div
            id="panel-foia"
            role="tabpanel"
            aria-labelledby="tab-foia"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <Card title="Request Builder">
              <div className="grid gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold">Jurisdiction</label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  >
                    {JURISDICTIONS.map((j) => (
                      <option key={j}>{j}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Pick “Federal” for FOIA; otherwise this will generate a state public records request.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">Requester (your name or org)</label>
                  <input
                    type="text"
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    placeholder="We The People News (Matthew O. Reardon)"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                    aria-describedby="requester-hint"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">Records sought</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="All BOLOs, bulletins, watchlists, and emails referencing my name/channel"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-xl border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-bold text-white"
                  >
                    Copy Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold hover:border-gray-300"
                  >
                    Download .txt
                  </button>
                </div>

                {toast && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900"
                  >
                    {toast}
                  </div>
                )}
              </div>
            </Card>

            <Card title="Live Preview">
              <textarea
                readOnly
                value={requestText}
                className="h-72 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm"
              />
            </Card>

            <Card title="Tips">
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                <li>Keep scope clear but not so narrow they can dodge it.</li>
                <li>Ask for native formats (PDFs, emails in .eml/.msg, spreadsheets in .xlsx).</li>
                <li>Request fee waiver and expedited processing if newsworthy.</li>
                <li>Appeal partial denials; demand segregability.</li>
              </ul>
            </Card>
          </div>
        )}

        {activeTab === "speech" && (
          <div
            id="panel-speech"
            role="tabpanel"
            aria-labelledby="tab-speech"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <Card title="Core Principles">
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                <li>
                  Offensive speech is generally protected (see <i>Cohen v. California</i>).
                </li>
                <li>Time, place, manner limits must be content-neutral and narrowly tailored.</li>
                <li>Recording public officials in public is generally protected.</li>
              </ul>
            </Card>
            <Card title="On-the-Ground Reminders">
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                <li>Stay on public forums (sidewalks, parks) unless you have a permit.</li>
                <li>Document everything—names, badge numbers, locations, timestamps.</li>
                <li>Keep your own video rolling and back it up ASAP.</li>
              </ul>
            </Card>
          </div>
        )}

        {activeTab === "police" && (
          <div
            id="panel-police"
            role="tabpanel"
            aria-labelledby="tab-police"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <Card title="Stops & ID">
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                <li>During a stop: ask “Am I being detained, or am I free to go?”</li>
                <li>You generally don’t have to ID yourself absent reasonable suspicion and a valid law.</li>
                <li>Never consent to searches; say “I don’t consent.”</li>
              </ul>
            </Card>
            <Card title="Aftermath">
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
                <li>Request body-cam and reports immediately via public records law.</li>
                <li>Write a contemporaneous memo with exact quotes and times.</li>
                <li>Preserve your files and share hashes to prove integrity.</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
