"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const navKeys = ["home", "about", "menu", "stories", "contact"] as const;
const paths = ["/", "/about", "/menu", "/stories", "/contact"] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const alternate = locale === "vi" ? "en" : "vi";
  const changeLocale = () => router.replace(pathname, { locale: alternate });
  const home = pathname === "/";
  return (
    <header
      className={`absolute inset-x-0 top-0 z-40 ${home ? "text-white" : "border-b bg-background/90 text-espresso backdrop-blur-md"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          aria-label="7mmcoffee home"
          className="font-display text-2xl tracking-tight">
          7mmcoffee
        </Link>
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {navKeys.map((key, index) => (
            <Link
              key={key}
              href={paths[index]}
              className={`transition ${home ? "hover:text-cream" : "hover:text-coffee"}`}>
              {t(key)}
            </Link>
          ))}
          <button
            type="button"
            onClick={changeLocale}
            aria-label="Change language"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${home ? "border-white/35" : "border-espresso/20"}`}>
            {locale.toUpperCase()} <span className="opacity-50">/</span>{" "}
            {alternate.toUpperCase()}
          </button>
          <Button asChild size="sm" variant={home ? "secondary" : "outline"}>
            <Link href="/menu">{t("explore")}</Link>
          </Button>
        </nav>
        <button
          type="button"
          className={`rounded-full border p-2 lg:hidden ${home ? "border-white/35" : "border-espresso/20"}`}
          aria-label="Open menu"
          onClick={() => setOpen(true)}>
          <Menu size={20} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-espresso text-white lg:hidden">
            <div className="flex h-20 items-center justify-between px-5">
              <span className="font-display text-2xl">7mmcoffee</span>
              <button
                type="button"
                className="rounded-full border border-white/30 p-2"
                aria-label="Close menu"
                onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col px-5 pt-10">
              {navKeys.map((key, index) => (
                <Link
                  key={key}
                  href={paths[index]}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/15 py-5 font-display text-4xl">
                  {t(key)}
                </Link>
              ))}
              <button
                type="button"
                onClick={changeLocale}
                className="mt-8 w-fit rounded-full border border-white/30 px-4 py-2 text-sm">
                {locale === "vi" ? "English" : "Tiếng Việt"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
