import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { PublicSettings } from "@/types/content";

export async function Hero({ settings }: { settings: PublicSettings }) {
  const t = await getTranslations("Navigation");
  return <section className="relative flex min-h-[44rem] items-end overflow-hidden bg-espresso text-white sm:min-h-screen"><Image src={settings.heroImage} alt="7mmcoffee atmosphere" fill priority sizes="100vw" className="object-cover" />{settings.heroVideo ? <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline aria-hidden src={settings.heroVideo} /> : null}<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,10,.72),rgba(18,13,10,.18)_65%,rgba(18,13,10,.34)),linear-gradient(0deg,rgba(18,13,10,.48),transparent_52%)]" /><div className="noise pointer-events-none absolute inset-0 opacity-20" /><div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-36 lg:px-8 lg:pb-24"><p className="mb-6 text-xs font-semibold uppercase tracking-[.32em] text-cream/80">Est. 2026 · Saigon</p><h1 className="max-w-4xl font-display text-6xl leading-[.87] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">7mmcoffee</h1><p className="mt-7 max-w-md text-lg leading-7 text-cream/90 sm:text-xl">{settings.heroSlogan}</p><div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/menu">{t("explore")}</Link></Button><Button asChild size="lg" variant="secondary"><Link href="/about">{t("ourStory")}</Link></Button></div><a href="#introduction" aria-label="Scroll to introduction" className="absolute bottom-7 right-5 hidden animate-bounce rounded-full border border-white/30 p-3 md:block lg:right-8"><ArrowDown size={18} /></a></div></section>;
}
