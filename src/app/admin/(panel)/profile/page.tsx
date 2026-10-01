import ProfileForm from "@/components/admin/ProfileForm";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminProfilePage() {
  const { profile } = readDb();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Shown on the home page and in the footer of every public page.
      </p>
      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
