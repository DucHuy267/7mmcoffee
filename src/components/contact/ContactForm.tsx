"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const t = useTranslations("Contact"); const common = useTranslations("Common"); const [message, setMessage] = useState<string | null>(null); const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", phone: "", message: "" } });
  async function submit(data: ContactInput) { setMessage(null); const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const payload: unknown = await response.json(); if (!response.ok) { const issue = payload as { message?: string }; setMessage(issue.message || "Unable to send your message."); return; } reset(); setMessage(common("success")); }
  return <form className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7" onSubmit={handleSubmit(submit)} noValidate><div className="grid gap-5 sm:grid-cols-2"><Field label={t("name")} error={errors.name?.message}><Input {...register("name")} autoComplete="name" /></Field><Field label={t("email")} error={errors.email?.message}><Input {...register("email")} type="email" autoComplete="email" /></Field></div><div className="mt-5"><Field label={t("phone")} error={errors.phone?.message}><Input {...register("phone")} type="tel" autoComplete="tel" /></Field></div><div className="mt-5"><Field label={t("message")} error={errors.message?.message}><Textarea {...register("message")} /></Field></div><Button type="submit" className="mt-6" disabled={isSubmitting}>{isSubmitting ? common("sending") : common("send")}</Button>{message && <p role="status" className="mt-4 text-sm text-coffee">{message}</p>}</form>;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-sm font-medium text-espresso"><span className="mb-2 block">{label}</span>{children}{error && <span className="mt-1.5 block text-xs font-normal text-red-700">{error}</span>}</label>; }
