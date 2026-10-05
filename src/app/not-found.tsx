import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-background p-5 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-coffee">
          404
        </p>
        <h1 className="mt-3 font-display text-6xl text-espresso">
          This cup is empty.
        </h1>
        <Button asChild className="mt-7">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
