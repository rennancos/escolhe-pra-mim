import { tmdbService } from "@/services/tmdbService";
import { NextResponse } from "next/server";

export async function getGenres(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    const genres = await tmdbService.getGenres(type);
    return NextResponse.json({ genres });
  } catch (error) {
    console.error("Genres Controller Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
