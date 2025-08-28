import React, { useState } from "react";

function TabButton({ id, activeTab, onClick, label }) {
  const isActive = activeTab === id;
  const base =
    "padding: 10px 14px; border: 1px solid #e5e7eb; background:#fff; cursor:pointer; font-weight:600;";
  const active = "background:#111827; color:#fff; border-color:#111827;";
  const style = isActive ? `${base} ${active}` : base;
  return (
    <button type="button" onClick={() => onClick(id)} style={{ cssText: style }}>
      {label}
    </button>
  );
}

function Card({ title, children }) {
  const cardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  };
  const h = { margin: 0, marginBottom: 8, fontSize: 18, color: "#111827" };
  return (
    <section style={cardStyle}>
      <h3 style={h}>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

export default function LegalToolkit() {
  const [activeTab, setActiveTab] = useState("foia");
  const [jurisdiction, setJurisdiction] = useState("Federal");
  const [requester, setRequester] = useState("");
  const [topic, setTopic] = useState("");

  const shell = {
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    background: "linear-gradient(180deg,#f9fafb 0%, #eef2ff 100%)",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
    color: "#111827",
  };

  const container = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "24px 16px 56px",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  };

  const title = { margin: 0, fontSize: 28, fontWeight: 800 };
  const subtitle = { margin: 0, color: "#6b7280", fontSize: 14 };

  const tabsWrap = { display: "flex", gap: 8, margin: "16px 0 24px" };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  };

  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
  };

  const label = { display: "block", fontWeight: 600, marginBottom: 6 };
  const small = { fontSize: 12, color: "#6b7280", marginTop: 6 };

  const buttonPrimary = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div style={shell}>
      <div style={container}>
        <header style={header}>
          <div>
            <h1 style={title}>Constitutional Rights — Legal Toolkit</h1>
            <p style={subtitle}>
              Fast templates and references for records requests, speech, and accountability.
            </p>
          </div>
        </header>

        <div style={tabsWrap}>
          <TabButton id="foia" activeTab={activeTab} onClick={setActiveTab} label="FOIA / Public Records" />
          <TabButton id="speech" activeTab={activeTab} onClick={setActiveTab} label="Speech & Protest" />
          <TabButton id="police" activeTab={activeTab} onClick={setActiveTab} label="Police Stops / ID" />
        </div>

        {activeTab === "foia" && (
          <div style={grid}>
            <Card title="Request Builder">
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={label}>Jurisdiction</label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    style={input}
                  >
                    <option>Federal</option>
                    <option>Mississippi</option>
                    <option>Texas</option>
                    <option>Utah</option>
                    <option>Louisiana</option>
                    <option>Other State</option>
                  </select>
                  <p style={small}>
                    Pick “Federal” for FOIA; otherwise this will generate a state public records request.
                  </p>
                </div>

                <div>
                  <label style={label}>Requester (your name or org)</label>
                  <input
                    type="text"
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    placeholder="We The People News (Matthew O. Reardon)"
                    style={input}
                  />
                </div>

                <div>
                  <label style={label}>Records sought</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="All BOLOs, bulletins, watchlists, and emails referencing my name/channel"
                    style={input}
                  />
                </div>

                <button
                  type="button"
                  style={buttonPrimary}
                  onClick={() => {
                    const who = requester || "Requester";
                    const what = topic || "[Describe the records with reasonable detail]";
                    const hdr =
                      jurisdiction === "Federal"
                        ? "Freedom of Information Act, 5 U.S.C. § 552"
                        : "State Public Records Law";
                    const text = [
                      `${hdr} Request`,
                      ``,
                      `To the Records Officer:`,
                      ``,
                      `This is a request from ${who}. I request access to and copies of the following records:`,
                      `• ${what}.`,
                      ``,
                      `Format: Electronic copies preferred.`,
                      `Fees: Please notify me if fees will exceed $25; I request a fee waiver as a journalist acting in the public interest.`,
                      `Time: Please respond within statutory timelines; if you deny any part, cite the specific exemption and release all reasonably segregable material.`,
                      ``,
                      `Sincerely,`,
                      `${who}`,
                    ].join("\n");
                    // Copy to clipboard without external deps
                    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(text).then(() => {
                        alert("Draft request copied to clipboard.");
                      });
                    } else {
                      alert("Copy failed: your browser blocked clipboard access. Select & copy manually.");
                    }
                  }}
                >
                  Generate Request (copies to clipboard)
                </button>
              </div>
            </Card>

            <Card title="Tips">
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                <li>Keep scope clear but not so narrow they can dodge it.</li>
                <li>Ask for native formats (PDFs, emails in .eml/.msg, spreadsheets in .xlsx).</li>
                <li>Request fee waiver and expedited processing if newsworthy.</li>
                <li>Appeal partial denials; demand segregability.</li>
              </ul>
            </Card>
          </div>
        )}

        {activeTab === "speech" && (
          <div style={grid}>
            <Card title="Core Principles">
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                <li>Offensive speech is protected (see <i>Cohen v. California</i>).</li>
                <li>Time, place, manner limits must be content-neutral and narrowly tailored.</li>
                <li>Recording public officials in public is generally protected.</li>
              </ul>
            </Card>
            <Card title="On-the-Ground Reminders">
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                <li>Stay on public forums (sidewalks, parks) unless you have a permit.</li>
                <li>Document everything—names, badge numbers, locations, timestamps.</li>
                <li>Keep your own video rolling and back it up ASAP.</li>
              </ul>
            </Card>
          </div>
        )}

        {activeTab === "police" && (
          <div style={grid}>
            <Card title="Stops & ID">
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                <li>During a stop: ask “Am I being detained, or am I free to go?”</li>
                <li>You generally don’t have to ID yourself absent reasonable suspicion and a valid law.</li>
                <li>Never consent to searches; say “I don’t consent.”</li>
              </ul>
            </Card>
            <Card title="Aftermath">
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
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