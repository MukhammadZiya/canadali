import ConsultationForm from "@/components/admin/ConsultationForm";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminConsultationPage() {
  const { consultation } = readDb();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">
        Consultation info
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Pricing, package contents and availability shown on the public
        consultation page.
      </p>
      <div className="mt-6">
        <ConsultationForm consultation={consultation} />
      </div>
    </div>
  );
}
