import Image from "next/image";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { Link } from "@/i18n/navigation";
import type { Locale, PublicStory } from "@/types/content";

export function StoryCard({
  story,
  locale,
}: {
  story: PublicStory;
  locale: Locale;
}) {
  const date = story.publishedAt
    ? format(new Date(story.publishedAt), "dd MMM, yyyy", {
        locale: locale === "vi" ? vi : enUS,
      })
    : "";
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee"
    >
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="pt-5">
          <div className="mb-3 flex gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-coffee">
            <span>{story.category}</span>
            <span className="text-muted-foreground">{date}</span>
          </div>
          <h3 className="font-display text-2xl leading-tight text-espresso group-hover:underline group-hover:decoration-coffee/50 group-hover:underline-offset-4">
            {story.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {story.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
