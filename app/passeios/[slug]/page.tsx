import { notFound } from "next/navigation";
import { SectionShell } from "@/components/section-shell";
import { getTourBySlug } from "@/lib/get-tour-by-slug";

type PasseioSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PasseioSlugPage({
  params
}: PasseioSlugPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  return (
    <SectionShell
      eyebrow="Passeio"
      title={tour.name}
      description="Página dinâmica inicial pronta para receber informações completas do roteiro."
    >
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-sea">
          Slug: {tour.slug}
        </p>
        <p className="mt-4 text-base leading-7 text-slate-700">{tour.summary}</p>
      </div>
    </SectionShell>
  );
}
