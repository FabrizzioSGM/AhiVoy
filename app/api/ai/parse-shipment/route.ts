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
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    console.error("[AI parse-shipment]", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
