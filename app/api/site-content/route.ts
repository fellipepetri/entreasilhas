import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar dados do site" },
      { status: 500 }
    );
  }
}
