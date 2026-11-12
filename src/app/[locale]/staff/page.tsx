import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { StaffPortal } from "@/components/staff/StaffPortal";
import { getPublicStaff, getStaffPortalData } from "@/lib/content";
import { weekStartFor } from "@/lib/staff-dates";
import type { Locale } from "@/types/content";

export const metadata: Metadata = {
  title: "Staff schedule",
  description: "7mmcoffee team work schedules and Deep Clean tasks.",
};

export default async function StaffPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale as Locale);
  const initialWeek = weekStartFor();
  const [staff, data] = await Promise.all([getPublicStaff(), getStaffPortalData(initialWeek)]);
  return <StaffPortal staff={staff} initialSchedules={data.schedules} initialTasks={data.tasks} initialWeek={initialWeek} />;
}
