"use server";

/** The public consultation form. No auth — anyone may submit an inquiry. */
import { newId, updateDb } from "@/lib/db";

export interface InquiryState {
  ok?: boolean;
  error?: string;
}

export async function submitInquiry(
  _prev: InquiryState,
  fd: FormData
): Promise<InquiryState> {
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  // Honeypot: a hidden field real visitors never fill. Bots that do are
  // answered with success and silently dropped — arguing with bots is wasted.
  if (String(fd.get("company") ?? "") !== "") return { ok: true };

  updateDb((db) => {
    db.inquiries.unshift({
      id: newId("inq"),
      name: name.slice(0, 120),
      email: email.slice(0, 160),
      phone: String(fd.get("phone") ?? "").trim().slice(0, 40),
      service: String(fd.get("service") ?? "").trim().slice(0, 80),
      message: message.slice(0, 4000),
      date: new Date().toISOString(),
      status: "new",
    });
    db.analytics.submissions += 1;
  });

  return { ok: true };
}
