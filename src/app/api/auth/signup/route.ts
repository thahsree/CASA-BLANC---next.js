import { NextResponse } from "next/server";

// Mock signup API route
// In production you should create a user record, hash the password, and
// return appropriate responses. This is a lightweight dev stub.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.email || !body?.password || !body?.name) {
      return NextResponse.json({ message: "Name, email and password required" }, { status: 400 });
    }

    // TODO: persist user to database, hash password

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
