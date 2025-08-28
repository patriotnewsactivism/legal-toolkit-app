// src/components/legal_toolkit.js
import React, { useMemo, useState } from "react";

/**
 * Build a single-line "City, ST ZIP" safely, only when fields exist.
 */
function formatCityStateZip(city = "", state = "", zip = "") {
  if (!city && !state && !zip) return "";
  const comma = city && (state || zip) ? ", " : "";
  return `${city}${comma}${state} ${zip}`.trim();
}

/**
 * Exportable helper: returns a multi-line text header for letters/emails.
 * Use it if you need a raw string (clipboard, download, etc).
 */
export function buildHeaderText({
  senderName = "",
  senderAddress = "",
  city = "",
  state = "",
  zip = "",
  email = "",
  phone = "",
} = {}) {
  const loc = formatCityStateZip(city, state, zip);
  return [senderName, senderAddress, loc, email, phone]
    .filter(Boolean)
    .join("\n");
}

/**
 * Default export: a styled React component rendering the header block.
 *
 * Props (all optional):
 *  - senderName, senderAddress, city, state, zip, email, phone (strings)
 *  - showActions (boolean) => shows Copy button for quick use
 */
export default function LegalToolkitHeader(props) {
  const {
    senderName = "",
    senderAddress = "",
    city = "",
    state = "",
    zip = "",
    email = "",
    phone = "",
    showActions = true,
  } = props;

  const loc = useMemo(
    () => formatCityStateZip(city, state, zip),
    [city, state, zip]
  );

  const headerText = useMemo(
    () =>
      buildHeaderText({
        senderName,
        senderAddress,
        city,
        state,
        zip,
        email,
        phone,
      }),
    [senderName, senderAddress, city, state, zip, email, phone]
  );

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(headerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op: clipboard may be blocked in some contexts
    }
  }

  return (
    <section
      style={{
        maxWidth: 720,
        width: "100%",
        margin: "1rem auto",
        padding: "1rem",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.125rem",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          Sender Information
        </h2>

        {showActions && (
          <button
            type="button"
            onClick={handleCopy}
            style={{
              appearance: "none",
              border: "1px solid rgba(0,0,0,0.12)",
              background: copied ? "#10b981" : "#111827",
              color: "#fff",
              borderRadius: 12,
              padding: "0.5rem 0.9rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 120ms ease, opacity 120ms ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {copied ? "Copied" : "Copy Header"}
          </button>
        )}
      </header>

      <address
        style={{
          lineHeight: 1.6,
          fontStyle: "normal",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "0.98rem",
        }}
      >
        {senderName && (
          <>
            {senderName}
            <br />
          </>
        )}
        {senderAddress && (
          <>
            {senderAddress}
            <br />
          </>
        )}
        {loc && (
          <>
            {loc}
            <br />
          </>
        )}
        {email && (
          <>
            {email}
            <br />
          </>
        )}
        {phone && <>{phone}</>}
      </address>
    </section>
  );
}