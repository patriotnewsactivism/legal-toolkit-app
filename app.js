/*
 * Civil Rights Legal Toolkit – Upgraded
 * React single-page app with FOIA generator + subscription stub
 */

const { useState } = React;

// Example dataset with state-specific FOIA rules
const stateData = {
  Texas: {
    deadline: "10 business days",
    statute: "Texas Gov. Code § 552.301",
    notes: "Agency must respond within 10 business days (release, deny, or seek AG opinion)."
  },
  Tennessee: {
    deadline: "7 business days",
    statute: "Tenn. Code Ann. § 10-7-503",
    notes: "Records custodian must grant or deny within 7 business days."
  }
};

// Document Generator Component
function DocumentGenerator() {
  const [state, setState] = useState("Texas");
  const [agency, setAgency] = useState("");
  const [records, setRecords] = useState("");
  const [letter, setLetter] = useState("");

  const generateLetter = () => {
    const info = stateData[state];
    const output = `
${agency}
Public Records Officer

RE: Public Records Request under ${info.statute}

To Whom It May Concern,

I am exercising my right under ${info.statute}. Please provide access to:

${records}

This request should be processed within ${info.deadline}. ${info.notes}

Respectfully,
[Your Name Here]
    `;
    setLetter(output);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">FOIA / Records Request Generator</h1>
      
      <div className="space-y-4">
        <label className="block">
          Select State:
          <select 
            className="ml-2 p-2 text-black"
            value={state}
            onChange={e => setState(e.target.value)}
          >
            {Object.keys(stateData).map(s => <option key={s}>{s}</option>)}
          </select>
        </label>

        <input
          className="w-full p-2 text-black"
          placeholder="Agency / Records Custodian"
          value={agency}
          onChange={e => setAgency(e.target.value)}
        />

        <textarea
          className="w-full p-2 text-black"
          rows="3"
          placeholder="Describe the records requested"
          value={records}
          onChange={e => setRecords(e.target.value)}
        />

        <button 
          className="bg-green-500 px-4 py-2 rounded"
          onClick={generateLetter}
        >
          Generate Request
        </button>
      </div>

      {letter && (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Generated Request:</h2>
          <pre className="whitespace-pre-wrap">{letter}</pre>
        </div>
      )}
    </div>
  );
}

// Subscription Stub
function SubscriptionBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-yellow-400 text-black p-4 rounded mb-4 flex justify-between items-center">
      <span><strong>Upgrade:</strong> Get unlimited templates with Premium ($10/month)</span>
      <button className="ml-4 px-3 py-1 bg-black text-white rounded"
        onClick={() => setVisible(false)}>
        Dismiss
      </button>
    </div>
  );
}

// App Root
function App() {
  return (
    <div>
      <SubscriptionBanner />
      <DocumentGenerator />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
