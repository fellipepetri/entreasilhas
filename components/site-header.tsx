import Link from "next/link";
import { navigationLinks } from "@/data/navigation";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/70 bg-white/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-[0.16em] text-brand-deep">
          ENTRE AS ILHAS
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-center gap-5 text-sm text-slate-600">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-brand-sea">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
