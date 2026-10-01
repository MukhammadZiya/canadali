/**
 * The shape of everything the site stores.
 *
 * One JSON document holds all content (see data/db.json). The admin panel
 * edits these records; the public site renders them. Keeping the types in one
 * file means a field added here shows up as a compile error everywhere it has
 * not been handled yet.
 */

export interface Profile {
  name: string;
  title: string;
  credentials: string[];
  /** Paragraphs separated by blank lines — rendered with whitespace-pre-line. */
  bio: string;
  philosophy: string;
  /** Empty string renders the branded placeholder instead of an image. */
  photoUrl: string;
  phone: string;
  email: string;
  address: string;
  social: {
    linkedin: string;
    youtube: string;
    twitter: string;
    instagram: string;
  };
  stats: { value: string; label: string }[];
}

export interface Story {
  id: string;
  /** First name + initial only — clients are never identified in full. */
  name: string;
  visaType: string;
  country: string;
  year: string;
  summary: string;
  quote: string;
  published: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** ISO date, e.g. "2026-09-18". */
  date: string;
  excerpt: string;
  /** Paragraphs separated by blank lines. */
  content: string;
  published: boolean;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface Consultation {
  intro: string;
  packages: Package[];
  expectations: { title: string; body: string }[];
  availabilityNote: string;
}

export type InquiryStatus = "new" | "contacted" | "closed";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  /** ISO datetime of submission. */
  date: string;
  status: InquiryStatus;
}

export interface DailyViews {
  /** ISO date. */
  date: string;
  views: number;
  visitors: number;
}

export interface Analytics {
  /** Path -> lifetime view count, e.g. { "/": 1203 }. */
  pageTotals: Record<string, number>;
  /** Rolling daily series, oldest first. */
  dailyViews: DailyViews[];
  visitors: number;
  submissions: number;
}

export interface Db {
  profile: Profile;
  stories: Story[];
  news: Article[];
  consultation: Consultation;
  inquiries: Inquiry[];
  analytics: Analytics;
}
