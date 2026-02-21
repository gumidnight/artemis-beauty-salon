export const runtime = 'edge';



import { NextResponse } from "next/server";
import { addSubscriber, isValidEmail } from "@/lib/subscribers";


export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload || typeof payload.email !== "string") {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const email = payload.email.trim();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const result = await addSubscriber(email);
  return NextResponse.json(result, { status: 201 });
}
