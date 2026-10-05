"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <html><body className="grid min-h-screen place-items-center bg-background p-5 text-foreground"><div className="max-w-md text-center"><h1 className="font-display text-5xl text-espresso">A quiet pause.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">We couldn’t load this page. Please try again in a moment.</p><Button className="mt-7" onClick={reset}>Try again</Button></div></body></html>; }
