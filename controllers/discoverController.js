import { tmdbService } from "@/services/tmdbService";
import { NextResponse } from "next/server";

export async function discover(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const genres = searchParams.get("genres")?.split(",").map(Number) || [];
    const providers = searchParams.get("providers")?.split(",") || [];

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    const results = await tmdbService.discover({ type, genres, providers });
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Controller Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
