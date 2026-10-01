"use server";

/**
 * Every admin mutation on the site's content.
 *
 * Each action revalidates the public pages it affects, which is what makes a
 * save in the dashboard appear on the website immediately — the App Router
 * caches rendered pages until told their data changed.
 *
 * Defence in depth: the middleware already blocks unauthenticated /admin
 * traffic, but server actions are HTTP endpoints of their own, so each
 * mutation re-checks the session cookie before touching the database.
 */
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { newId, updateDb } from "@/lib/db";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";
import type { InquiryStatus } from "@/lib/types";

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const cookie = jar.get(SESSION_COOKIE)?.value;
  if (!cookie || cookie !== (await sessionToken())) {
    throw new Error("Not authenticated.");
  }
}

export interface ActionState {
  ok?: boolean;
  error?: string;
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Multi-line textarea -> clean string array (one item per line). */
const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// ─── Profile ────────────────────────────────────────────────────────────

export async function saveProfile(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = str(fd, "name");
  const email = str(fd, "email");
  if (!name || !email) return { error: "Name and email are required." };

  updateDb((db) => {
    db.profile.name = name;
    db.profile.title = str(fd, "title");
    db.profile.credentials = lines(fd, "credentials");
    db.profile.bio = str(fd, "bio");
    db.profile.philosophy = str(fd, "philosophy");
    db.profile.photoUrl = str(fd, "photoUrl");
    db.profile.phone = str(fd, "phone");
    db.profile.email = email;
    db.profile.address = str(fd, "address");
    db.profile.social = {
      linkedin: str(fd, "linkedin"),
      youtube: str(fd, "youtube"),
      twitter: str(fd, "twitter"),
      instagram: str(fd, "instagram"),
    };
  });

  // The profile appears on the home page and in the footer of every page.
  revalidatePath("/", "layout");
  return { ok: true };
}

// ─── Success stories ────────────────────────────────────────────────────

export async function saveStory(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(fd, "id");
  const name = str(fd, "name");
  const visaType = str(fd, "visaType");
  if (!name || !visaType) return { error: "Client name and visa type are required." };

  const record = {
    name,
    visaType,
    country: str(fd, "country"),
    year: str(fd, "year"),
    summary: str(fd, "summary"),
    quote: str(fd, "quote"),
    published: fd.get("published") === "on",
  };

  updateDb((db) => {
    if (id) {
      const existing = db.stories.find((s) => s.id === id);
      if (existing) Object.assign(existing, record);
    } else {
      // Newest first, matching how the public page presents them.
      db.stories.unshift({ id: newId("st"), ...record });
    }
  });

  revalidatePath("/success-stories");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteStory(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  updateDb((db) => {
    db.stories = db.stories.filter((s) => s.id !== id);
  });
  revalidatePath("/success-stories");
  revalidatePath("/");
}

// ─── News ───────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function saveArticle(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = str(fd, "id");
  const title = str(fd, "title");
  const content = str(fd, "content");
  if (!title || !content) return { error: "Title and content are required." };

  const record = {
    title,
    category: str(fd, "category") || "IRCC Updates",
    date: str(fd, "date") || new Date().toISOString().slice(0, 10),
    excerpt: str(fd, "excerpt"),
    content,
    published: fd.get("published") === "on",
  };

  updateDb((db) => {
    if (id) {
      const existing = db.news.find((a) => a.id === id);
      // The slug is deliberately never regenerated on edit: it is the public
      // URL, and changing a title must not break links already shared.
      if (existing) Object.assign(existing, record);
    } else {
      let slug = slugify(title) || newId("post");
      // Guarantee uniqueness — a duplicate slug would shadow an older article.
      if (db.news.some((a) => a.slug === slug)) slug = `${slug}-${newId("x")}`;
      db.news.unshift({ id: newId("n"), slug, ...record });
    }
  });

  revalidatePath("/news", "layout");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteArticle(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  updateDb((db) => {
    db.news = db.news.filter((a) => a.id !== id);
  });
  revalidatePath("/news", "layout");
  revalidatePath("/");
}

// ─── Consultation info ──────────────────────────────────────────────────

export async function saveConsultation(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await requireAdmin();

  updateDb((db) => {
    db.consultation.intro = str(fd, "intro");
    db.consultation.availabilityNote = str(fd, "availabilityNote");
    // Packages arrive as indexed fields (pk-0-name, pk-1-name, …) from the
    // repeating form section.
    db.consultation.packages = db.consultation.packages.map((pkg, i) => ({
      ...pkg,
      name: str(fd, `pk-${i}-name`) || pkg.name,
      price: str(fd, `pk-${i}-price`) || pkg.price,
      duration: str(fd, `pk-${i}-duration`),
      description: str(fd, `pk-${i}-description`),
      features: lines(fd, `pk-${i}-features`),
      highlighted: fd.get(`pk-${i}-highlighted`) === "on",
    }));
  });

  revalidatePath("/consultation");
  return { ok: true };
}

// ─── Inquiries ──────────────────────────────────────────────────────────

export async function setInquiryStatus(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  const status = str(fd, "status") as InquiryStatus;
  if (!["new", "contacted", "closed"].includes(status)) return;

  updateDb((db) => {
    const inquiry = db.inquiries.find((q) => q.id === id);
    if (inquiry) inquiry.status = status;
  });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = str(fd, "id");
  updateDb((db) => {
    db.inquiries = db.inquiries.filter((q) => q.id !== id);
  });
  revalidatePath("/admin/inquiries");
}
