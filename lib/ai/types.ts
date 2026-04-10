// Provider-agnostic AI types for shipment parsing
// These interfaces are shared between the API route and the client component

export interface ParsedShipment {
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  cargoDescription: string;
  cargoType: string;
  weightKg: number;
  volumeM3?: number;
  requiredDate: string; // ISO date string YYYY-MM-DD
  declaredValue?: number;
}

export interface MissingField {
  field: keyof ParsedShipment;
  question: string; // Human-readable follow-up question in Spanish
}

export interface AIParseResult {
  success: true;
  parsed: ParsedShipment;
  missingFields: MissingField[];
  rawInput: string;
}

export interface AIParseError {
  success: false;
  error: string;
}

export type AIParseResponse = AIParseResult | AIParseError;
