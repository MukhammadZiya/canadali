/**
 * Chrome for every public page: navbar, footer, page-view tracking.
 * The admin area deliberately lives outside this group — a CMS does not
 * need a marketing footer, and admin visits must not count as traffic.
 */
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageViewTracker from "@/components/PageViewTracker";
import { readDb } from "@/lib/db";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = readDb();

  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
