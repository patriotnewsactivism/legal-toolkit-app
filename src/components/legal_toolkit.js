```jsx
// FILE: src/components/legal_toolkit.js
// A modern, self-contained React component for generating legal letters.
// Focus: clarity, stability, testability. No external deps.

import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

/**
 * WHY: Centralize state transitions; makes behavior explicit and testable.
 */
const initialState = {
  fields: {
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    subject: '',
    body: '',
    reference: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: '',
    date: new Date().toISOString().slice(0, 10),
  },
  template: DEFAULT_TEMPLATE,
  errors: {},
  dirty: false,
  lastSavedAt: null,
  step: 1, // 1: form, 2: preview
  loading: false,
  shareUrl: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload, dirty: false };
    case 'FIELD': {
      const { name, value } = action;
      return {
        ...state,
        fields: { ...state.fields, [name]: value },
        dirty: true,
      };
    }
    case 'TEMPLATE':
      return { ...state, template: action.value, dirty: true };
    case 'ERRORS':
      return { ...state, errors: action.errors };
    case 'STEP':
      return { ...state, step: action.step };
    case 'SAVED':
      return { ...state, lastSavedAt: action.when, dirty: false };
    case 'SHARE':
      return { ...state, shareUrl: action.url };
    default:
      return state;
  }
}

const STORAGE_KEY = 'legal-toolkit:v2';

/** Default template using double-curly placeholders. */
const DEFAULT_TEMPLATE = `
{{date}}

{senderName}<br />
{senderAddress}<br />
{city}, {state} {zip}<br />
{email}<br />
{phone}

To:
{{recipientName}}
{{recipientAddress}}

Re: {{subject}}
Ref: {{reference}}

Dear {{recipientName}},

{{body}}

Sincerely,

{{senderName}}
`;

/**
 * Tiny sanitizer. Avoids newlines-only/whitespace-only values and trims.
 */
function clean(value) {
  if (typeof value !== 'string') return value;
  const v = value.replace(/\r/g, '').trim();
  return v;
}

/**
 * Validate core fields. Return map of field -> message.
 */
function validate(fields) {
  const e = {};
  const req = ['senderName', 'recipientName', 'subject', 'body', 'date'];
  for (const k of req) if (!clean(fields[k])) e[k] = 'Required';
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Invalid email';
  if (fields.phone && !/^[+\d][\d\s().-]{6,}$/.test(fields.phone)) e.phone = 'Invalid phone';
  if (fields.zip && !/^[\dA-Za-z\-\s]{3,10}$/.test(fields.zip)) e.zip = 'Invalid ZIP/postcode';
  return e;
}

/**
 * Replace {{placeholders}} in template using provided fields. Unknown tokens remain.
 */
function interpolateTemplate(template, fields) {
  return template.replace(/\{\{(.*?)\}\}/g, (_m, key) => {
    const k = String(key).trim();
    const v = fields[k];
    return v == null || v === '' ? `{{${k}}}` : String(v);
  });
}

/**
 * Build a shareable URL by encoding state into the hash. Avoids leaking to servers.
 */
function buildShareUrl({ fields, template }) {
  const payload = { f: fields, t: template };
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const url = `${window.location.origin}${window.location.pathname}#state=${b64}`;
  return url;
}

/**
 * Attempt to hydrate from share hash or localStorage.
 */
