import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProductBySlug, getProducts } from "@/lib/content";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const product = await getProductBySlug(rawLocale as Locale, slug);
  return product
    ? {
        title: product.name,
        description: product.description,
        openGraph: { images: [product.image] },
      }
    : {};
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const product = await getProductBySlug(locale, slug);
  if (!product) notFound();
  const [related, t] = await Promise.all([
    getProducts(locale, { category: product.category.slug, limit: 5 }),
    getTranslations("Common"),
  ]);
  return (
    <>
      <section className="px-5 pb-20 pt-28 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/menu"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-espresso"
          >
            <ArrowLeft size={16} />
            {t("backToMenu")}
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-coffee">
                {product.category.name}
              </p>
              <h1 className="mt-4 font-display text-5xl leading-none text-espresso sm:text-6xl">
                {product.name}
              </h1>
              <p className="mt-6 text-lg font-semibold text-espresso">
                {formatPrice(product.price, locale)}
              </p>
              <p className="mt-6 max-w-lg whitespace-pre-line leading-7 text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>
          {product.gallery.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-4">
              {product.gallery.map((image) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden rounded-2xl"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {related.filter((item) => item.id !== product.id).length > 0 && (
        <section className="bg-[#ebe4da] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-4xl text-espresso">
              {t("related")}
            </h2>
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 lg:gap-x-6">
              {related
                .filter((item) => item.id !== product.id)
                .slice(0, 4)
                .map((item) => (
                  <ProductCard key={item.id} product={item} locale={locale} />
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
