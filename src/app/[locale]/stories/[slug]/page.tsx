import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, Calendar, UserRound } from "lucide-react";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStories, getStoryBySlug } from "@/lib/content";
import { StoryCard } from "@/components/stories/StoryCard";
import { ShareButton } from "@/components/stories/ShareButton";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const story = await getStoryBySlug(rawLocale as Locale, slug);
  return story
    ? {
        title: story.seoTitle || story.title,
        description: story.seoDescription || story.excerpt,
        openGraph: { images: [story.coverImage] },
      }
    : {};
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const story = await getStoryBySlug(locale, slug);
  if (!story) notFound();
  const [stories, t, common] = await Promise.all([
    getStories(locale, { limit: 4 }),
    getTranslations("Stories"),
    getTranslations("Common"),
  ]);
  const date = story.publishedAt
    ? format(new Date(story.publishedAt), "dd MMMM, yyyy", {
        locale: locale === "vi" ? vi : enUS,
      })
    : "";
  return (
    <>
      <article className="pb-20 pt-28">
        <header className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Link
            href="/stories"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-espresso"
          >
            <ArrowLeft size={16} />
            {t("eyebrow")}
          </Link>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[.2em] text-coffee">
            {story.category}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.03] text-espresso sm:text-7xl">
            {story.title}
          </h1>
          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <UserRound size={15} />
              {t("by")} {story.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={15} />
              {date}
            </span>
          </div>
        </header>
        <div className="relative mx-auto mt-12 aspect-[16/9] max-w-6xl overflow-hidden rounded-3xl bg-muted">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 px-5 md:grid-cols-[1fr_10rem] lg:px-8">
          <div className="prose-coffee text-base">
            {story.content.split(/\n{2,}/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ShareButton label={t("share")} />
        </div>
      </article>
      {stories.filter((item) => item.id !== story.id).length > 0 && (
        <section className="bg-[#ebe4da] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-4xl text-espresso">
              {common("related")}
            </h2>
            <div className="mt-9 grid gap-9 md:grid-cols-3">
              {stories
                .filter((item) => item.id !== story.id)
                .slice(0, 3)
                .map((item) => (
                  <StoryCard key={item.id} story={item} locale={locale} />
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
