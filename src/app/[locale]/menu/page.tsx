import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategories, getProducts } from "@/lib/content";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { ContentMissing } from "@/components/shared/ContentMissing";
import type { Locale } from "@/types/content";

export const metadata: Metadata = { title: "Menu", description: "Thoughtfully made coffee, tea, signature drinks and pastries." };
export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) { const { locale: paramLocale } = await params; const locale = paramLocale as Locale; setRequestLocale(locale); const [products, categories, t] = await Promise.all([getProducts(locale), getCategories(locale), getTranslations("Menu")]); if (!products.length && !categories.length) return <ContentMissing />; return <section className="px-5 pb-20 pt-36 lg:px-8 lg:pb-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[.22em] text-coffee">{t("eyebrow")}</p><h1 className="mt-4 max-w-2xl font-display text-5xl leading-[1.02] text-espresso sm:text-7xl">{t("title")}</h1><div className="mt-14"><MenuBrowser products={products} categories={categories} locale={locale} /></div></div></section>; }
