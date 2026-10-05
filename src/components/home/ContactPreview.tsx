import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { PublicSettings } from "@/types/content";

export async function ContactPreview({ settings }: { settings: PublicSettings }) {
  const t = await getTranslations("Home"); const nav = await getTranslations("Navigation");
  return <section className="bg-coffee px-5 py-16 text-cream lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr]"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-cream/65">7mmcoffee</p><h2 className="mt-4 max-w-xl font-display text-5xl leading-none text-white sm:text-6xl">{t("contactTitle")}</h2><Button asChild variant="secondary" className="mt-8"><Link href="/contact">{nav("contact")}</Link></Button></div><div className="grid gap-5 border-t border-white/20 pt-7 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"><div><MapPin className="mb-3" size={19} /><p className="text-sm leading-6 text-cream/80">{settings.address}</p></div><div><Phone className="mb-3" size={19} /><a href={`tel:${settings.phone}`} className="text-sm text-cream/80 hover:text-white">{settings.phone}</a><Mail className="mb-3 mt-6" size={19} /><a href={`mailto:${settings.email}`} className="text-sm text-cream/80 hover:text-white">{settings.email}</a></div></div></div></section>;
}
