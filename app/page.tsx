import { HomeLanding } from "@/components/home/home-landing";
import { getSiteContent } from "@/lib/content-store";

export const revalidate = 0; // garante dados frescos sempre que houver alteração

export default async function HomePage() {
  const content = await getSiteContent().catch(() => null);
  return <HomeLanding initialContent={content || undefined} />;
}
