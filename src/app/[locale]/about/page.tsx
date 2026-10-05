import type { Metadata } from "next";
import Image from "next/image";
import { Coffee, Heart, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAbout } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContentMissing } from "@/components/shared/ContentMissing";
import type { Locale } from "@/types/content";

export const metadata: Metadata = {
  title: "About",
  description: "The story and philosophy behind 7mmcoffee.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale as Locale;
  setRequestLocale(locale);
  const [about, t] = await Promise.all([
    getAbout(locale),
    getTranslations("About"),
  ]);
  if (!about) return <ContentMissing />;
  const icons = [Coffee, Heart, Sparkles];
  return (
    <>
      <section className="relative flex min-h-[36rem] items-end overflow-hidden bg-espresso px-5 pb-16 pt-32 text-white lg:px-8 lg:pb-20">
        <Image
          src={about.heroImage}
          alt={about.heroTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-cream/70">
            7mmcoffee
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[.95] sm:text-7xl">
            {about.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-cream/85">
            {about.heroSubtitle}
          </p>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <FadeIn className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <SectionHeading eyebrow="Our story" title={about.storyTitle} />
          <div className="prose-coffee max-w-2xl whitespace-pre-line text-base">
            {about.storyContent}
          </div>
        </FadeIn>
      </section>
      <section className="bg-[#ebe4da] px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading eyebrow="What guides us" title={t("philosophy")} />
          </FadeIn>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {about.philosophy.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <FadeIn key={item.title} delay={index * 0.08}>
                  <article className="h-full rounded-2xl border bg-card p-6">
                    <Icon className="text-coffee" size={23} />
                    <h3 className="mt-8 font-display text-2xl text-espresso">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our craft"
            title={about.coffeeTitle || t("coffee")}
          />
          <p className="mt-6 max-w-2xl whitespace-pre-line leading-7 text-muted-foreground">
            {about.coffeeContent}
          </p>
          <h2 className="mt-16 font-display text-4xl text-espresso">
            {t("gallery")}
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {about.gallery.map((image, index) => (
              <FadeIn
                key={image}
                className={index === 0 ? "col-span-2 row-span-2" : ""}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={image}
                    alt={`7mmcoffee ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-coffee px-5 py-16 text-center text-white">
        <h2 className="font-display text-4xl">{about.cta.label}</h2>
        <Button asChild className="mt-6 bg-white text-espresso hover:bg-cream">
          <Link href={about.cta.href}>{about.cta.label}</Link>
        </Button>
      </section>
    </>
  );
}