function loadInitial() {
  try {
    const hash = new URL(window.location.href).hash;
    const match = hash.match(/state=([^&]+)/);
    if (match) {
      const json = JSON.parse(decodeURIComponent(escape(atob(match[1]))));
      return {
        fields: { ...initialState.fields, ...json.f },
        template: json.t || DEFAULT_TEMPLATE,
      };
    }
  } catch (_) {
    // fall back
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

/**
 * Download a text Blob.
 */
function download(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/**
 * Render-only component. Export default for app usage.
 */
export default function LegalToolkit() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimer = useRef(null);

  // On mount: hydrate from share hash or storage.
  useEffect(() => {
    const loaded = loadInitial();
    if (loaded) dispatch({ type: 'LOAD', payload: loaded });
  }, []);

  // Debounced autosave to localStorage.
  useEffect(() => {
    if (!state.dirty) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ fields: state.fields, template: state.template })
        );
        dispatch({ type: 'SAVED', when: new Date().toISOString() });
      } catch (_) {
        // WHY: Storage might be disabled; ignore but don't crash
      }
    }, 400);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [state.dirty, state.fields, state.template]);

  const onField = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'FIELD', name, value });
  }, []);

  const onTemplate = useCallback((e) => dispatch({ type: 'TEMPLATE', value: e.target.value }), []);

  // Stable letter generator.
  const generateLetter = useCallback(
    (draftFields) => interpolateTemplate(state.template, draftFields ?? state.fields),
    [state.template, state.fields]
  );

  const preview = useMemo(() => generateLetter(state.fields), [generateLetter, state.fields]);

  const onPreview = useCallback(() => {
    const errs = validate(state.fields);
    dispatch({ type: 'ERRORS', errors: errs });
    if (Object.keys(errs).length === 0) dispatch({ type: 'STEP', step: 2 });
  }, [state.fields]);

  const onEdit = useCallback(() => dispatch({ type: 'STEP', step: 1 }), []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(preview);
      alert('Copied to clipboard');
    } catch {
      alert('Copy failed. Select the text and copy manually.');
    }
  }, [preview]);

  const onDownloadTxt = useCallback(() => download('letter.txt', preview), [preview]);
  const onDownloadMd = useCallback(() => download('letter.md', preview), [preview]);

  const onPrint = useCallback(() => {
    // WHY: Dedicated window avoids printing the app shell
    const w = window.open('', 'print');
    if (!w) return;
    w.document.write(
      `<pre style="white-space:pre-wrap;font:14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">${
        escapeHtml(preview)
      }</pre>`
    );
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }, [preview]);

  const onReset = useCallback(() => {
    if (!window.confirm('Clear all fields?')) return;
    dispatch({ type: 'LOAD', payload: initialState });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  const onShare = useCallback(() => {
    try {
      const url = buildShareUrl({ fields: state.fields, template: state.template });
      dispatch({ type: 'SHARE', url });
      navigator.clipboard?.writeText(url);
      alert('Share URL copied to clipboard');
    } catch {
      alert('Failed to create share URL');
    }
  }, [state.fields, state.template]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Legal Letter Toolkit</h1>
      <p className="text-sm opacity-70 mb-4">Generate, preview, and export structured letters.</p>

      {state.step === 1 ? (
        <FormView
          state={state}
          onField={onField}
          onTemplate={onTemplate}
          onPreview={onPreview}
          onReset={onReset}
        />
      ) : (
        <PreviewView
          preview={preview}
          onEdit={onEdit}
          onCopy={onCopy}
          onDownloadTxt={onDownloadTxt}
          onDownloadMd={onDownloadMd}
          onPrint={onPrint}
          onShare={onShare}
          shareUrl={state.shareUrl}
        />
      )}

      <MetaBar lastSavedAt={state.lastSavedAt} />
    </div>
  );
}

function MetaBar({ lastSavedAt }) {
  return (
    <div className="mt-6 text-xs opacity-70">
      {lastSavedAt ? (
        <span>Autosaved at {new Date(lastSavedAt).toLocaleTimeString()}</span>
      ) : (
        <span>Autosave active</span>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, error, type = 'text' }) {
  const id = `f_${name}`;
  return (
    <label htmlFor={id} className="block text-sm mb-3">
      <span className="block font-medium mb-1">{label}</span>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={8}
          className="w-full border rounded p-2"
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border rounded p-2"
        />
      )}
      {error && (
        <span role="alert" className="mt-1 block text-red-600 text-xs">
          {error}
        </span>
      )}
    </label>
  );
}

function FormView({ state, onField, onTemplate, onPreview, onReset }) {
  const { fields, template, errors } = state;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Parties & Details</h2>
        <Field label="Date" name="date" value={fields.date} onChange={onField} type="date" />
        <Field label="Sender name" name="senderName" value={fields.senderName} onChange={onField} error={errors.senderName} />
        <Field label="Sender address" name="senderAddress" value={fields.senderAddress} onChange={onField} />
        <div className="grid grid-cols-3 gap-2">
          <Field label="City" name="city" value={fields.city} onChange={onField} />
          <Field label="State" name="state" value={fields.state} onChange={onField} />
          <Field label="ZIP" name="zip" value={fields.zip} onChange={onField} error={errors.zip} />
        </div>
        <Field label="Email" name="email" value={fields.email} onChange={onField} error={errors.email} />
        <Field label="Phone" name="phone" value={fields.phone} onChange={onField} error={errors.phone} />
        <hr className="my-4" />
        <Field label="Recipient name" name="recipientName" value={fields.recipientName} onChange={onField} error={errors.recipientName} />
        <Field label="Recipient address" name="recipientAddress" value={fields.recipientAddress} onChange={onField} />
        <Field label="Subject" name="subject" value={fields.subject} onChange={onField} error={errors.subject} />
        <Field
          label="Reference"
          name="reference"
          value={fields.reference}
          onChange={onField}
          placeholder="Optional internal reference"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Template</h2>
        <textarea
          value={template}
          onChange={onTemplate}
          rows={24}
          className="w-full border rounded p-2 font-mono text-sm"
          aria-label="Letter template"
        />
        <div className="text-xs opacity-70 mt-2">
          Placeholders: {'{'}{`{senderName}`}{'}'}, {'{'}{`{recipientName}`}{'}'}, {'{'}{`{subject}`}{'}'}, {'{'}{`{body}`}{'}'}, etc.
        </div>
      </div>

      <div className="md:col-span-2 flex gap-2 mt-2">
        <button className="px-3 py-2 rounded bg-black text-white" onClick={onPreview}>
          Preview
        </button>
        <button className="px-3 py-2 rounded border" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

function PreviewView({ preview, onEdit, onCopy, onDownloadTxt, onDownloadMd, onPrint, onShare, shareUrl }) {
  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        <button className="px-3 py-2 rounded border" onClick={onEdit}>
          Edit
        </button>
        <button className="px-3 py-2 rounded bg-black text-white" onClick={onCopy}>
          Copy
        </button>
        <button className="px-3 py-2 rounded border" onClick={onDownloadTxt}>
          Download .txt
        </button>
        <button className="px-3 py-2 rounded border" onClick={onDownloadMd}>
          Download .md
        </button>
        <button className="px-3 py-2 rounded border" onClick={onPrint}>
          Print
        </button>
        <button className="px-3 py-2 rounded border" onClick={onShare}>
          Share
        </button>
      </div>
      {shareUrl && (
        <div className="text-xs mb-2">
          Share link: <a className="underline" href={shareUrl}>{shareUrl}</a>
        </div>
      )}
      <pre className="border rounded p-3 whitespace-pre-wrap text-sm font-mono">{preview}</pre>
    </div>
  );
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

// Hook usage example inside this file (addresses your earlier lint issue):
// We keep all effects with explicit deps and avoid disabling the rule globally.
// If you still need the old effect call somewhere, use:
//
// useEffect(() => {
//   generateLetter(state.fields);
// }, [generateLetter, state.fields]);
```
