// src/components/legal_toolkit.js
import React from "react";

export default function <LegalToolkitHeader
  senderName={form.senderName}
  senderAddress={form.senderAddress}
  city={form.city}
  state={form.state}
  zip={form.zip}
  email={form.email}
  phone={form.phone}
/>{
  // build "City, ST ZIP" only if something exists
  const loc =
    city || state || zip
      ? `${city}${city && (state || zip) ? ", " : ""}${state} ${zip}`.trim()
      : "";

  return (
    <address style={{ lineHeight: 1.6, fontStyle: "normal" }}>
      {senderName}<br />
      {senderAddress}<br />
      {loc && (<>{loc}<br /></>)}
      {email}<br />
      {phone}
    </address>
  );
}