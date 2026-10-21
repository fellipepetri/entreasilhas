import { NextRequest, NextResponse } from "next/server";
import { getComprehensiveMarineReport } from "@/lib/marine-weather";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    const targetDate = dateParam ? new Date(dateParam) : new Date();

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Data fornecida inválida. Use o formato YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const report = await getComprehensiveMarineReport(targetDate);

    return NextResponse.json(report, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    console.error("Erro ao obter previsão e marés:", error);
    return NextResponse.json(
      { error: "Erro ao processar informações meteorológicas e marés." },
      { status: 500 }
    );
  }
}
