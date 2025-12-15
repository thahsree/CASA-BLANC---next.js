import { NextResponse } from "next/server";

// Mock login API route
// In real deployments replace this with your real auth flow (NextAuth, custom
// user service, or OAuth). This mock route just returns success for demo.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Basic validation (demo)
    if (!body?.email || !body?.password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    // TODO: verify credentials against database

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
