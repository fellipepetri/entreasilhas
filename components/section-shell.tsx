type SectionShellProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}>;

export function SectionShell({
  eyebrow,
  title,
  description,
  children
}: SectionShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24">
      <div className="max-w-3xl">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-brand-sea">{eyebrow}</p>
        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-deep leading-tight">{title}</h1>
        <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}
