import { NextRequest, NextResponse } from "next/server";
import { parseShipmentText } from "@/lib/ai/parse-shipment";
import type { AIParseResponse } from "@/lib/ai/types";

export const runtime = "nodejs";
export const maxDuration = 30; // seconds — extended thinking may take a moment

export async function POST(req: NextRequest): Promise<NextResponse<AIParseResponse>> {
  try {
    const body = await req.json();
    const rawInput: string = body?.text ?? "";

    if (!rawInput || rawInput.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "El texto es demasiado corto. Describe tu envío con más detalle." },
        { status: 400 }
      );
    }

    const result = await parseShipmentText(rawInput.trim());
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("[AI parse-shipment]", err);

    const raw = err instanceof Error ? err.message : String(err);
    let message = "Error interno del servidor. Intenta de nuevo.";
    let status = 500;

    if (raw.includes("429") || raw.includes("quota") || raw.includes("rate")) {
      message = "El servicio de IA está temporalmente saturado. Usa el formulario manual o intenta en unos minutos.";
      status = 429;
    } else if (raw.includes("API_KEY") || raw.includes("GEMINI_API_KEY")) {
      message = "El servicio de IA no está configurado. Usa el formulario manual.";
      status = 503;
    }

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
