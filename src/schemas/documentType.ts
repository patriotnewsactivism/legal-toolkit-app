// src/schemas/documentType.ts
// Single source of truth for document types + Zod schema with light normalization.

import { z } from "zod";

export const DOCUMENT_TYPES = [
  "FOIA Request",
  "State Public Records Request",
  "ID Rights Card",
  "Cease and Desist Letter",
  "Notice of Claim",
  "Pre-Suit Notice",
  "Subpoena Duces Tecum",
  "Discovery Request",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

const Enum = z.enum(DOCUMENT_TYPES);

function normalize(input: unknown): unknown {
  if (typeof input !== "string") return input;
  const s = input.trim();
  if (!s) return s;
  const k = s.toLowerCase();
  const alias: Record<string, DocumentType> = {
    "foia": "FOIA Request",
    "foia request": "FOIA Request",
    "public records request": "State Public Records Request",
    "state public records request": "State Public Records Request",
    "id rights card": "ID Rights Card",
    "id card": "ID Rights Card",
    "cease and desist": "Cease and Desist Letter",
    "cease & desist": "Cease and Desist Letter",
    "notice of claim": "Notice of Claim",
    "pre suit notice": "Pre-Suit Notice",
    "pre-suit notice": "Pre-Suit Notice",
    "subpoena duces tecum": "Subpoena Duces Tecum",
    "discovery request": "Discovery Request",
  };
  return alias[k] ?? s;
}

/**
 * Accepts strings with minor variations (case/spacing/common synonyms),
 * then validates against the strict enum.
 */
export const DocumentTypeSchema = z.preprocess(normalize, Enum);

export function parseDocumentType(input: unknown): DocumentType {
  return DocumentTypeSchema.parse(input);
}

export function safeParseDocumentType(input: unknown, fallback: DocumentType = "FOIA Request"): DocumentType {
  try {
    return parseDocumentType(input);
  } catch {
    return fallback; // Avoid throwing at runtime if UI hasn't picked a value yet.
  }
}
