import { Instagram, MapPin, Send } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSettings } from "@/lib/content";
import type { Locale } from "@/types/content";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");
  const locale = await getLocale();
  const settings = await getSettings(locale as Locale);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso px-5 pb-8 pt-16 text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-4xl text-white">
            {settings?.siteName || "7mmcoffee"}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-cream/70">
            {t("tagline")}
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
            Explore
          </p>
          <div className="grid gap-3 text-sm">
            {[
              ["home", "/"],
              ["about", "/about"],
              ["menu", "/menu"],
              ["stories", "/stories"],
              ["contact", "/contact"],
            ].map(([key, href]) => (
              <Link key={key} href={href} className="w-fit hover:text-white">
                {nav(key)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
            Follow
          </p>
          <div className="flex gap-3">
            {settings?.instagramUrl && (
              <a
                aria-label="Instagram"
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 p-2 hover:bg-white hover:text-espresso">
                <Instagram size={17} />
              </a>
            )}
            {settings?.googleMapsUrl && (
              <a
                aria-label="Map"
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 p-2 hover:bg-white hover:text-espresso">
                <MapPin size={17} />
              </a>
            )}
            {settings?.email && (
              <a
                aria-label="Email"
                href={`mailto:${settings.email}`}
                className="rounded-full border border-white/20 p-2 hover:bg-white hover:text-espresso">
                <Send size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 pt-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
        <span>{t("copyright", { year })}</span>
        <span>{locale === "vi" ? "Việt Nam" : "Vietnam"}</span>
      </div>
    </footer>
  );
}
