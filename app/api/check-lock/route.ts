import { NextResponse } from "next/server";
import {
  getLockRemainingMinutes,
  isAccountLocked,
} from "@/lib/loginAttempts";

export async function POST(request: Request) {
  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ locked: false });
  }

  if (isAccountLocked(email)) {
    return NextResponse.json({
      locked: true,
      minutes: getLockRemainingMinutes(email),
    });
  }

  return NextResponse.json({ locked: false });
}
