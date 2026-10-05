import { Coffee } from "lucide-react";

export function ContentMissing() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
        <Coffee className="mx-auto mb-4 text-coffee" size={28} />
        <h1 className="font-display text-3xl text-espresso">Almost ready.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Connect MongoDB and run the seed script to publish the first 7mmcoffee
          content.
        </p>
      </div>
    </section>
  );
}
