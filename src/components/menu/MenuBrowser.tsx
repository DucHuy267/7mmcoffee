"use client";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/ui/empty-state";
import type { Locale, PublicCategory, PublicProduct } from "@/types/content";

export function MenuBrowser({
  products,
  categories,
  locale,
}: {
  products: PublicProduct[];
  categories: PublicCategory[];
  locale: Locale;
}) {
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  const t = useTranslations("Menu");
  const common = useTranslations("Common");
  const results = useMemo(
    () =>
      products.filter(
        (product) =>
          (selected === "all" || product.category.slug === selected) &&
          `${product.name} ${product.description}`
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
      ),
    [products, selected, search],
  );
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Categories"
          className="flex gap-2 overflow-x-auto pb-1">
          {[{ slug: "all", name: common("all") }, ...categories].map(
            (category) => (
              <button
                key={category.slug}
                role="tab"
                aria-selected={selected === category.slug}
                type="button"
                onClick={() => setSelected(category.slug)}
                className={`min-h-10 shrink-0 rounded-full border px-4 text-sm transition ${selected === category.slug ? "border-espresso bg-espresso text-white" : "bg-card hover:border-coffee"}`}>
                {category.name}
              </button>
            ),
          )}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">{t("search")}</span>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={17}
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("search")}
            className="h-11 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none focus:border-coffee"
          />
        </label>
      </div>
      {results.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState>{t("noResults")}</EmptyState>
      )}
    </>
  );
}
