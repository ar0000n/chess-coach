import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log("API hit", "(request received)");

  if (!process.env.RESEND_API_KEY) {
    console.error("[waitlist] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const { email } = await req.json();
  console.log("API hit", email);

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();

  const { data, error } = await resend.emails.send({
    from: "ChessDebrief <waitlist@chessdebrief.com>",
    to: trimmed,
    subject: "You're on the ChessDebrief waitlist",
    text: "Hey, thanks for joining ChessDebrief. You're on the early access list — we'll email you the moment personalized debriefs go live for your account. Can't wait to show you what we've built. — The ChessDebrief Team",
  });

  if (error) {
    console.error("[waitlist] Resend error:", JSON.stringify(error));
    return NextResponse.json({ error: "Failed to send email", detail: error }, { status: 500 });
  }

  console.log("[waitlist] Email sent, id:", data?.id);
  return NextResponse.json({ ok: true });
}
