import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 10; // revalida a cada 10 segundos no Edge/Cache

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59"
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar dados do site" },
      { status: 500 }
    );
  }
}
