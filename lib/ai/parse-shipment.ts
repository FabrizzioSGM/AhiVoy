// Provider-agnostic shipment parsing via Gemini API
// Swap this implementation to use a different LLM by replacing only this file.

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";
import type { AIParseResult, MissingField } from "./types";

// Zod for runtime validation of the parsed output
const ShipmentExtractionSchema = z.object({
  originCity: z.string(),
  originState: z.string(),
  destinationCity: z.string(),
  destinationState: z.string(),
  cargoDescription: z.string(),
  cargoType: z.string(),
  weightKg: z.number(),
  volumeM3: z.number().optional(),
  requiredDate: z.string(),
  declaredValue: z.number().optional(),
  missingFields: z.array(
    z.object({
      field: z.string(),
      question: z.string(),
    })
  ),
});

let _client: GoogleGenerativeAI | null = null;
function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY no está configurada en el servidor.");
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

const TODAY = () => new Date().toISOString().split("T")[0];

const SYSTEM_PROMPT = `Eres un asistente especializado en logística de carga en México.
Extrae información estructurada de envíos a partir de descripciones en lenguaje natural.

Reglas:
- Extrae TODOS los campos que puedas del texto.
- Infiere cuando sea razonable (ej: "CDMX" → estado "CDMX", ciudad "Ciudad de México").
- Normaliza estados a nombre completo (ej: "NL" → "Nuevo León", "GDL" → "Jalisco").
- Para campos que no puedas extraer, inclúyelos en missingFields con una pregunta de seguimiento en español.
- Tipo de carga: uno de Carga general, Manufactura, Electrodomésticos, Alimentos, Textiles, Papel, Autopartes, Materiales de construcción, Químicos, Otro.
- requiredDate en formato YYYY-MM-DD. Fechas relativas ("próxima semana") calcúlalas desde hoy (${TODAY()}). Vacío si no se menciona.
- weightKg: 0 si no se menciona.
- declaredValue en pesos MXN. Omitir si no se menciona.`;

export async function parseShipmentText(rawInput: string): Promise<AIParseResult> {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          originCity:       { type: SchemaType.STRING },
          originState:      { type: SchemaType.STRING },
          destinationCity:  { type: SchemaType.STRING },
          destinationState: { type: SchemaType.STRING },
          cargoDescription: { type: SchemaType.STRING },
          cargoType:        { type: SchemaType.STRING },
          weightKg:         { type: SchemaType.NUMBER },
          volumeM3:         { type: SchemaType.NUMBER },
          requiredDate:     { type: SchemaType.STRING },
          declaredValue:    { type: SchemaType.NUMBER },
          missingFields: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                field:    { type: SchemaType.STRING },
                question: { type: SchemaType.STRING },
              },
              required: ["field", "question"],
            },
          },
        },
        required: [
          "originCity", "originState", "destinationCity", "destinationState",
          "cargoDescription", "cargoType", "weightKg", "requiredDate", "missingFields",
        ],
      },
    },
  });

  const result = await model.generateContent(rawInput);
  const text = result.response.text();

  const raw = JSON.parse(text);
  const parsed = ShipmentExtractionSchema.parse(raw);

  const missingFields: MissingField[] = parsed.missingFields.map((mf) => ({
    field: mf.field as keyof import("./types").ParsedShipment,
    question: mf.question,
  }));

  return {
    success: true,
    parsed: {
      originCity:       parsed.originCity,
      originState:      parsed.originState,
      destinationCity:  parsed.destinationCity,
      destinationState: parsed.destinationState,
      cargoDescription: parsed.cargoDescription,
      cargoType:        parsed.cargoType,
      weightKg:         parsed.weightKg,
      volumeM3:         parsed.volumeM3,
      requiredDate:     parsed.requiredDate || TODAY(),
      declaredValue:    parsed.declaredValue,
    },
    missingFields,
    rawInput,
  };
}
