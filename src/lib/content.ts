import "server-only";
import { connectToDatabase } from "@/lib/db";
import { About } from "@/models/About";
import { Category } from "@/models/Category";
import { ContactMessage } from "@/models/ContactMessage";
import { Product } from "@/models/Product";
import { SiteSettings } from "@/models/SiteSettings";
import { Story } from "@/models/Story";
import type { Locale, PublicAbout, PublicCategory, PublicProduct, PublicSettings, PublicStory } from "@/types/content";

type Id = { toString(): string };
type RawCategory = { _id: Id; nameVi: string; nameEn: string; descriptionVi: string; descriptionEn: string; slug: string; image: string; active: boolean };
type RawProduct = { _id: Id; nameVi: string; nameEn: string; descriptionVi: string; descriptionEn: string; slug: string; price: number; originalPrice?: number; image: string; gallery?: string[]; featured: boolean; category: RawCategory };
type RawStory = { _id: Id; titleVi: string; titleEn: string; excerptVi: string; excerptEn: string; contentVi: string; contentEn: string; slug: string; coverImage: string; category: string; author: string; publishedAt?: Date; featured: boolean; seoTitleVi: string; seoTitleEn: string; seoDescriptionVi: string; seoDescriptionEn: string };
type RawAbout = { heroTitleVi: string; heroTitleEn: string; heroSubtitleVi: string; heroSubtitleEn: string; heroImage: string; storyTitleVi: string; storyTitleEn: string; storyContentVi: string; storyContentEn: string; coffeeTitleVi: string; coffeeTitleEn: string; coffeeContentVi: string; coffeeContentEn: string; philosophy: Array<{ titleVi: string; titleEn: string; descriptionVi: string; descriptionEn: string }>; gallery: string[]; cta: { labelVi: string; labelEn: string; href: string } };
type RawSettings = { siteName: string; logo: string; heroVideo: string; heroImage: string; heroSloganVi: string; heroSloganEn: string; addressVi: string; addressEn: string; phone: string; email: string; openingHoursVi: string; openingHoursEn: string; googleMapsUrl: string; facebookUrl: string; instagramUrl: string; tiktokUrl: string };

function local(value: object, field: string, locale: Locale) { const fields = value as Record<string, unknown>; const preferred = fields[`${field}${locale === "vi" ? "Vi" : "En"}`]; const fallback = fields[`${field}Vi`]; return typeof preferred === "string" ? preferred : typeof fallback === "string" ? fallback : ""; }
function mapCategory(row: RawCategory, locale: Locale): PublicCategory { return { id: row._id.toString(), name: local(row, "name", locale), description: local(row, "description", locale), slug: row.slug, image: row.image, active: row.active }; }
function mapProduct(row: RawProduct, locale: Locale): PublicProduct { return { id: row._id.toString(), name: local(row, "name", locale), description: local(row, "description", locale), slug: row.slug, price: row.price, originalPrice: row.originalPrice, image: row.image, gallery: row.gallery ?? [], featured: row.featured, category: mapCategory(row.category, locale) }; }
function mapStory(row: RawStory, locale: Locale): PublicStory { return { id: row._id.toString(), title: local(row, "title", locale), excerpt: local(row, "excerpt", locale), content: local(row, "content", locale), slug: row.slug, coverImage: row.coverImage, category: row.category, author: row.author, publishedAt: row.publishedAt?.toISOString() ?? null, featured: row.featured, seoTitle: local(row, "seoTitle", locale), seoDescription: local(row, "seoDescription", locale) }; }

export async function getCategories(locale: Locale) {
  await connectToDatabase();
  const rows = await Category.find({ active: true }).sort({ displayOrder: 1, nameEn: 1 }).lean() as unknown as RawCategory[];
  return rows.map((row) => mapCategory(row, locale));
}

export async function getProducts(locale: Locale, options?: { featured?: boolean; category?: string; limit?: number }) {
  await connectToDatabase();
  const query: Record<string, unknown> = { active: true };
  if (options?.featured) query.featured = true;
  const rows = await Product.find(query).populate("category").sort({ displayOrder: 1, createdAt: -1 }).limit(options?.limit ?? 0).lean() as unknown as RawProduct[];
  return rows.filter((row) => row.category && (!options?.category || row.category.slug === options.category)).map((row) => mapProduct(row, locale));
}

export async function getProductBySlug(locale: Locale, slug: string) {
  await connectToDatabase();
  const row = await Product.findOne({ slug, active: true }).populate("category").lean() as unknown as RawProduct | null;
  return row?.category ? mapProduct(row, locale) : null;
}

export async function getStories(locale: Locale, options?: { featured?: boolean; limit?: number }) {
  await connectToDatabase();
  const query: Record<string, unknown> = { status: "published" };
  if (options?.featured) query.featured = true;
  const rows = await Story.find(query).sort({ publishedAt: -1, createdAt: -1 }).limit(options?.limit ?? 0).lean() as unknown as RawStory[];
  return rows.map((row) => mapStory(row, locale));
}

export async function getStoryBySlug(locale: Locale, slug: string) {
  await connectToDatabase();
  const row = await Story.findOne({ slug, status: "published" }).lean() as unknown as RawStory | null;
  return row ? mapStory(row, locale) : null;
}

export async function getAbout(locale: Locale): Promise<PublicAbout | null> {
  await connectToDatabase();
  const row = await About.findOne().lean() as unknown as RawAbout | null;
  if (!row) return null;
  return { heroTitle: local(row, "heroTitle", locale), heroSubtitle: local(row, "heroSubtitle", locale), heroImage: row.heroImage, storyTitle: local(row, "storyTitle", locale), storyContent: local(row, "storyContent", locale), coffeeTitle: local(row, "coffeeTitle", locale), coffeeContent: local(row, "coffeeContent", locale), philosophy: row.philosophy.map((item) => ({ title: local(item, "title", locale), description: local(item, "description", locale) })), gallery: row.gallery, cta: { label: local(row.cta, "label", locale), href: row.cta.href } };
}

export async function getSettings(locale: Locale): Promise<PublicSettings | null> {
  await connectToDatabase();
  const row = await SiteSettings.findOne().lean() as unknown as RawSettings | null;
  if (!row) return null;
  return { siteName: row.siteName, logo: row.logo, heroVideo: row.heroVideo, heroImage: row.heroImage, heroSlogan: local(row, "heroSlogan", locale), address: local(row, "address", locale), phone: row.phone, email: row.email, openingHours: local(row, "openingHours", locale), googleMapsUrl: row.googleMapsUrl, facebookUrl: row.facebookUrl, instagramUrl: row.instagramUrl, tiktokUrl: row.tiktokUrl };
}

export async function getDashboardStats() {
  await connectToDatabase();
  const [products, categories, stories, messages, activeProducts, publishedStories] = await Promise.all([Product.countDocuments(), Category.countDocuments(), Story.countDocuments(), ContactMessage.countDocuments(), Product.countDocuments({ active: true }), Story.countDocuments({ status: "published" })]);
  return { products, categories, stories, messages, activeProducts, publishedStories };
}
