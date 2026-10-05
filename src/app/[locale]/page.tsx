import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAbout, getProducts, getSettings, getStories } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { ContactPreview } from "@/components/home/ContactPreview";
import { ProductCard } from "@/components/products/ProductCard";
import { StoryCard } from "@/components/stories/StoryCard";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContentMissing } from "@/components/shared/ContentMissing";
import type { Locale } from "@/types/content";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: paramLocale } = await params; const locale = paramLocale as Locale; setRequestLocale(locale);
  const [settings, about, products, stories, t] = await Promise.all([getSettings(locale), getAbout(locale), getProducts(locale, { featured: true, limit: 8 }), getStories(locale, { limit: 3 }), getTranslations("Home")]);
  if (!settings) return <ContentMissing />;
  return <><Hero settings={settings} /><section id="introduction" className="px-5 py-20 lg:px-8 lg:py-28"><FadeIn className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-coffee">{t("introEyebrow")}</p></div><div><h2 className="max-w-2xl font-display text-4xl leading-tight text-espresso sm:text-6xl">{t("introTitle")}</h2><p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">{about?.storyContent || t("introText")}</p><Button asChild variant="outline" className="mt-8"><Link href="/about">{(await getTranslations("Navigation"))("ourStory")} <ArrowRight size={16} /></Link></Button></div></FadeIn></section><section className="bg-[#ebe4da] px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><FadeIn><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow={t("featuredEyebrow")} title={t("featuredTitle")} /><Button asChild variant="outline"><Link href="/menu">{(await getTranslations("Common"))("viewAll")} <ArrowRight size={16} /></Link></Button></div></FadeIn><div className="mt-11 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{products.map((product) => <FadeIn key={product.id}><ProductCard product={product} locale={locale} /></FadeIn>)}</div></div></section><section className="overflow-hidden bg-espresso px-5 py-20 text-cream lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center"><FadeIn><p className="text-xs font-semibold uppercase tracking-[.22em] text-cream/60">{t("storyEyebrow")}</p><h2 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] text-white sm:text-6xl">{t("storyTitle")}</h2><p className="mt-6 max-w-lg leading-7 text-cream/70">{t("storyText")}</p><Button asChild variant="secondary" className="mt-8"><Link href="/about">{(await getTranslations("Navigation"))("ourStory")}</Link></Button></FadeIn>{about?.heroImage && <FadeIn className="relative aspect-[5/4] overflow-hidden rounded-2xl"><Image src={about.heroImage} alt="7mmcoffee" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" /></FadeIn>}</div></section><section className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><FadeIn><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow={t("latestEyebrow")} title={t("latestTitle")} /><Button asChild variant="outline"><Link href="/stories">{(await getTranslations("Common"))("viewAll")} <ArrowRight size={16} /></Link></Button></div></FadeIn><div className="mt-11 grid gap-9 md:grid-cols-3">{stories.map((story) => <FadeIn key={story.id}><StoryCard story={story} locale={locale} /></FadeIn>)}</div></div></section><ContactPreview settings={settings} /></>;
}
