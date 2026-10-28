import { NextRequest, NextResponse } from "next/server";
import { searchAnime } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || undefined;
  const genre = searchParams.get("genre") || undefined;
  const status = searchParams.get("status") || undefined;
  const type = searchParams.get("type") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  try {
    const result = await searchAnime({
      query,
      genre,
      status,
      type,
      sort,
      page,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch anime data" },
      { status: 500 }
    );
  }
}
