import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Allow without secret in dev, require secret in production
  const isDev = process.env.VERCEL_ENV !== "production";
  if (!isDev) {
    const secret = req.nextUrl.searchParams.get("secret");
    if (!process.env.DRAFT_SECRET || secret !== process.env.DRAFT_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }
  }

  const dm = await draftMode();
  dm.enable();

  return NextResponse.json({ draftMode: true });
}
