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
    <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-sea">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
          {description}
        </p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
