import { NextResponse } from "next/server";
import { getAllMedia } from "@/lib/cosmos";
import { validateEnvironment } from "@/lib/config";

export async function GET() {
  validateEnvironment();
  try {
    const media = await getAllMedia();

    return NextResponse.json(media);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}