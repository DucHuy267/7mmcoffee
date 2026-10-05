import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { PublicProduct, Locale } from "@/types/content";

export function ProductCard({ product, locale }: { product: PublicProduct; locale: Locale }) {
  return <Link href={`/menu/${product.slug}`} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee"><article><div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />{product.featured && <Badge className="absolute left-3 top-3 bg-card/90">★</Badge>}</div><div className="flex items-start justify-between gap-3 px-1 pt-4"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-coffee">{product.category.name}</p><h3 className="font-display text-xl text-espresso">{product.name}</h3><p className="mt-1 line-clamp-2 max-w-[17rem] text-sm leading-5 text-muted-foreground">{product.description}</p></div><ArrowUpRight className="mt-5 shrink-0 text-coffee transition group-hover:-translate-y-1 group-hover:translate-x-1" size={19} /></div><div className="px-1 pt-3 text-sm font-semibold text-espresso">{formatPrice(product.price, locale)}</div></article></Link>;
}
